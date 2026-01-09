/* ============================================
   SMOOTH BUILDER 5.0 - PREVIEW: TEAM
   Variants: grid | cards | minimal
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.preview = SB5.preview || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before preview/Team.jsx');

  const { useMemo, useCallback } = React;

  function safeObj(x){return x && typeof x==='object'?x:{};}

  function normalize(items){
    if (!Array.isArray(items) || !items.length) {
      return [
        { name: 'Alex Muster', role: 'Founder', bio: 'Produkt & Strategie', avatar: null },
        { name: 'Sam Beispiel', role: 'Design', bio: 'UI/UX & Branding', avatar: null },
        { name: 'Pat Demo', role: 'Engineering', bio: 'Frontend & Export', avatar: null }
      ];
    }
    return items.slice(0, 12).map(it => ({
      name: String(it.name || 'Name'),
      role: String(it.role || ''),
      bio: String(it.bio || ''),
      avatar: it.avatar || null
    }));
  }

  function initials(name){
    return String(name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(x => x[0].toUpperCase())
      .join('');
  }

  function Team({ id, variant, spacing, content, isActive, onSelect, onActivate, readOnly }) {
    const c = safeObj(content);
    const v = variant || 'grid';
    const headline = c.headline || 'Team';
    const members = useMemo(() => normalize(c.members), [c.members]);

    const cls = ['sb-section','sb-team','sb-team--'+v, isActive?'is-active':''].filter(Boolean).join(' ');

    const activate = useCallback((key) => {
      if (readOnly) return;
      if (typeof onActivate === 'function') onActivate({ sectionId: id, key });
    }, [onActivate, id, readOnly]);

    return (
      <section
        id="team"
        className={cls}
        style={{ paddingTop: spacing.pt, paddingBottom: spacing.pb }}
        onClick={() => typeof onSelect === 'function' && onSelect(id)}
        aria-label="Team"
      >
        <div className="sb-container">
          <div className="sb-sectionHead">
            <h2 className="sb-h2" onClick={(e)=>{e.stopPropagation(); activate('headline');}}>{headline}</h2>
          </div>

          {v === 'minimal' ? (
            <div className="sb-team__minimal" role="list">
              {members.map((m, idx) => (
                <div key={idx} className="sb-team__minimalItem" role="listitem">
                  <div className="sb-team__name">{m.name}</div>
                  <div className="sb-team__role sb-muted">{m.role}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={v === 'cards' ? 'sb-team__cards' : 'sb-team__grid'} role="list">
              {members.map((m, idx) => (
                <div key={idx} className="sb-card sb-team__card" role="listitem">
                  <div className="sb-team__avatar" aria-hidden="true">
                    {m.avatar ? <img src={m.avatar} alt="" /> : <span>{initials(m.name)}</span>}
                  </div>
                  <div className="sb-card__title">{m.name}</div>
                  <div className="sb-card__meta sb-muted">{m.role}</div>
                  {m.bio ? <div className="sb-card__text">{m.bio}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  SB5.preview.Team = Team;
})(window);



