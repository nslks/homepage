import { ArrowRight } from 'lucide-react'
import { career, localize, ui } from '../../content'
import { useAppStore } from '../../state/store'
import { CvHint } from '../../ui/CvLink'

export function CareerPanel() {
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  return (
    <>
      <p className="panel__intro">{localize(career.intro)}</p>

      {career.competencies.length > 0 && (
        <section>
          <h3 className="panel__section-title">{localize(ui.panel.competencies)}</h3>
          <ul className="competencies">
            {career.competencies.map((competency, i) => (
              <li key={i}>{localize(competency)}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="panel__section-title">{localize(ui.panel.private)}</h3>
        <p className="panel__text">{localize(career.private)}</p>
        <button type="button" className="text-link" onClick={() => setOpenStation('projects')}>
          {localize(ui.panel.toProjects)}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>

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

      <CvHint />
    </>
  )
}
