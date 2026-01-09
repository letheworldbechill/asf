/* ============================================
   SMOOTH BUILDER 5.0 - CANVAS
   ============================================
   No build step. Exposes: window.SB5.components.Canvas
   Renders structure placeholders OR live preview based on mode.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.core = SB5.core || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before Canvas.jsx');

  const { useMemo, useCallback } = React;

  const GridOverlay = SB5.components.GridOverlay;
  const SectionPlaceholder = SB5.components.SectionPlaceholder;

  function Canvas({
    state,
    dispatch,
    viewport = 'desktop',
    className = '',
    style = {}
  }) {
    const mode = state && state.mode ? state.mode : 'structure';
    const ui = (state && state.ui) ? state.ui : {};
    const layout = (state && state.layout) ? state.layout : { sections: [], order: [], spacing: {} };
    const ActionTypes = (SB5.core.state && SB5.core.state.ActionTypes) || {};

    const byId = useMemo(() => {
      const map = new Map();
      for (const s of (layout.sections || [])) map.set(s.id, s);
      return map;
    }, [layout.sections]);

    const orderedSections = useMemo(() => {
      const out = [];
      const order = Array.isArray(layout.order) ? layout.order : [];
      for (const id of order) {
        const s = byId.get(id);
        if (s) out.push(s);
      }
      return out;
    }, [layout.order, byId]);

    const selectSection = useCallback((id) => {
      if (!dispatch || !ActionTypes.SELECT_SECTION) return;
      dispatch({ type: ActionTypes.SELECT_SECTION, payload: id });
    }, [dispatch, ActionTypes.SELECT_SECTION]);

    const removeSection = useCallback((id) => {
      if (!dispatch || !ActionTypes.REMOVE_SECTION) return;
      dispatch({ type: ActionTypes.REMOVE_SECTION, payload: id });
    }, [dispatch, ActionTypes.REMOVE_SECTION]);

    const setActiveElementPath = useCallback((path) => {
      if (!dispatch || !ActionTypes.SET_ACTIVE_ELEMENT_PATH) return;
      dispatch({ type: ActionTypes.SET_ACTIVE_ELEMENT_PATH, payload: path });
    }, [dispatch, ActionTypes.SET_ACTIVE_ELEMENT_PATH]);

    const canvasClass = `canvas canvas--${mode} ${className}`.trim();

    // Structure canvas (placeholders + grid overlay)
    if (mode === 'structure') {
      return (
        <div className={canvasClass} style={style}>
          <div className="canvas__surface">
            {ui.showGrid && GridOverlay && (
              <GridOverlay columns={12} show8px={!!ui.show8pxRaster} />
            )}

            <div className="canvas__stack" role="list" aria-label="Sections">
              {orderedSections.map(section => (
                <SectionPlaceholder
                  key={section.id}
                  section={section}
                  spacing={(layout.spacing && layout.spacing[section.id]) || { pt: 64, pb: 64 }}
                  isActive={ui.activeSection === section.id}
                  onSelect={selectSection}
                  onRemove={removeSection}
                />
              ))}

              {orderedSections.length === 0 && (
                <div className="canvas__empty" role="status" aria-live="polite">
                  <div className="canvas__emptyTitle">Noch keine Sections</div>
                  <div className="canvas__emptyText">
                    Füge links eine Section hinzu, um dein Layout aufzubauen.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Design / Export canvas (live preview)
    const PreviewRoot = SB5.preview.PreviewRoot;

    return (
      <div className={canvasClass} style={style}>
        <div className={`canvas__surface canvas__surface--${viewport}`}>
          {PreviewRoot ? (
            <PreviewRoot
              state={state}
              dispatch={dispatch}
              viewport={viewport}
              onSelectSection={selectSection}
              onActivateElementPath={setActiveElementPath}
              readOnly={mode === 'export'}
            />
          ) : (
            <div className="canvas__empty" role="status" aria-live="polite">
              <div className="canvas__emptyTitle">Preview nicht verfügbar</div>
              <div className="canvas__emptyText">
                Die Preview-Components werden im nächsten Checkpoint eingebunden.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  SB5.components.Canvas = Canvas;
})(window);


