import { career, localize, ui } from '../../content'

export function CareerPanel() {
  return (
    <>
      <p className="panel__intro">{localize(career.intro)}</p>

      <ol className="timeline">
        {career.entries.map((entry, i) => (
          <li key={i} className="timeline__entry">
            <span className="timeline__period">{localize(entry.period)}</span>
            <div>
              <h3 className="timeline__title">{localize(entry.title)}</h3>
              <p className="timeline__place">{entry.place}</p>
              <p className="timeline__summary">{localize(entry.summary)}</p>
            </div>
          </li>
        ))}
      </ol>

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

      {career.tools.length > 0 && (
        <section>
          <h3 className="panel__section-title">{localize(ui.panel.tools)}</h3>
          <ul className="tags">
            {career.tools.map((tool) => (
              <li key={tool} className="tag">
                {tool}
              </li>
            ))}
          </ul>
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
