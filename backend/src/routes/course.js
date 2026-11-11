import { Router } from 'express';
import express from 'express';
import { requireAuth, requireRole } from '../auth.js';
import { loadTree, replaceTree } from '../courseStore.js';
import { readSeedCourse } from '../db.js';

const router = Router();

// Any signed-in user can read the course.
router.get('/', requireAuth, async (req, res) => {
  const tree = await loadTree();
  if (req.user?.role === 'student') {
    const studentGrade = String(req.user.grade ?? '');
    const filteredChapters = tree.chapters.filter((ch) => {
      const matchGrade = String(ch.grade) === studentGrade;
      const status = String(ch.status || '').toLowerCase();
      const isSkipped = status === 'locked' || status === 'draft';
      return matchGrade && !isSkipped;
    });
    return res.json({ ...tree, chapters: filteredChapters });
  }
  res.json(tree);
});

// Only admins can change it. This is what "CMS is admin-only" means: the server refuses everyone else.
router.put('/', ...requireRole('admin'), express.json({ limit: '25mb' }), async (req, res) => {
  const saved = await replaceTree(req.body);
  res.json({ ok: true, saved });
});

// Replaces the old client-side "password 1234" reset button.
router.post('/reset', ...requireRole('admin'), async (_req, res) => {
  const saved = await replaceTree(readSeedCourse());
  res.json({ ok: true, saved, course: await loadTree() });
});

export default router;
