/* ============================================
   SMOOTH BUILDER 5.0 - SIDEBAR (SHELL)
   ============================================
   No build step. Exposes: window.SB5.components.Sidebar
   This component intentionally focuses on layout + mode routing.
   Mode-specific panels are injected via `views` or loaded from
   window.SB5.modes.*Sidebar when available.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.core = SB5.core || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before Sidebar.jsx');

  const { useMemo, useCallback } = React;

  const Icon = SB5.components.Icon;

  function SidebarSection({ title, icon, children, actions = null }) {
    return (
      <section className="sidebar__section">
        <header className="sidebar__sectionHeader">
          <div className="sidebar__sectionTitle">
            {Icon && icon && <Icon name={icon} size={16} className="sidebar__sectionIcon" />}
            <h3>{title}</h3>
          </div>
          {actions && <div className="sidebar__sectionActions">{actions}</div>}
        </header>
        <div className="sidebar__sectionBody">
          {children}
        </div>
      </section>
    );
  }

  function resolveView(mode, views) {
    if (views && typeof views === 'object' && views[mode]) return views[mode];

    const modes = SB5.modes || {};
    if (mode === 'structure' && modes.StructureSidebar) return modes.StructureSidebar;
    if (mode === 'design' && modes.DesignSidebar) return modes.DesignSidebar;
    if (mode === 'export' && modes.ExportSidebar) return modes.ExportSidebar;

    return null;
  }

  function Sidebar({
    state,
    dispatch,
    views,
    className = '',
    ariaLabel = 'Sidebar'
  }) {
    const mode = state && state.mode ? state.mode : 'structure';
    const ui = (state && state.ui) ? state.ui : {};
    const ActionTypes = (SB5.core.state && SB5.core.state.ActionTypes) || {};

    const View = useMemo(() => resolveView(mode, views), [mode, views]);

    const setTab = useCallback((tab) => {
      if (!dispatch || !ActionTypes.SET_SIDEBAR_TAB) return;
      dispatch({ type: ActionTypes.SET_SIDEBAR_TAB, payload: tab });
    }, [dispatch, ActionTypes.SET_SIDEBAR_TAB]);

    const tabs = useMemo(() => {
      if (mode === 'structure') return [
        { id: 'sections', label: 'Sections', icon: 'layout' },
        { id: 'properties', label: 'Properties', icon: 'settings' }
      ];
      if (mode === 'design') return [
        { id: 'brand', label: 'Brand', icon: 'zap' },
        { id: 'content', label: 'Inhalt', icon: 'file' }
      ];
      return [
        { id: 'settings', label: 'Settings', icon: 'settings' },
        { id: 'code', label: 'Code', icon: 'code' }
      ];
    }, [mode]);

    return (
      <aside className={`sidebar ${className}`.trim()} aria-label={ariaLabel}>
        <div className="sidebar__header">
          <div className="sidebar__mode">
            <span className="sidebar__modeLabel">{mode === 'structure' ? 'Struktur' : mode === 'design' ? 'Design' : 'Export'}</span>
          </div>

          <div className="sidebar__tabs" role="tablist" aria-label="Sidebar Tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                type="button"
                className={`sidebar__tab ${ui.sidebarTab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
                role="tab"
                aria-selected={ui.sidebarTab === t.id}
              >
                {Icon && <Icon name={t.icon} size={16} />}
                <span className="sidebar__tabLabel">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar__content">
          {View ? (
            <View state={state} dispatch={dispatch} SidebarSection={SidebarSection} />
          ) : (
            <SidebarSection title="Panel" icon="settings">
              <p className="sidebar__hint">
                Für diesen Modus ist aktuell kein Sidebar-Panel registriert.
              </p>
            </SidebarSection>
          )}
        </div>
      </aside>
    );
  }

  Sidebar.Section = SidebarSection;

  SB5.components.Sidebar = Sidebar;
})(window);


