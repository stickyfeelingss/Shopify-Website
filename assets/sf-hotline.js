/* Sticky Feelings — The Hotline interactive canvas */
(function () {
  'use strict';

  const STORAGE_KEY = 'sf_hotline_notes';
  const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple'];
  const COLOR_MAP = {
    yellow: '#fff176',
    pink:   '#f8bbd0',
    blue:   '#b3e5fc',
    green:  '#c8e6c9',
    purple: '#e1bee7',
  };

  // ── State ────────────────────────────────────────────────────────
  let selectedColor = 'yellow';
  let activeTab     = 'type';
  let isDrawing     = false;
  let drawTool      = 'pen';
  let lastX = 0, lastY = 0;

  // ── Elements ──────────────────────────────────────────────────────
  const board       = document.getElementById('sf-hotline-board');
  const dynNotes    = document.getElementById('sf-dynamic-notes');
  const modal       = document.getElementById('sf-hotline-modal');
  const backdrop    = document.getElementById('sf-modal-backdrop');
  const addBtn      = document.getElementById('sf-add-note-btn');
  const closeBtn    = document.getElementById('sf-modal-close');
  const submitBtn   = document.getElementById('sf-submit-note');
  const textarea    = document.getElementById('sf-note-text');
  const charsLeft   = document.getElementById('sf-chars-left');
  const canvas      = document.getElementById('sf-draw-canvas');
  const ctx         = canvas ? canvas.getContext('2d') : null;
  const clearBtn    = document.getElementById('sf-draw-clear');
  const toolPen     = document.getElementById('sf-tool-pen');
  const toolErase   = document.getElementById('sf-tool-erase');

  // ── Modal ─────────────────────────────────────────────────────────
  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    textarea.value = '';
    charsLeft.textContent = 200;
    clearCanvas();
    textarea.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  addBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // ── Colour picker ─────────────────────────────────────────────────
  document.querySelectorAll('.sf-color-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sf-color-btn').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      selectedColor = btn.dataset.color;
      if (ctx) canvas.style.background = COLOR_MAP[selectedColor];
    });
  });

  // ── Tabs ──────────────────────────────────────────────────────────
  document.querySelectorAll('.sf-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sf-tab').forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      activeTab = tab.dataset.tab;

      document.querySelectorAll('.sf-panel').forEach((p) => {
        p.classList.remove('is-active');
        p.hidden = true;
      });
      const panel = document.getElementById('sf-panel-' + activeTab);
      panel.classList.add('is-active');
      panel.hidden = false;
    });
  });

  // ── Textarea char count ───────────────────────────────────────────
  if (textarea) {
    textarea.addEventListener('input', () => {
      charsLeft.textContent = 200 - textarea.value.length;
    });
  }

  // ── Drawing canvas ────────────────────────────────────────────────
  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getPos(e);
    lastX = x; lastY = y;
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.beginPath();
    if (drawTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#333';
      ctx.lineWidth   = 2.5;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 18;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x; lastY = y;
  }

  function endDraw() {
    isDrawing = false;
    ctx.globalCompositeOperation = 'source-over';
  }

  if (canvas) {
    canvas.addEventListener('mousedown',  startDraw);
    canvas.addEventListener('mousemove',  draw);
    canvas.addEventListener('mouseup',    endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove',  draw,      { passive: false });
    canvas.addEventListener('touchend',   endDraw);
  }

  if (clearBtn)    clearBtn.addEventListener('click',    clearCanvas);
  if (toolPen)     toolPen.addEventListener('click',    () => setTool('pen'));
  if (toolErase)   toolErase.addEventListener('click',  () => setTool('erase'));

  function setTool(tool) {
    drawTool = tool;
    [toolPen, toolErase].forEach((btn) => btn && btn.classList.remove('is-active'));
    const active = tool === 'pen' ? toolPen : toolErase;
    if (active) active.classList.add('is-active');
  }

  // ── Note creation ─────────────────────────────────────────────────
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createNoteEl(data) {
    const note = document.createElement('div');
    note.className = `sf-note sf-note--${data.color} sf-note--dynamic`;
    note.style.setProperty('--rotate', data.rotate + 'deg');
    note.style.top  = data.top  + '%';
    note.style.left = data.left + '%';

    if (data.drawing) {
      note.classList.add('sf-note--has-drawing');
      const img = document.createElement('img');
      img.src = data.drawing;
      img.alt = 'Drawn note';
      note.appendChild(img);
    } else {
      const p = document.createElement('p');
      p.textContent = data.text;
      note.appendChild(p);
    }
    return note;
  }

  function addNoteToBoard(data) {
    dynNotes.appendChild(createNoteEl(data));
  }

  function saveNote(data) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (_) { /* storage unavailable */ }
  }

  function loadSavedNotes() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.forEach(addNoteToBoard);
    } catch (_) { /* storage unavailable */ }
  }

  // ── Submit ────────────────────────────────────────────────────────
  submitBtn.addEventListener('click', () => {
    let hasContent = false;
    const data = {
      color:   selectedColor,
      rotate:  randomBetween(-4, 4),
      top:     randomBetween(5, 75),
      left:    randomBetween(5, 80),
    };

    if (activeTab === 'type') {
      const text = textarea.value.trim();
      if (!text) {
        textarea.focus();
        textarea.style.borderColor = '#e53935';
        setTimeout(() => { textarea.style.borderColor = ''; }, 1200);
        return;
      }
      data.text = text;
      hasContent = true;
    } else {
      const empty = isCanvasBlank();
      if (empty) {
        canvas.style.outline = '2px solid #e53935';
        setTimeout(() => { canvas.style.outline = ''; }, 1200);
        return;
      }
      data.drawing = canvas.toDataURL('image/png');
      hasContent = true;
    }

    if (!hasContent) return;

    saveNote(data);
    addNoteToBoard(data);
    closeModal();
    scrollToNote(data);
  });

  function isCanvasBlank() {
    if (!ctx) return true;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return !data.some((v, i) => i % 4 === 3 && v > 0);
  }

  function scrollToNote(data) {
    // Scroll so the new note is roughly visible
    const boardRect = board.getBoundingClientRect();
    const noteY = boardRect.top + window.scrollY + (boardRect.height * data.top / 100);
    window.scrollTo({ top: noteY - window.innerHeight / 2, behavior: 'smooth' });
  }

  // ── Init ──────────────────────────────────────────────────────────
  loadSavedNotes();
})();
