import { localize, work } from '../../content'

export function WorkPanel() {
  return (
    <ul className="jobs">
      {work.entries.map((job, i) => (
        <li key={i} className="job">
          <div className="job__header">
            <div>
              <h3 className="job__company">{job.company}</h3>
              <p className="job__role">{localize(job.role)}</p>
            </div>
            <span className="job__period">{localize(job.period)}</span>
          </div>
          <ul className="job__highlights">
            {job.highlights.map((highlight, j) => (
              <li key={j}>{localize(highlight)}</li>
            ))}
          </ul>
          {job.tech.length > 0 && (
            <ul className="tags">
              {job.tech.map((tech) => (
                <li key={tech} className="tag">
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
