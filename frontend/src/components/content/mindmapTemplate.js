import { DEFAULT_AI_MINDMAP_TREE } from '../../data/courseData';

/**
 * Converts a markdown outline (indented with 2 spaces) to the mindmap tree format
 */
export function outlineToMindmapTree(outline, fallbackTitle = 'Mindmap') {
  if (!outline || typeof outline !== 'string') return null;

  const lines = outline
    .split('\n')
    .map((l) => l.replace(/\t/g, '  '))
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return null;

  const root = { text: fallbackTitle, children: [] };
  const stack = [{ indent: -1, node: root }];

  for (const line of lines) {
    const leadingSpaces = line.match(/^ */)?.[0].length || 0;
    const indent = Math.floor(leadingSpaces / 2);
    const text = line.replace(/^\s*[-*#\d.]*\s*/, '').trim();
    if (!text) continue;

    const node = { text, fact: `Key concept: ${text}` };

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].node;
    if (!parent.children) parent.children = [];
    parent.children.push(node);
    stack.push({ indent, node });
  }

  // If root only has one child, use that as root
  if (root.children.length === 1 && !root.text) {
    return root.children[0];
  }
  return root;
}

/**
 * Resolve mindmap data to a valid tree
 */
export function resolveMindmapTree(data, fallbackTitle = 'Mindmap') {
  if (!data) return DEFAULT_AI_MINDMAP_TREE;
  if (data.tree && typeof data.tree === 'object' && data.tree.text) {
    return data.tree;
  }
  if (data.outline) {
    const parsed = outlineToMindmapTree(data.outline, fallbackTitle);
    if (parsed) return parsed;
  }
  return DEFAULT_AI_MINDMAP_TREE;
}

/**
 * Generates the full HTML document for AI_Mindmap_ST1 with dynamic data injected.
 * Preserves 100% of the interactive features, Web Audio synth, pan/zoom, popups,
 * search, badges, and confetti while keeping styles strictly scoped.
 */
export function buildMindmapDocument(treeData, sourceLabel = 'FutureMinds AI Guide') {
  const safeDataJson = JSON.stringify(treeData || DEFAULT_AI_MINDMAP_TREE)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');

  const safeSourceLabel = JSON.stringify(sourceLabel || 'FutureMinds AI Guide');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Interactive Mindmap</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg-a:#FAF9FD;
    --bg-b:#FCF7FB;
    --panel:#FFFFFF;
    --text:#1E1830;
    --muted:#6E6685;
    --border:#DCD0F5;
    --root-a:#6D42D6;
    --root-b:#8B5CF6;
    --lvl1:#FFFFFF;
    --lvl1-border:#DCD0F5;
    --lvl2:#E6D9FD;
    --lvl2-border:#C4A8F7;
    --lvl2-text:#5B21B6;
    --gold:#F5A623;
    --green:#22A559;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;height:100%;background:linear-gradient(135deg, var(--bg-a) 0%, var(--bg-a) 45%, var(--bg-b) 100%);font-family:'Baloo 2', 'Segoe UI', sans-serif;}
  #app{position:relative;width:100%;height:100vh;overflow:hidden;}

  /* floating decorative blobs */
  .blob{position:absolute;border-radius:50%;filter:blur(40px);opacity:.35;pointer-events:none;z-index:0;animation:drift 14s ease-in-out infinite;}
  .blob1{width:260px;height:260px;background:#C9AFFB;top:-60px;left:10%;animation-delay:0s;}
  .blob2{width:200px;height:200px;background:#FBD0EA;bottom:-40px;right:8%;animation-delay:3s;}
  .blob3{width:160px;height:160px;background:#B9E4D0;top:40%;right:20%;animation-delay:6s;}
  @keyframes drift{0%,100%{transform:translateY(0px) translateX(0px);}50%{transform:translateY(-22px) translateX(14px);}}
  @media (prefers-reduced-motion: reduce){.blob{animation:none;}}

  /* top bar */
  #topbar{position:absolute;top:0;left:0;right:0;padding:16px 20px;color:var(--text);z-index:10;}
  #topbar-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;}
  #topbar h1{font-size:20px;font-weight:700;margin:0 0 8px;}
  #topbar .src{display:inline-block;font-family:'JetBrains Mono', monospace;font-size:12px;letter-spacing:.03em;color:#7C3AED;background:#fff;border:1px solid var(--border);border-radius:16px;padding:5px 12px;}

  #progress-wrap{min-width:220px;}
  #progress-label{font-size:12px;color:var(--muted);font-weight:600;margin-bottom:6px;text-align:right;}
  #progress-track{width:220px;height:10px;border-radius:6px;background:#EFE8FB;overflow:hidden;border:1px solid var(--border);position:relative;}
  #progress-fill{height:100%;width:0%;background:linear-gradient(90deg, var(--root-a), var(--root-b));border-radius:6px;transition:width .5s ease;position:relative;overflow:hidden;}
  #progress-fill::after{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);width:40%;animation:shimmer 1.8s ease-in-out infinite;}
  @keyframes shimmer{0%{transform:translateX(-120%);}100%{transform:translateX(340%);}}

  #badges{display:flex;gap:6px;justify-content:flex-end;margin-top:8px;}
  .badge{width:26px;height:26px;border-radius:50%;background:#EFE8FB;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;color:#C4B5E8;transition:all .3s cubic-bezier(.34,1.56,.64,1);}
  .badge svg{width:14px;height:14px;}
  .badge.won{background:linear-gradient(135deg,#FFD873,#F5A623);border-color:#F5A623;color:#fff;transform:scale(1.12);box-shadow:0 3px 10px rgba(245,166,35,.4);animation:badgepop .5s cubic-bezier(.34,1.56,.64,1);}
  @keyframes badgepop{0%{transform:scale(.5) rotate(-15deg);}60%{transform:scale(1.25) rotate(8deg);}100%{transform:scale(1.12) rotate(0deg);}}

  #sound-toggle{width:34px;height:34px;border-radius:50%;border:1.5px solid var(--border);background:#fff;color:#7C3AED;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  #sound-toggle svg{width:16px;height:16px;}
  #sound-toggle:hover{background:#F6F1FE;}

  #toolbar{display:flex;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap;}
  #search-wrap{position:relative;}
  #search{font-family:'Baloo 2', sans-serif;font-size:13px;font-weight:600;color:var(--text);background:#fff;border:1px solid var(--border);border-radius:16px;padding:8px 14px 8px 34px;width:190px;outline:none;transition:border-color .15s, box-shadow .15s;}
  #search:focus{border-color:#8B5CF6;box-shadow:0 0 0 3px rgba(139,92,246,.15);}
  #search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9B8FC0;pointer-events:none;}
  .tbtn{font-family:'Baloo 2', sans-serif;font-weight:600;font-size:12.5px;color:#7C3AED;background:#fff;border:1px solid var(--border);border-radius:16px;padding:8px 14px;cursor:pointer;transition:background .15s, border-color .15s;}
  .tbtn:hover{background:#F6F1FE;border-color:#C4A8F7;}

  /* canvas that pans/zooms */
  #canvas{position:absolute;top:0;left:0;transform-origin:0 0;cursor:grab;z-index:1;}
  #canvas.dragging{cursor:grabbing;}
  #edges{position:absolute;top:0;left:0;overflow:visible;pointer-events:none;}
  #nodes{position:absolute;top:0;left:0;}

  .node{
    position:absolute;
    display:flex;align-items:center;gap:9px;
    padding:12px 16px;
    border-radius:12px;
    border:1.5px solid var(--lvl1-border);
    background:var(--lvl1);
    color:var(--text);
    font-family:'Baloo 2', 'Segoe UI', sans-serif;
    font-weight:600;
    font-size:14.5px;
    white-space:nowrap;
    cursor:pointer;
    user-select:none;
    opacity:1;
    box-shadow:0 3px 10px rgba(109,66,214,.14);
    transition:background .15s, box-shadow .15s, border-color .15s, transform .15s, left .4s cubic-bezier(.4,0,.2,1), top .4s cubic-bezier(.4,0,.2,1), opacity .3s ease;
  }
  .node.enter{ opacity:0; transform:translateX(-16px) scale(.97); }
  .node:hover{border-color:#8B5CF6;box-shadow:0 6px 20px rgba(109,66,214,.25);animation:wobble .45s ease;}
  @keyframes wobble{0%{transform:scale(1) rotate(0deg);}30%{transform:scale(1.05) rotate(-2deg);}60%{transform:scale(1.05) rotate(1.5deg);}100%{transform:scale(1.03) rotate(0deg);}}
  .node.pop{animation:pop .32s cubic-bezier(.34,1.56,.64,1);}
  @keyframes pop{0%{transform:scale(1);}45%{transform:scale(1.09);}100%{transform:scale(1);}}
  .node.highlight{animation:glow 1.1s ease;}
  @keyframes glow{0%,100%{box-shadow:0 3px 10px rgba(109,66,214,.14);}35%{box-shadow:0 0 0 6px rgba(139,92,246,.35);}}
  .node.invite{animation:invite 0.6s ease 2;}
  @keyframes invite{0%,100%{transform:rotate(0deg);}25%{transform:rotate(-3deg);}75%{transform:rotate(3deg);}}

  .edge{ opacity:1; transition:opacity .3s ease; }
  .edge.enter{ opacity:0; }

  .node.root{background:linear-gradient(135deg, var(--root-a), var(--root-b));border-color:transparent;color:#fff;font-size:16px;font-weight:700;padding:14px 18px;box-shadow:0 6px 22px rgba(76,29,149,.4);}
  .node.depth-2, .node.depth-3, .node.depth-4{background:var(--lvl2);border-color:var(--lvl2-border);color:var(--lvl2-text);}
  .node.complete{border-color:var(--gold);box-shadow:0 0 0 2px rgba(245,166,35,.3), 0 6px 18px rgba(245,166,35,.25);}
  .node.visited-leaf{border-color:var(--green);}

  .icon{width:18px;height:18px;min-width:18px;display:flex;align-items:center;justify-content:center;}
  .icon svg{width:100%;height:100%;}

  .toggle{
    width:24px;height:24px;min-width:24px;
    border-radius:50%;
    background:rgba(109,66,214,0.14);
    display:flex;align-items:center;justify-content:center;
    font-size:12px;color:#6D28D9;
    transition:background .15s, transform .2s;
  }
  .node.root .toggle{background:rgba(255,255,255,0.25);color:#fff;}
  .node:hover .toggle{background:rgba(109,66,214,0.24);}
  .node.root:hover .toggle{background:rgba(255,255,255,0.35);}
  .node:not(.has-children) .toggle{display:none;}

  .check-badge{
    position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;
    background:var(--green);display:flex;align-items:center;justify-content:center;color:#fff;
    box-shadow:0 1px 3px rgba(0,0,0,.25);
  }
  .check-badge svg{width:11px;height:11px;}

  /* zoom controls */
  #controls{position:absolute;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:10;}
  #controls button{
    width:34px;height:34px;border-radius:50%;border:1.5px solid var(--border);
    background:#fff;color:#7C3AED;font-size:16px;cursor:pointer;
    box-shadow:0 2px 10px rgba(109,66,214,.15);
    transition:background .15s, border-color .15s;
  }
  #controls button:hover{background:#F6F1FE;border-color:#D6C6FB;}

  /* fact popup */
  #overlay{position:fixed;inset:0;background:rgba(30,24,48,.25);display:none;align-items:center;justify-content:center;z-index:100;}
  #overlay.show{display:flex;}
  #popup{
    background:#fff;border-radius:18px;max-width:420px;width:90%;padding:22px 24px 20px;
    box-shadow:0 20px 60px rgba(76,29,149,.35);
    transform:translateY(12px) scale(.96);opacity:0;transition:transform .25s cubic-bezier(.34,1.56,.64,1), opacity .2s;
  }
  #overlay.show #popup{transform:translateY(0) scale(1);opacity:1;}
  #popup-head{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
  #popup-icon{width:32px;height:32px;border-radius:50%;background:#EFE8FB;color:#7C3AED;display:flex;align-items:center;justify-content:center;}
  #popup-icon svg{width:18px;height:18px;}
  #popup-title{font-size:17px;font-weight:700;color:var(--text);flex:1;}
  #popup-close{background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;border-radius:50%;display:flex;}
  #popup-close svg{width:18px;height:18px;}
  #popup-close:hover{color:var(--text);background:#F6F1FE;}
  #popup-fact{font-size:14px;line-height:1.55;color:var(--text);margin:0 0 16px;font-weight:500;}
  #popup-read{
    font-family:'Baloo 2', sans-serif;font-size:12.5px;font-weight:600;
    color:#7C3AED;background:#F6F1FE;border:1px solid #DCD0F5;border-radius:14px;
    padding:6px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;
  }
  #popup-read svg{width:14px;height:14px;}
  #popup-read:hover{background:#EFE8FB;}

  /* finale card */
  #finale{position:fixed;inset:0;background:rgba(30,24,48,.45);display:none;align-items:center;justify-content:center;z-index:110;}
  #finale.show{display:flex;}
  #finale-card{
    background:#fff;border-radius:24px;max-width:440px;width:90%;padding:32px 28px 26px;text-align:center;
    box-shadow:0 25px 70px rgba(76,29,149,.4);animation:pop .4s cubic-bezier(.34,1.56,.64,1);
  }
  #finale-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#FFD873,#F5A623);color:#fff;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 8px 24px rgba(245,166,35,.45);}
  #finale-icon svg{width:34px;height:34px;}
  #finale-title{font-size:22px;font-weight:700;color:var(--text);margin-bottom:8px;}
  #finale-sub{font-size:14px;color:var(--muted);line-height:1.5;margin:0 0 20px;font-weight:500;}
  #finale-close{
    font-family:'Baloo 2', sans-serif;font-size:14px;font-weight:700;color:#fff;
    background:linear-gradient(135deg, var(--root-a), var(--root-b));border:none;
    border-radius:16px;padding:10px 24px;cursor:pointer;box-shadow:0 4px 14px rgba(109,66,214,.35);
  }

  /* confetti */
  .confetti-piece{
    position:fixed;width:8px;height:12px;border-radius:2px;pointer-events:none;z-index:120;
    animation:confetti-fall 1.2s ease-out forwards;
  }
  @keyframes confetti-fall{
    0%{opacity:1;transform:translate(0,0) rotate(0deg);}
    100%{opacity:0;transform:translate(var(--dx), var(--dy)) rotate(var(--rot));}
  }
</style>
</head>
<body>
<div id="app">
  <div class="blob blob1"></div>
  <div class="blob blob2"></div>
  <div class="blob blob3"></div>

  <div id="topbar">
    <div id="topbar-row">
      <div>
        <h1 id="title"></h1>
        <span class="src" id="srcLabel"></span>
        <div id="toolbar">
          <div id="search-wrap">
            <span id="search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
            <input id="search" type="text" placeholder="Search topic...">
          </div>
          <button class="tbtn" id="expandAll">Expand all</button>
          <button class="tbtn" id="collapseAll">Collapse all</button>
        </div>
      </div>
      <div id="progress-wrap">
        <div id="progress-label">0 / 0 topics explored</div>
        <div id="progress-track"><div id="progress-fill"></div></div>
        <div id="badges"></div>
      </div>
    </div>
  </div>

  <div id="canvas">
    <svg id="edges"></svg>
    <div id="nodes"></div>
  </div>

  <div id="controls">
    <button id="soundToggle" aria-label="Toggle sound"></button>
    <button id="zoomIn">+</button>
    <button id="zoomOut">&minus;</button>
    <button id="zoomReset">&#10021;</button>
  </div>
</div>

<div id="finale">
  <div id="finale-card">
    <div id="finale-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a2 2 0 0 0 0 4h1M17 5h3a2 2 0 0 1 0 4h-1"/></svg></div>
    <div id="finale-title">You explored it all!</div>
    <p id="finale-sub">Every topic in the map is complete. Great job exploring this mindmap!</p>
    <button id="finale-close">Awesome!</button>
  </div>
</div>

<div id="overlay">
  <div id="popup">
    <div id="popup-head">
      <div id="popup-icon"></div>
      <div id="popup-title"></div>
      <button id="popup-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <p id="popup-fact"></p>
    <button id="popup-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg> Read aloud</button>
  </div>
</div>

<div id="confetti-layer"></div>

<script>
/* ---------- DYNAMIC DATA INJECTED BY FUTUREMINDS ---------- */
const DATA = ${safeDataJson};
const SOURCE_LABEL = ${safeSourceLabel};

document.getElementById("title").textContent = DATA.text || "Mindmap";
document.getElementById("srcLabel").textContent = "View " + SOURCE_LABEL;

/* ---------- icons (outline SVG, no emoji) ---------- */
const ICON = {
  root: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V16h6v-1.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 2Z"/></svg>',
  branch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
};

let idCounter = 0;
let allLeaves = [];
function prepare(node, depth, parent){
  node.id = "n" + (idCounter++);
  node.depth = depth;
  node.parent = parent || null;
  node.collapsed = node.collapsed ?? (depth >= 1);
  if(node.children && node.children.length){
    node.children.forEach(c => prepare(c, depth+1, node));
  } else {
    allLeaves.push(node);
  }
}
prepare(DATA, 0, null);
const TOTAL_LEAVES = allLeaves.length;
const visited = new Set();

/* ---------- sound effects (Web Audio, no external files) ---------- */
let soundOn = true;
let audioCtx = null;
function ctx(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq, start, dur, type, gainPeak){
  const c = ctx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainPeak || 0.12, c.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.02);
}
function playClick(){ if(!soundOn) return; try{ tone(720, 0, 0.08, "sine", 0.08); }catch(e){} }
function playChime(){ if(!soundOn) return; try{
  tone(523.25, 0,    0.18, "triangle", 0.13);
  tone(659.25, 0.09, 0.18, "triangle", 0.13);
  tone(783.99, 0.18, 0.28, "triangle", 0.15);
}catch(e){} }
function playFanfare(){ if(!soundOn) return; try{
  [523.25,659.25,783.99,1046.5].forEach((f,i)=> tone(f, i*0.12, 0.32, "triangle", 0.14));
}catch(e){} }

const soundIcons = {
  on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
};
const soundBtn = document.getElementById("soundToggle");
soundBtn.innerHTML = soundIcons.on;
soundBtn.addEventListener("click", ()=>{
  soundOn = !soundOn;
  soundBtn.innerHTML = soundOn ? soundIcons.on : soundIcons.off;
  if(soundOn) playClick();
});

/* ---------- badge strip (one badge per top-level branch) ---------- */
const badgesEl = document.getElementById("badges");
const starIcon = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.9L12 17.6 5.9 20.7l1.4-6.9L2.2 9.1l6.9-.8L12 2z"/></svg>';
(DATA.children || []).forEach(branch=>{
  const b = document.createElement("div");
  b.className = "badge";
  b.id = "badge-" + branch.id;
  b.title = branch.text;
  b.innerHTML = starIcon;
  badgesEl.appendChild(b);
});
function updateBadge(nodeId){
  const b = document.getElementById("badge-" + nodeId);
  if(b) b.classList.add("won");
}

/* ---------- finale & parent notification ---------- */
const finaleEl = document.getElementById("finale");
document.getElementById("finale-close").addEventListener("click", ()=> finaleEl.classList.remove("show"));
function maybeFinale(){
  if(TOTAL_LEAVES > 0 && visited.size === TOTAL_LEAVES){
    setTimeout(()=>{
      finaleEl.classList.add("show");
      playFanfare();
      for(let burst=0; burst<3; burst++){
        setTimeout(()=> burstConfettiAt(window.innerWidth/2 + (burst-1)*140, window.innerHeight*0.4), burst*220);
      }
      try {
        window.parent.postMessage({ type: 'FM_MINDMAP_COMPLETE' }, '*');
      } catch(e){}
    }, 500);
  }
}

function updateProgress(){
  const n = visited.size;
  document.getElementById("progress-label").textContent = n + " / " + TOTAL_LEAVES + " topics explored";
  document.getElementById("progress-fill").style.width = (TOTAL_LEAVES ? (n/TOTAL_LEAVES*100) : 0) + "%";
  try {
    window.parent.postMessage({ type: 'FM_MINDMAP_PROGRESS', explored: n, total: TOTAL_LEAVES }, '*');
  } catch(e){}
}
updateProgress();

function leafDescendants(node){
  if(!node.children || !node.children.length) return [node];
  return node.children.flatMap(leafDescendants);
}
function checkBranchCompletion(node){
  let cur = node.parent;
  while(cur){
    if(!cur.completed){
      const leaves = leafDescendants(cur);
      if(leaves.length && leaves.every(l => visited.has(l.id))){
        cur.completed = true;
        celebrateAt(cur.id);
        if(cur.depth === 1) updateBadge(cur.id);
        playChime();
      }
    }
    cur = cur.parent;
  }
  maybeFinale();
}

const NODE_H = 48;
const COL_GAP = 90;
const SIB_GAP = 16;

const nodesEl = document.getElementById("nodes");
const edgesEl = document.getElementById("edges");
const canvasEl = document.getElementById("canvas");

function measureWidth(node){
  const span = document.createElement("span");
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.fontSize = node.depth===0 ? "16px" : "14.5px";
  span.style.fontFamily = getComputedStyle(document.body).fontFamily;
  span.textContent = node.text;
  document.body.appendChild(span);
  const textW = span.getBoundingClientRect().width;
  document.body.removeChild(span);
  const padding = node.depth===0 ? 36 : 32;
  const toggleSpace = (node.children && node.children.length) ? 34 : 0;
  const iconSpace = 27;
  return Math.ceil(textW + padding + toggleSpace + iconSpace);
}

function layout(){
  const oldPos = {};
  (function collectOld(node){
    if(node.x !== undefined) oldPos[node.id] = {x:node.x, y:node.y};
    if(node.children) node.children.forEach(collectOld);
  })(DATA);

  nodesEl.innerHTML = "";
  edgesEl.innerHTML = "";

  let yCursor = 0;
  const positioned = [];
  const columnWidth = {};

  function place(node, depth){
    node.width = measureWidth(node);
    columnWidth[depth] = Math.max(columnWidth[depth] || 0, node.width);
    const visibleChildren = (node.children && !node.collapsed) ? node.children : null;
    if(!visibleChildren || visibleChildren.length===0){
      node.y = yCursor;
      yCursor += NODE_H + SIB_GAP;
    } else {
      visibleChildren.forEach(c => place(c, depth+1));
      const firstChild = visibleChildren[0];
      const lastChild = visibleChildren[visibleChildren.length-1];
      node.y = (firstChild.y + lastChild.y) / 2;
    }
    positioned.push(node);
  }
  place(DATA, 0);

  const columnX = {};
  let cursorX = 0;
  const maxDepth = Math.max(...Object.keys(columnWidth).map(Number), 0);
  for(let d=0; d<=maxDepth; d++){
    columnX[d] = cursorX;
    cursorX += (columnWidth[d] || 0) + COL_GAP;
  }
  positioned.forEach(node => { node.x = columnX[node.depth]; });

  const maxY = yCursor;
  const maxX = Math.max(...positioned.map(n => n.x + n.width), 300);

  edgesEl.setAttribute("width", maxX + 100);
  edgesEl.setAttribute("height", maxY + 100);
  edgesEl.style.width = (maxX+100) + "px";
  edgesEl.style.height = (maxY+100) + "px";
  nodesEl.style.width = (maxX+100) + "px";
  nodesEl.style.height = (maxY+100) + "px";
  canvasEl.style.width = (maxX+100) + "px";
  canvasEl.style.height = (maxY+100) + "px";

  const OFFSET_X = 40, OFFSET_Y = 40;
  let newIndex = 0;

  positioned.forEach(node=>{
    if(node.children && !node.collapsed){
      node.children.forEach(child=>{
        const x1 = node.x + node.width + OFFSET_X;
        const y1 = node.y + NODE_H/2 + OFFSET_Y;
        const x2 = child.x + OFFSET_X;
        const y2 = child.y + NODE_H/2 + OFFSET_Y;
        const dx = Math.max(40, (x2 - x1) * 0.55);
        const path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute("d", "M " + x1 + " " + y1 + " C " + (x1+dx) + " " + y1 + ", " + (x2-dx) + " " + y2 + ", " + x2 + " " + y2);
        path.setAttribute("fill","none");
        path.setAttribute("stroke", depthColor(child.depth));
        path.setAttribute("stroke-width","1.75");
        path.setAttribute("stroke-linecap","round");
        path.classList.add("edge");
        const isNewEdge = !(child.id in oldPos);
        if(isNewEdge){
          path.classList.add("enter");
          path.style.transitionDelay = (newIndex * 70) + "ms";
          newIndex++;
        }
        edgesEl.appendChild(path);
      });
    }
  });

  newIndex = 0;
  positioned.forEach(node=>{
    const el = document.createElement("div");
    el.className = "node" + (node.depth===0 ? " root" : "") + (node.depth>=2 ? " depth-"+node.depth : "");
    el.dataset.id = node.id;
    if(node.children && node.children.length) el.classList.add("has-children");
    if(node.completed) el.classList.add("complete");
    if((!node.children || !node.children.length) && visited.has(node.id)) el.classList.add("visited-leaf");
    el.style.width = node.width + "px";
    el.style.height = NODE_H + "px";

    const isNewNode = !(node.id in oldPos);
    const finalLeft = (node.x + OFFSET_X) + "px";
    const finalTop = (node.y + OFFSET_Y) + "px";

    if(isNewNode){
      el.style.left = finalLeft;
      el.style.top = finalTop;
      el.classList.add("enter");
      el.style.transitionDelay = (newIndex * 70) + "ms";
      newIndex++;
    } else {
      el.style.left = oldPos[node.id].x + OFFSET_X + "px";
      el.style.top = oldPos[node.id].y + OFFSET_Y + "px";
    }

    const iconWrap = document.createElement("span");
    iconWrap.className = "icon";
    iconWrap.innerHTML = node.depth===0 ? ICON.root : ((node.children && node.children.length) ? ICON.branch : (visited.has(node.id) ? ICON.check : ICON.leaf));
    el.appendChild(iconWrap);

    const label = document.createElement("span");
    label.textContent = node.text;
    label.style.flex = "1";
    el.appendChild(label);

    if(node.children && node.children.length){
      const toggle = document.createElement("div");
      toggle.className = "toggle";
      toggle.textContent = node.collapsed ? ">" : "<";
      el.appendChild(toggle);
      el.addEventListener("click", ()=>{
        node.collapsed = !node.collapsed;
        pop(el);
        layout();
      });
    } else {
      el.addEventListener("click", ()=>{
        pop(el);
        openFact(node, el);
      });
    }
    nodesEl.appendChild(el);

    if(!isNewNode){
      requestAnimationFrame(()=>{
        el.style.left = finalLeft;
        el.style.top = finalTop;
      });
    }
  });

  requestAnimationFrame(()=>{
    nodesEl.querySelectorAll(".node.enter").forEach(el => el.classList.remove("enter"));
    edgesEl.querySelectorAll(".edge.enter").forEach(el => el.classList.remove("enter"));
  });
}

function pop(el){
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

function depthColor(depth){
  if(depth<=1) return "#7C3AED";
  return "#B18CF5";
}

/* ---------- fact popup ---------- */
const overlay = document.getElementById("overlay");
const popupTitle = document.getElementById("popup-title");
const popupFact = document.getElementById("popup-fact");
const popupIcon = document.getElementById("popup-icon");
let currentFactText = "";

function openFact(node, el){
  popupTitle.textContent = node.text;
  popupFact.textContent = node.fact || "This topic doesn't have a fact yet — but it's still part of the map!";
  popupIcon.innerHTML = ICON.leaf;
  currentFactText = node.text + ". " + (node.fact || "");
  overlay.classList.add("show");
  playClick();

  if(!visited.has(node.id)){
    visited.add(node.id);
    updateProgress();
    el.classList.add("visited-leaf");
    const iconWrap = el.querySelector(".icon");
    if(iconWrap) iconWrap.innerHTML = ICON.check;
    checkBranchCompletion(node);
  }
}
document.getElementById("popup-close").addEventListener("click", ()=> overlay.classList.remove("show"));
overlay.addEventListener("click", (e)=>{ if(e.target === overlay) overlay.classList.remove("show"); });
document.getElementById("popup-read").addEventListener("click", ()=>{
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(currentFactText);
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
});

/* ---------- confetti ---------- */
const confettiLayer = document.getElementById("confetti-layer");
const CONFETTI_COLORS = ["#8B5CF6","#F5A623","#22A559","#EC4899","#3B82F6"];
function burstConfettiAt(cx, cy, count){
  for(let i=0;i<(count||28);i++){
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const angle = Math.random()*Math.PI*2;
    const dist = 60 + Math.random()*90;
    piece.style.setProperty("--dx", (Math.cos(angle)*dist)+"px");
    piece.style.setProperty("--dy", (Math.sin(angle)*dist + 40)+"px");
    piece.style.setProperty("--rot", (Math.random()*360)+"deg");
    piece.style.left = cx+"px";
    piece.style.top = cy+"px";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.animationDelay = (Math.random()*0.15)+"s";
    confettiLayer.appendChild(piece);
    setTimeout(()=>piece.remove(), 1400);
  }
}
function celebrateAt(nodeId){
  const el = nodesEl.querySelector('[data-id="'+nodeId+'"]');
  const rect = el ? el.getBoundingClientRect() : {left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0};
  burstConfettiAt(rect.left + rect.width/2, rect.top + rect.height/2);
  layout();
}

/* ---------- search ---------- */
function findMatch(node, q){
  if(node.text && node.text.toLowerCase().includes(q)) return node;
  if(node.children){
    for(const c of node.children){
      const m = findMatch(c, q);
      if(m) return m;
    }
  }
  return null;
}
document.getElementById("search").addEventListener("input", (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) return;
  const match = findMatch(DATA, q);
  if(!match) return;
  let cur = match.parent;
  while(cur){ cur.collapsed = false; cur = cur.parent; }
  layout();
  requestAnimationFrame(()=>{
    const el = nodesEl.querySelector('[data-id="'+match.id+'"]');
    if(el){
      const targetX = parseFloat(el.style.left) + el.offsetWidth/2;
      const targetY = parseFloat(el.style.top) + el.offsetHeight/2;
      panX = window.innerWidth/2 - targetX*scale;
      panY = window.innerHeight/2 - targetY*scale;
      applyTransform();
      el.classList.add("highlight");
      setTimeout(()=>el.classList.remove("highlight"), 1200);
    }
  });
});

document.getElementById("expandAll").addEventListener("click", ()=>{
  (function walk(node){ if(node.children){ node.collapsed=false; node.children.forEach(walk); } })(DATA);
  layout();
});
document.getElementById("collapseAll").addEventListener("click", ()=>{
  (function walk(node, depth){ if(node.children){ node.collapsed = depth>=0; node.children.forEach(c=>walk(c,depth+1)); } })(DATA, 0);
  layout();
});

if(document.fonts && document.fonts.ready){
  document.fonts.load("600 14.5px 'Baloo 2'").then(()=>document.fonts.load("700 16px 'Baloo 2'")).finally(layout);
} else {
  layout();
}

/* ---------- idle wiggle on unexplored topic ---------- */
setInterval(()=>{
  if(overlay.classList.contains("show") || finaleEl.classList.contains("show")) return;
  const candidates = Array.from(nodesEl.querySelectorAll(".node:not(.has-children):not(.visited-leaf)"));
  if(!candidates.length) return;
  const pick = candidates[Math.floor(Math.random()*candidates.length)];
  pick.classList.remove("invite");
  void pick.offsetWidth;
  pick.classList.add("invite");
  setTimeout(()=>pick.classList.remove("invite"), 1300);
}, 4500);

/* ---------- pan & zoom ---------- */
let scale = 1, panX = 60, panY = 60;
let isDragging = false, startX, startY;

function applyTransform(){
  canvasEl.style.transform = "translate(" + panX + "px, " + panY + "px) scale(" + scale + ")";
}
applyTransform();

const app = document.getElementById("app");
app.addEventListener("mousedown", e=>{
  if(e.target.closest(".node") || e.target.closest("#controls") || e.target.closest("#topbar")) return;
  isDragging = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  canvasEl.classList.add("dragging");
});
window.addEventListener("mousemove", e=>{
  if(!isDragging) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  applyTransform();
});
window.addEventListener("mouseup", ()=>{
  isDragging = false;
  canvasEl.classList.remove("dragging");
});
app.addEventListener("wheel", e=>{
  if(e.target.closest("#topbar")) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.08 : 0.08;
  scale = Math.min(2, Math.max(0.3, scale + delta));
  applyTransform();
}, {passive:false});

document.getElementById("zoomIn").onclick = ()=>{ scale = Math.min(2, scale+0.15); applyTransform(); };
document.getElementById("zoomOut").onclick = ()=>{ scale = Math.max(0.3, scale-0.15); applyTransform(); };
document.getElementById("zoomReset").onclick = ()=>{ scale=1; panX=60; panY=60; applyTransform(); };
</script>
</body>
</html>`;
}
