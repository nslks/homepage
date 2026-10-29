import { career, localize, ui } from '../../content'

export function CareerPanel() {
  return (
    <>
      <p className="panel__intro">{localize(career.intro)}</p>

      {career.education.length > 0 && (
        <section>
          <h3 className="panel__section-title">{localize(ui.panel.education)}</h3>
          <ul className="education">
            {career.education.map((entry, i) => (
              <li key={i} className="education__entry">
                <span className="education__period">{localize(entry.period)}</span>
                <span>
                  <strong>{localize(entry.title)}</strong> · {entry.place}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {career.skills.length > 0 && (
        <section>
          <h3 className="panel__section-title">{localize(ui.panel.skills)}</h3>
          {career.skills.map((group, i) => (
            <div key={i} className="tag-group">
              <span className="tag-group__label">{localize(group.group)}</span>
              <ul className="tags">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {career.languages.length > 0 && (
        <section>
          <h3 className="panel__section-title">{localize(ui.panel.languages)}</h3>
          <ul className="languages">
            {career.languages.map((language, i) => (
              <li key={i}>
                <strong>{localize(language.name)}</strong> – {localize(language.level)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
