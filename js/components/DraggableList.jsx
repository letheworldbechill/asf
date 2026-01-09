/* ============================================
   SMOOTH BUILDER 5.0 - DRAGGABLE LIST
   ============================================
   No build step. Exposes: window.SB5.components.DraggableList
   HTML5 DnD + keyboard reordering (Alt/Ctrl + Arrow Up/Down)
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.data = SB5.data || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before DraggableList.jsx');

  const { useMemo, useRef, useState, useCallback, useEffect } = React;

  const Icon = SB5.components.Icon;

  function moveItem(order, fromIndex, toIndex) {
    const next = order.slice();
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function hasIcon(name) {
    const icons = SB5.data && SB5.data.icons ? SB5.data.icons : null;
    return !!(icons && icons[name]);
  }

  function DraggableList({
    sections,
    order,
    activeId,
    onReorder,
    onSelect,
    ariaLabel = 'Reihenfolge',
    getLabel, // (section) => string
    getMeta   // (section) => string
  }) {
    const list = Array.isArray(sections) ? sections : [];
    const ids = Array.isArray(order) ? order : [];

    const byId = useMemo(() => {
      const m = new Map();
      for (const s of list) m.set(s.id, s);
      return m;
    }, [list]);

    const ordered = useMemo(() => {
      return ids.map(id => byId.get(id)).filter(Boolean);
    }, [ids, byId]);

    const [draggedId, setDraggedId] = useState(null);
    const [overId, setOverId] = useState(null);
    const rafRef = useRef(null);

    const itemRefs = useRef(new Map());
    const setItemRef = useCallback((id, el) => {
      if (!id) return;
      const map = itemRefs.current;
      if (el) map.set(id, el);
      else map.delete(id);
    }, []);

    const reorder = useCallback((nextOrder, focusId) => {
      if (typeof onReorder === 'function') onReorder(nextOrder);
      if (focusId) {
        requestAnimationFrame(() => {
          const el = itemRefs.current.get(focusId);
          if (el && typeof el.focus === 'function') el.focus();
        });
      }
    }, [onReorder]);

    const scheduleDragReorder = useCallback((targetId) => {
      if (!draggedId || draggedId === targetId) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const current = ids.slice();
        const from = current.indexOf(draggedId);
        const to = current.indexOf(targetId);
        if (from === -1 || to === -1) return;
        const next = moveItem(current, from, to);
        reorder(next, draggedId);
      });
    }, [draggedId, ids, reorder]);

    useEffect(() => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    const handleKeyDown = useCallback((e, id) => {
      const currentIndex = ids.indexOf(id);
      if (currentIndex === -1) return;

      const isMove = (e.altKey || e.ctrlKey || e.metaKey) && (e.key === 'ArrowUp' || e.key === 'ArrowDown');
      if (!isMove) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (typeof onSelect === 'function') onSelect(id);
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();
      const dir = e.key === 'ArrowUp' ? -1 : 1;
      const nextIndex = clamp(currentIndex + dir, 0, ids.length - 1);
      if (nextIndex === currentIndex) return;

      const nextOrder = moveItem(ids, currentIndex, nextIndex);
      reorder(nextOrder, id);
    }, [ids, onSelect, reorder]);

    const canUseChevron = Icon && hasIcon('chevronDown');

    return (
      <div className="draggable-list" aria-label={ariaLabel}>
        <div className="draggable-list__items" role="list">
          {ordered.map((section) => {
            const id = String(section.id);
            const label = typeof getLabel === 'function' ? getLabel(section) : (section.type || id);
            const meta = typeof getMeta === 'function' ? getMeta(section) : (section.variant || '');

            const isActive = activeId === id;
            const isDragging = draggedId === id;
            const isOver = overId === id;

            return (
              <div
                key={id}
                ref={(el) => setItemRef(id, el)}
                className={[
                  'draggable-item',
                  isActive ? 'is-active' : '',
                  isDragging ? 'is-dragging' : '',
                  isOver ? 'is-over' : ''
                ].filter(Boolean).join(' ')}
                role="listitem"
                tabIndex={0}
                draggable
                onClick={() => typeof onSelect === 'function' && onSelect(id)}
                onKeyDown={(e) => handleKeyDown(e, id)}
                onDragStart={(e) => {
                  // Only start drag from handle (prevents accidental reorders)
                  const handle = e.target && e.target.closest ? e.target.closest('.draggable-handle') : null;
                  if (!handle) {
                    e.preventDefault();
                    return;
                  }
                  setDraggedId(id);
                  setOverId(null);
                  try {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', id);
                  } catch (_) {}
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(id);
                  scheduleDragReorder(id);
                }}
                onDragLeave={() => setOverId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setOverId(null);
                }}
                onDragEnd={() => {
                  setDraggedId(null);
                  setOverId(null);
                }}
                aria-label={`Section ${label}`}
              >
                <span className="draggable-handle" aria-hidden="true" title="Drag to reorder">
                  ⋮⋮
                </span>

                <div className="draggable-meta">
                  <div className="draggable-title">{label}</div>
                  {meta && <div className="draggable-subtitle">{meta}</div>}
                </div>

                <div className="draggable-actions">
                  <button
                    type="button"
                    className="draggable-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = ids.indexOf(id);
                      if (idx <= 0) return;
                      reorder(moveItem(ids, idx, idx - 1), id);
                    }}
                    aria-label="Nach oben"
                    title="Nach oben"
                  >
                    {canUseChevron ? (
                      <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
                        <Icon name="chevronDown" size={14} />
                      </span>
                    ) : '↑'}
                  </button>

                  <button
                    type="button"
                    className="draggable-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const idx = ids.indexOf(id);
                      if (idx === -1 || idx >= ids.length - 1) return;
                      reorder(moveItem(ids, idx, idx + 1), id);
                    }}
                    aria-label="Nach unten"
                    title="Nach unten"
                  >
                    {canUseChevron ? <Icon name="chevronDown" size={14} /> : '↓'}
                  </button>
                </div>
              </div>
            );
          })}

          {ordered.length === 0 && (
            <div className="draggable-list__empty" role="status" aria-live="polite">
              Keine Sections vorhanden.
            </div>
          )}
        </div>

        <div className="draggable-list__hint">
          <span className="draggable-list__hintText">
            Tipp: Alt/⌃ + ↑↓ zum Verschieben, Enter zum Auswählen.
          </span>
        </div>
      </div>
    );
  }

  SB5.components.DraggableList = DraggableList;
})(window);
Validierung:


