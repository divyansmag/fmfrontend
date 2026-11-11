import { pool, query } from './db.js';
import { httpError } from './errors.js';

export const COURSE_META = { id: 'ai-foundations', title: 'AI Foundations' };

const CH_KNOWN = ['id', 'order', 'grade', 'number', 'title', 'status', 'tags', 'units'];
const UN_KNOWN = ['id', 'order', 'grade', 'title', 'subtopics'];
const ST_KNOWN = ['id', 'order', 'grade', 'title', 'assets'];
const AS_KNOWN = ['id', 'order', 'grade', 'title', 'type', 'data'];

const LIMITS = { chapters: 200, units: 2000, subtopics: 5000, assets: 20000 };

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function reqStr(v, field, max = 500) {
  if (typeof v !== 'string' || !v.trim()) throw httpError(400, `${field} must be a non-empty string`);
  if (v.length > max) throw httpError(400, `${field} is too long`);
  return v;
}
const optStr = (v, max = 200) => (v === undefined || v === null || v === '' ? null : String(v).slice(0, max));
const num = (v, fallback) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Math.trunc(Number(v)) : fallback);
const extraOf = (obj, known) => Object.fromEntries(Object.entries(obj).filter(([k]) => !known.includes(k)));

/** Validate + flatten the nested CMS tree into one array per table. */
export function flattenTree(tree) {
  if (!isObj(tree) || !Array.isArray(tree.chapters)) throw httpError(400, 'Body must be { chapters: [...] }');
  const out = { chapters: [], units: [], subtopics: [], assets: [] };
  const seen = { chapters: new Set(), units: new Set(), subtopics: new Set(), assets: new Set() };
  const claim = (table, id) => {
    if (seen[table].has(id)) throw httpError(400, `Duplicate ${table} id: ${id}`);
    seen[table].add(id);
    if (seen[table].size > LIMITS[table]) throw httpError(400, `Too many ${table}`);
  };

  tree.chapters.filter(Boolean).forEach((ch, ci) => {
    if (!isObj(ch)) throw httpError(400, 'Invalid chapter');
    const chId = reqStr(ch.id, 'chapter.id', 200);
    claim('chapters', chId);
    out.chapters.push({
      id: chId,
      position: ci,
      sort_order: num(ch.order, ci + 1),
      grade: String(ch.grade ?? '6').slice(0, 10),
      number: optStr(ch.number, 10),
      title: reqStr(ch.title, 'chapter.title'),
      status: optStr(ch.status, 20),
      tags: Array.isArray(ch.tags) ? ch.tags.filter((t) => typeof t === 'string').slice(0, 50) : [],
      extra: extraOf(ch, CH_KNOWN),
    });
    (Array.isArray(ch.units) ? ch.units : []).filter(Boolean).forEach((un, ui) => {
      const unId = reqStr(un.id, 'unit.id', 200);
      claim('units', unId);
      out.units.push({
        id: unId, chapter_id: chId, position: ui, sort_order: num(un.order, ui + 1),
        grade: optStr(un.grade, 10), title: reqStr(un.title, 'unit.title'), extra: extraOf(un, UN_KNOWN),
      });
      (Array.isArray(un.subtopics) ? un.subtopics : []).filter(Boolean).forEach((st, si) => {
        const stId = reqStr(st.id, 'subtopic.id', 200);
        claim('subtopics', stId);
        out.subtopics.push({
          id: stId, unit_id: unId, position: si, sort_order: num(st.order, si + 1),
          grade: optStr(st.grade, 10), title: reqStr(st.title, 'subtopic.title'), extra: extraOf(st, ST_KNOWN),
        });
        (Array.isArray(st.assets) ? st.assets : []).filter(Boolean).forEach((as, ai) => {
          const asId = reqStr(as.id, 'asset.id', 200);
          claim('assets', asId);
          if (typeof as.type !== 'string' || !/^[a-z][a-z0-9_]*$/.test(as.type)) {
            throw httpError(400, `asset ${asId}: invalid type`);
          }
          if (as.data !== undefined && !isObj(as.data)) throw httpError(400, `asset ${asId}: data must be an object`);
          out.assets.push({
            id: asId, subtopic_id: stId, position: ai, sort_order: num(as.order, ai + 1),
            grade: optStr(as.grade, 10), title: reqStr(as.title, 'asset.title'), type: as.type,
            data: as.data ?? {}, extra: extraOf(as, AS_KNOWN),
          });
        });
      });
    });
  });
  return out;
}

/** Replace the whole course atomically. Refuses an empty course so a client bug can't wipe the content. */
export async function replaceTree(tree) {
  const flat = flattenTree(tree);
  if (flat.chapters.length === 0) throw httpError(400, 'Refusing to save a course with no chapters');

  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query('delete from chapters'); // cascades to units, subtopics, assets
    await client.query(
      `insert into chapters (id, position, sort_order, grade, number, title, status, tags, extra)
       select id, position, sort_order, grade, number, title, status, tags, extra
       from jsonb_to_recordset($1::jsonb) as x(id text, position int, sort_order int, grade text, number text, title text, status text, tags text[], extra jsonb)`,
      [JSON.stringify(flat.chapters)]
    );
    if (flat.units.length) {
      await client.query(
        `insert into units (id, chapter_id, position, sort_order, grade, title, extra)
         select id, chapter_id, position, sort_order, grade, title, extra
         from jsonb_to_recordset($1::jsonb) as x(id text, chapter_id text, position int, sort_order int, grade text, title text, extra jsonb)`,
        [JSON.stringify(flat.units)]
      );
    }
    if (flat.subtopics.length) {
      await client.query(
        `insert into subtopics (id, unit_id, position, sort_order, grade, title, extra)
         select id, unit_id, position, sort_order, grade, title, extra
         from jsonb_to_recordset($1::jsonb) as x(id text, unit_id text, position int, sort_order int, grade text, title text, extra jsonb)`,
        [JSON.stringify(flat.subtopics)]
      );
    }
    if (flat.assets.length) {
      await client.query(
        `insert into assets (id, subtopic_id, position, sort_order, grade, title, type, data, extra)
         select id, subtopic_id, position, sort_order, grade, title, type, data, extra
         from jsonb_to_recordset($1::jsonb) as x(id text, subtopic_id text, position int, sort_order int, grade text, title text, type text, data jsonb, extra jsonb)`,
        [JSON.stringify(flat.assets)]
      );
    }
    await client.query('commit');
  } catch (err) {
    await client.query('rollback').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
  return {
    chapters: flat.chapters.length, units: flat.units.length,
    subtopics: flat.subtopics.length, assets: flat.assets.length,
  };
}

/** Rebuild the exact nested shape the frontend (courseData.js) already consumes. */
export async function loadTree() {
  const [ch, un, st, as] = await Promise.all([
    query('select * from chapters order by position, id'),
    query('select * from units order by position, id'),
    query('select * from subtopics order by position, id'),
    query('select * from assets order by position, id'),
  ]);
  const group = (rows, key) => {
    const m = new Map();
    for (const r of rows) {
      if (!m.has(r[key])) m.set(r[key], []);
      m.get(r[key]).push(r);
    }
    return m;
  };
  const unitsBy = group(un.rows, 'chapter_id');
  const subsBy = group(st.rows, 'unit_id');
  const assetsBy = group(as.rows, 'subtopic_id');
  const opt = (k, v) => (v === null || v === undefined ? {} : { [k]: v });

  return {
    ...COURSE_META,
    chapters: ch.rows.map((c) => ({
      id: c.id, order: c.sort_order, grade: c.grade, ...opt('number', c.number),
      title: c.title, ...opt('status', c.status), tags: c.tags, ...c.extra,
      units: (unitsBy.get(c.id) || []).map((u) => ({
        id: u.id, order: u.sort_order, ...opt('grade', u.grade), title: u.title, ...u.extra,
        subtopics: (subsBy.get(u.id) || []).map((s) => ({
          id: s.id, order: s.sort_order, ...opt('grade', s.grade), title: s.title, ...s.extra,
          assets: (assetsBy.get(s.id) || []).map((a) => ({
            id: a.id, order: a.sort_order, ...opt('grade', a.grade), title: a.title,
            type: a.type, data: a.data, ...a.extra,
          })),
        })),
      })),
    })),
  };
}

/** Plain-text view of a lesson for the tutor prompt. Never includes quiz answers. */
export async function lessonContext(assetId) {
  const { rows } = await query(
    `select a.id, a.title, a.type, a.data, s.title as subtopic, u.title as unit, c.title as chapter
       from assets a
       join subtopics s on s.id = a.subtopic_id
       join units u on u.id = s.unit_id
       join chapters c on c.id = u.chapter_id
      where a.id = $1`,
    [assetId]
  );
  const a = rows[0];
  if (!a) return null;
  const d = a.data || {};
  let body = '';
  switch (a.type) {
    case 'summary': body = d.body || stripHtml(d.html || ''); break;
    case 'lab': body = d.instructions || ''; break;
    case 'flashcards': body = (d.cards || []).map((c) => `${c.front}: ${c.back}`).join('\n'); break;
    case 'quiz': body = (d.questions || []).map((q) => `Question: ${q.question} Options: ${(q.options || []).join(' | ')}`).join('\n'); break;
    case 'mindmap': body = d.outline || JSON.stringify(d.tree || '').slice(0, 3000); break;
    default: body = d.description || '';
  }
  return {
    heading: `${a.chapter} > ${a.unit} > ${a.subtopic} > ${a.title} (${a.type})`,
    text: String(body).slice(0, 6000),
  };
}

const stripHtml = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
