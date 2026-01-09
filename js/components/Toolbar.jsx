/* ============================================
   SMOOTH BUILDER 5.0 - TOOLBAR
   ============================================
   No build step. Exposes: window.SB5.components.Toolbar
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.core = SB5.core || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before Toolbar.jsx');

  const { useMemo, useCallback } = React;

  const Icon = SB5.components.Icon;

  function Toolbar({
    state,
    dispatch,
    canDesign = false,
    canExport = false,
    viewport = 'desktop', // 'desktop' | 'tablet' | 'mobile'
    onViewportChange,
    onExportPreview,
    onExportZip
  }) {
    const mode = state && state.mode ? state.mode : 'structure';
    const ui = (state && state.ui) ? state.ui : {};
    const ActionTypes = (SB5.core.state && SB5.core.state.ActionTypes) || {};

    const setMode = useCallback((m) => {
      if (typeof dispatch === 'function' && ActionTypes.SET_MODE) {
        dispatch({ type: ActionTypes.SET_MODE, payload: m });
      }
    }, [dispatch, ActionTypes.SET_MODE]);

    const toggleGrid = useCallback(() => {
      if (typeof dispatch === 'function' && ActionTypes.TOGGLE_GRID) dispatch({ type: ActionTypes.TOGGLE_GRID });
    }, [dispatch, ActionTypes.TOGGLE_GRID]);

    const toggle8px = useCallback(() => {
      if (typeof dispatch === 'function' && ActionTypes.TOGGLE_8PX) dispatch({ type: ActionTypes.TOGGLE_8PX });
    }, [dispatch, ActionTypes.TOGGLE_8PX]);

    const undo = useCallback(() => {
      if (typeof dispatch === 'function' && ActionTypes.UNDO) dispatch({ type: ActionTypes.UNDO });
    }, [dispatch, ActionTypes.UNDO]);

    const redo = useCallback(() => {
      if (typeof dispatch === 'function' && ActionTypes.REDO) dispatch({ type: ActionTypes.REDO });
    }, [dispatch, ActionTypes.REDO]);

    const theme = ui.builderTheme || 'light';
    const toggleTheme = useCallback(() => {
      if (!dispatch || !ActionTypes.SET_BUILDER_THEME) return;
      dispatch({ type: ActionTypes.SET_BUILDER_THEME, payload: theme === 'light' ? 'dark' : 'light' });
    }, [dispatch, ActionTypes.SET_BUILDER_THEME, theme]);

    const viewportButtons = useMemo(() => ([
      { id: 'desktop', label: 'Desktop', icon: 'monitor' },
      { id: 'tablet', label: 'Tablet', icon: 'tablet' },
      { id: 'mobile', label: 'Mobile', icon: 'smartphone' }
    ]), []);

    const modeTabs = useMemo(() => ([
      { id: 'structure', label: 'Struktur', icon: 'layout', step: 1, enabled: true },
      { id: 'design', label: 'Design', icon: 'zap', step: 2, enabled: !!canDesign },
      { id: 'export', label: 'Export', icon: 'download', step: 3, enabled: !!canExport }
    ]), [canDesign, canExport]);

    return (
      <header className="toolbar" role="banner">
        <div className="toolbar__left">
          <div className="toolbar__brand" aria-label="Smooth Builder">
            <span className="toolbar__brandMark">SB</span>
            <span className="toolbar__brandText">Smooth Builder</span>
          </div>

          <nav className="toolbar__tabs" aria-label="Modi">
            {modeTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`toolbar__tab ${mode === tab.id ? 'is-active' : ''}`}
                onClick={() => setMode(tab.id)}
                disabled={!tab.enabled}
                aria-current={mode === tab.id ? 'page' : undefined}
              >
                <span className="toolbar__tabStep" aria-hidden="true">{tab.step}</span>
                {Icon && <Icon name={tab.icon} size={16} className="toolbar__tabIcon" />}
                <span className="toolbar__tabLabel">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="toolbar__right" role="toolbar" aria-label="Aktionen">
          <div className="toolbar__group">
            <button type="button" className="toolbar__btn" onClick={undo} aria-label="Undo">
              {Icon ? <Icon name="undo" size={16} /> : 'Undo'}
            </button>
            <button type="button" className="toolbar__btn" onClick={redo} aria-label="Redo">
              {Icon ? <Icon name="redo" size={16} /> : 'Redo'}
            </button>
          </div>

          {mode === 'structure' && (
            <div className="toolbar__group" aria-label="Canvas Tools">
              <button
                type="button"
                className={`toolbar__btn ${ui.showGrid ? 'is-active' : ''}`}
                onClick={toggleGrid}
                aria-pressed={!!ui.showGrid}
              >
                {Icon && <Icon name={ui.showGrid ? 'eye' : 'eyeOff'} size={16} />}
                <span className="toolbar__btnLabel">Grid</span>
              </button>
              <button
                type="button"
                className={`toolbar__btn ${ui.show8pxRaster ? 'is-active' : ''}`}
                onClick={toggle8px}
                aria-pressed={!!ui.show8pxRaster}
              >
                <span className="toolbar__btnLabel">8px</span>
              </button>
            </div>
          )}

          {mode === 'design' && (
            <div className="toolbar__group" aria-label="Viewport">
              {viewportButtons.map(v => (
                <button
                  key={v.id}
                  type="button"
                  className={`toolbar__btn ${viewport === v.id ? 'is-active' : ''}`}
                  onClick={() => typeof onViewportChange === 'function' && onViewportChange(v.id)}
                  aria-pressed={viewport === v.id}
                >
                  {Icon && <Icon name={v.icon} size={16} />}
                  <span className="toolbar__btnLabel">{v.label}</span>
                </button>
              ))}
            </div>
          )}

          {mode === 'export' && (
            <div className="toolbar__group" aria-label="Export">
              <button
                type="button"
                className="toolbar__btn"
                onClick={() => typeof onExportPreview === 'function' && onExportPreview()}
              >
                {Icon && <Icon name="file" size={16} />}
                <span className="toolbar__btnLabel">Preview</span>
              </button>
              <button
                type="button"
                className="toolbar__btn toolbar__btn--primary"
                onClick={() => typeof onExportZip === 'function' && onExportZip()}
              >
                {Icon && <Icon name="download" size={16} />}
                <span className="toolbar__btnLabel">Export ZIP</span>
              </button>
            </div>
          )}

          <div className="toolbar__group">
            <button
              type="button"
              className="toolbar__btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Builder Dark Mode' : 'Builder Light Mode'}
            >
              {Icon && <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />}
            </button>
          </div>
        </div>
      </header>
    );
  }

  SB5.components.Toolbar = Toolbar;
})(window);



