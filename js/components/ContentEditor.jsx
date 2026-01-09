/* ============================================
   SMOOTH BUILDER 5.0 - CONTENT EDITOR
   ============================================
   No build step. Exposes: window.SB5.components.ContentEditor
   Dynamic form per section type with robust defaults.
   ============================================ */

(function (global) {
  'use strict';

  const SB5 = global.SB5 = global.SB5 || {};
  SB5.components = SB5.components || {};
  SB5.data = SB5.data || {};

  const React = global.React;
  if (!React) throw new Error('React missing. Load React before ContentEditor.jsx');

  const { useMemo, useCallback, useRef } = React;

  const Icon = SB5.components.Icon;

  function hasIcon(name) {
    const icons = SB5.data && SB5.data.icons;
    return !!(icons && icons[name]);
  }

  function uid(prefix) {
    return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
  }

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  function getSchema(sectionType) {
    const sections = SB5.data.sections;
    if (sections && sections[sectionType] && Array.isArray(sections[sectionType].fields)) {
      return sections[sectionType].fields;
    }

    // Robust defaults (works even if sections.json has no explicit fields)
    switch (sectionType) {
      case 'header':
        return [
          { key: 'companyName', label: 'Firma / Brand', type: 'text', required: true },
          { key: 'tagline', label: 'Tagline', type: 'text' },
          { key: 'nav', label: 'Navigation', type: 'list', itemLabel: 'Link', fields: [
            { key: 'label', label: 'Label', type: 'text' },
            { key: 'href', label: 'URL / Anchor', type: 'text' }
          ], defaultItem: () => ({ label: 'Link', href: '#section' }) },
          { key: 'ctaText', label: 'CTA Text', type: 'text' },
          { key: 'ctaHref', label: 'CTA Link', type: 'text' }
        ];
      case 'hero':
        return [
          { key: 'headline', label: 'Headline', type: 'text', required: true },
          { key: 'subline', label: 'Subline', type: 'textarea' },
          { key: 'ctaText', label: 'CTA Text', type: 'text' },
          { key: 'ctaHref', label: 'CTA Link', type: 'text' },
          { key: 'image', label: 'Hero Bild', type: 'image' }
        ];
      case 'trustbar':
        return [
          { key: 'title', label: 'Titel', type: 'text' },
          { key: 'items', label: 'Items', type: 'list', itemLabel: 'Item', fields: [
            { key: 'label', label: 'Label', type: 'text' },
            { key: 'value', label: 'Value', type: 'text' },
            { key: 'logo', label: 'Logo (optional)', type: 'image' }
          ], defaultItem: () => ({ label: 'Partner', value: '' }) }
        ];
      case 'services':
        return [
          { key: 'headline', label: 'Titel', type: 'text' },
          { key: 'subline', label: 'Intro', type: 'textarea' },
          { key: 'services', label: 'Services', type: 'list', itemLabel: 'Service', fields: [
            { key: 'title', label: 'Titel', type: 'text' },
            { key: 'text', label: 'Text', type: 'textarea' },
            { key: 'icon', label: 'Icon (Text/Emoji)', type: 'text' }
          ], defaultItem: () => ({ title: 'Service', text: 'Kurzbeschreibung…', icon: '✓' }) }
        ];
      case 'benefits':
        return [
          { key: 'headline', label: 'Titel', type: 'text' },
          { key: 'benefits', label: 'Benefits', type: 'list', itemLabel: 'Benefit', fields: [
            { key: 'title', label: 'Titel', type: 'text' },
            { key: 'text', label: 'Text', type: 'textarea' },
            { key: 'icon', label: 'Icon (Text/Emoji)', type: 'text' }
          ], defaultItem: () => ({ title: 'Benefit', text: 'Kurzbeschreibung…', icon: '★' }) }
        ];
      case 'team':
        return [
          { key: 'headline', label: 'Titel', type: 'text' },
          { key: 'members', label: 'Team', type: 'list', itemLabel: 'Person', fields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'role', label: 'Rolle', type: 'text' },
            { key: 'bio', label: 'Bio', type: 'textarea' },
            { key: 'avatar', label: 'Avatar', type: 'image' }
          ], defaultItem: () => ({ name: 'Name', role: 'Rolle', bio: '' }) }
        ];
      case 'testimonials':
        return [
          { key: 'headline', label: 'Titel', type: 'text' },
          { key: 'items', label: 'Testimonials', type: 'list', itemLabel: 'Zitat', fields: [
            { key: 'quote', label: 'Zitat', type: 'textarea' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'role', label: 'Rolle', type: 'text' }
          ], defaultItem: () => ({ quote: 'Sehr zufrieden…', name: 'Kunde', role: '' }) }
        ];
      case 'faq':
        return [
          { key: 'headline', label: 'Titel', type: 'text' },
          { key: 'items', label: 'FAQ', type: 'list', itemLabel: 'Frage', fields: [
            { key: 'q', label: 'Frage', type: 'text' },
            { key: 'a', label: 'Antwort', type: 'textarea' }
          ], defaultItem: () => ({ q: 'Frage…', a: 'Antwort…' }) }
        ];
      case 'cta':
        return [
          { key: 'headline', label: 'Titel', type: 'text', required: true },
          { key: 'subline', label: 'Text', type: 'textarea' },
          { key: 'buttonText', label: 'Button Text', type: 'text' },
          { key: 'buttonHref', label: 'Button Link', type: 'text' }
        ];
      case 'footer':
        return [
          { key: 'companyName', label: 'Firmenname', type: 'text' },
          { key: 'address', label: 'Adresse', type: 'textarea' },
          { key: 'email', label: 'E-Mail', type: 'text' },
          { key: 'phone', label: 'Telefon', type: 'text' },
          { key: 'links', label: 'Links', type: 'list', itemLabel: 'Link', fields: [
            { key: 'label', label: 'Label', type: 'text' },
            { key: 'href', label: 'URL', type: 'text' }
          ], defaultItem: () => ({ label: 'Link', href: '#' }) }
        ];
      case 'custom':
        return [
          { key: 'elements', label: 'Custom Elements', type: 'customElements' }
        ];
      default:
        return [
          { key: 'headline', label: 'Titel', type: 'text' },
          { key: 'text', label: 'Text', type: 'textarea' }
        ];
    }
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'));
      r.readAsDataURL(file);
    });
  }

  function Field({ field, value, onChange }) {
    const common = {
      className: 'content-editor__input',
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      placeholder: field.placeholder || ''
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...common} rows={field.rows || 4} />;
      case 'text':
      default:
        return <input {...common} type="text" spellCheck={false} />;
    }
  }

  function ListEditor({ field, value, onChange }) {
    const items = Array.isArray(value) ? value : [];
    const fields = Array.isArray(field.fields) ? field.fields : [];
    const mkItem = typeof field.defaultItem === 'function'
      ? field.defaultItem
      : (() => ({}));

    const updateItem = (idx, patch) => {
      const next = items.slice();
      next[idx] = { ...(next[idx] || {}), ...(patch || {}) };
      onChange(next);
    };

    const removeItem = (idx) => {
      const next = items.slice();
      next.splice(idx, 1);
      onChange(next);
    };

    const addItem = () => {
      onChange([...items, mkItem()]);
    };

    const move = (idx, dir) => {
      const to = idx + dir;
      if (to < 0 || to >= items.length) return;
      const next = items.slice();
      const [x] = next.splice(idx, 1);
      next.splice(to, 0, x);
      onChange(next);
    };

    return (
      <div className="list-editor">
        <div className="list-editor__items">
          {items.map((it, idx) => (
            <div key={it.id || idx} className="list-editor__item">
              <div className="list-editor__itemHeader">
                <div className="list-editor__itemTitle">
                  {field.itemLabel || 'Item'} {idx + 1}
                </div>
                <div className="list-editor__itemActions">
                  <button type="button" className="btn btn--xs" onClick={() => move(idx, -1)} aria-label="Nach oben">
                    {(Icon && hasIcon('chevronDown')) ? (
                      <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
                        <Icon name="chevronDown" size={14} />
                      </span>
                    ) : '↑'}
                  </button>
                  <button type="button" className="btn btn--xs" onClick={() => move(idx, 1)} aria-label="Nach unten">
                    {(Icon && hasIcon('chevronDown')) ? <Icon name="chevronDown" size={14} /> : '↓'}
                  </button>
                  <button type="button" className="btn btn--xs btn--danger" onClick={() => removeItem(idx)} aria-label="Entfernen">
                    {(Icon && hasIcon('trash')) ? <Icon name="trash" size={14} /> : '×'}
                  </button>
                </div>
              </div>

              <div className="list-editor__grid">
                {fields.map(f => {
                  if (f.type === 'image') {
                    return (
                      <ImageField
                        key={f.key}
                        label={f.label}
                        value={it && it[f.key]}
                        onChange={(val) => updateItem(idx, { [f.key]: val })}
                      />
                    );
                  }

                  return (
                    <div key={f.key} className="content-editor__field">
                      <div className="content-editor__label">{f.label}</div>
                      <Field
                        field={f}
                        value={it && it[f.key]}
                        onChange={(val) => updateItem(idx, { [f.key]: val })}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn btn--sm" onClick={addItem}>
          {(Icon && hasIcon('plus')) ? <Icon name="plus" size={14} /> : null}
          Hinzufügen
        </button>
      </div>
    );
  }

  function ImageField({ label, value, onChange }) {
    const inputRef = useRef(null);
    const pick = () => inputRef.current && inputRef.current.click();

    const handleFile = async (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      const dataUrl = await readAsDataURL(file);
      onChange(dataUrl);
    };

    return (
      <div className="content-editor__field">
        <div className="content-editor__label">{label}</div>
        <div className="image-field">
          <div className="image-field__preview">
            {value ? <img src={value} alt="" className="image-field__img" /> : <div className="image-field__empty">Kein Bild</div>}
          </div>
          <div className="image-field__actions">
            <button type="button" className="btn btn--xs" onClick={pick}>Upload</button>
            <button type="button" className="btn btn--xs btn--ghost" onClick={() => onChange(null)} disabled={!value}>Entfernen</button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>
    );
  }

  function CustomElementsEditor({ value, onChange }) {
    const els = Array.isArray(value) ? value : [];

    const available = [
      { type: 'headline', label: 'Headline' },
      { type: 'text', label: 'Text' },
      { type: 'button', label: 'Button' },
      { type: 'image', label: 'Bild' },
      { type: 'spacer', label: 'Spacer' },
      { type: 'divider', label: 'Divider' },
      { type: 'columns', label: '2 Spalten' }
    ];

    const add = (type) => {
      const next = els.slice();
      next.push({
        id: uid(type),
        type,
        content: defaultCustomContent(type)
      });
      onChange(next);
    };

    const update = (idx, patch) => {
      const next = els.slice();
      next[idx] = { ...(next[idx] || {}), ...(patch || {}) };
      onChange(next);
    };

    const remove = (idx) => {
      const next = els.slice();
      next.splice(idx, 1);
      onChange(next);
    };

    const move = (idx, dir) => {
      const to = idx + dir;
      if (to < 0 || to >= els.length) return;
      const next = els.slice();
      const [x] = next.splice(idx, 1);
      next.splice(to, 0, x);
      onChange(next);
    };

    return (
      <div className="custom-elements">
        <div className="custom-elements__palette" aria-label="Elemente">
          {available.map(a => (
            <button key={a.type} type="button" className="btn btn--xs" onClick={() => add(a.type)}>
              {a.label}
            </button>
          ))}
        </div>

        <div className="custom-elements__list">
          {els.map((el, idx) => (
            <div key={el.id || idx} className="custom-elements__item">
              <div className="custom-elements__itemHeader">
                <div className="custom-elements__itemTitle">{el.type}</div>
                <div className="custom-elements__itemActions">
                  <button type="button" className="btn btn--xs" onClick={() => move(idx, -1)} aria-label="Nach oben">↑</button>
                  <button type="button" className="btn btn--xs" onClick={() => move(idx, 1)} aria-label="Nach unten">↓</button>
                  <button type="button" className="btn btn--xs btn--danger" onClick={() => remove(idx)} aria-label="Entfernen">×</button>
                </div>
              </div>

              {renderCustomElementEditor(el, (patch) => update(idx, patch))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function defaultCustomContent(type) {
    switch (type) {
      case 'headline': return { text: 'Headline' };
      case 'text': return { text: 'Text…' };
      case 'button': return { label: 'Button', href: '#' };
      case 'image': return { src: null, alt: '' };
      case 'spacer': return { height: 24 };
      case 'divider': return { };
      case 'columns': return { left: { text: 'Links…' }, right: { text: 'Rechts…' } };
      default: return {};
    }
  }

  function renderCustomElementEditor(el, onPatch) {
    const type = el.type;

    if (type === 'headline' || type === 'text') {
      return (
        <div className="content-editor__field">
          <div className="content-editor__label">Text</div>
          <textarea
            className="content-editor__input"
            rows={type === 'headline' ? 2 : 4}
            value={(el.content && el.content.text) || ''}
            onChange={(e) => onPatch({ content: { ...(el.content || {}), text: e.target.value } })}
          />
        </div>
      );
    }

    if (type === 'button') {
      return (
        <div className="content-editor__grid">
          <div className="content-editor__field">
            <div className="content-editor__label">Label</div>
            <input
              className="content-editor__input"
              type="text"
              value={(el.content && el.content.label) || ''}
              onChange={(e) => onPatch({ content: { ...(el.content || {}), label: e.target.value } })}
            />
          </div>
          <div className="content-editor__field">
            <div className="content-editor__label">Link</div>
            <input
              className="content-editor__input"
              type="text"
              value={(el.content && el.content.href) || ''}
              onChange={(e) => onPatch({ content: { ...(el.content || {}), href: e.target.value } })}
            />
          </div>
        </div>
      );
    }

    if (type === 'image') {
      return (
        <ImageField
          label="Bild"
          value={(el.content && el.content.src) || null}
          onChange={(src) => onPatch({ content: { ...(el.content || {}), src } })}
        />
      );
    }

    if (type === 'spacer') {
      const height = (el.content && Number(el.content.height)) || 24;
      return (
        <div className="content-editor__field">
          <div className="content-editor__label">Höhe (px)</div>
          <input
            className="content-editor__input"
            type="number"
            min={0}
            step={4}
            value={height}
            onChange={(e) => onPatch({ content: { ...(el.content || {}), height: Number(e.target.value) } })}
          />
        </div>
      );
    }

    if (type === 'columns') {
      return (
        <div className="content-editor__grid">
          <div className="content-editor__field">
            <div className="content-editor__label">Links</div>
            <textarea
              className="content-editor__input"
              rows={3}
              value={(el.content && el.content.left && el.content.left.text) || ''}
              onChange={(e) => onPatch({ content: { ...(el.content || {}), left: { ...(el.content.left || {}), text: e.target.value } } })}
            />
          </div>
          <div className="content-editor__field">
            <div className="content-editor__label">Rechts</div>
            <textarea
              className="content-editor__input"
              rows={3}
              value={(el.content && el.content.right && el.content.right.text) || ''}
              onChange={(e) => onPatch({ content: { ...(el.content || {}), right: { ...(el.content.right || {}), text: e.target.value } } })}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  function ContentEditor({
    sectionType,
    content,
    onChange
  }) {
    const schema = useMemo(() => getSchema(sectionType), [sectionType]);
    const model = isObj(content) ? content : {};

    const set = useCallback((key, val) => {
      if (typeof onChange !== 'function') return;
      onChange({ ...model, [key]: val });
    }, [onChange, model]);

    return (
      <div className="content-editor" aria-label="Content Editor">
        {schema.map(field => {
          if (field.type === 'list') {
            return (
              <div key={field.key} className="content-editor__block">
                <div className="content-editor__label">{field.label}</div>
                <ListEditor
                  field={field}
                  value={model[field.key]}
                  onChange={(val) => set(field.key, val)}
                />
              </div>
            );
          }

          if (field.type === 'image') {
            return (
              <div key={field.key} className="content-editor__block">
                <ImageField
                  label={field.label}
                  value={model[field.key]}
                  onChange={(val) => set(field.key, val)}
                />
              </div>
            );
          }

          if (field.type === 'customElements') {
            return (
              <div key={field.key} className="content-editor__block">
                <div className="content-editor__label">{field.label}</div>
                <CustomElementsEditor
                  value={model[field.key]}
                  onChange={(val) => set(field.key, val)}
                />
              </div>
            );
          }

          return (
            <div key={field.key} className="content-editor__field">
              <div className="content-editor__label">{field.label}{field.required ? ' *' : ''}</div>
              <Field
                field={field}
                value={model[field.key]}
                onChange={(val) => set(field.key, val)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  SB5.components.ContentEditor = ContentEditor;
})(window);


