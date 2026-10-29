import { Code, ExternalLink, TriangleAlert } from 'lucide-react'
import { localize, projects, ui } from '../../content'
import type { Projects } from '../../content/schema'
import { ClimoraFlow } from './ClimoraFlow'

type Project = Projects['entries'][number]

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="project">
      <h3 className="project__name">
        <span className="project__door" style={{ background: project.accent }} aria-hidden="true" />
        {project.name}
        {project.status === 'wip' && (
          <span className="badge badge--wip">
            <TriangleAlert size={14} aria-hidden="true" />
            {localize(ui.project.wip)}
          </span>
        )}
      </h3>
      <p className="project__summary">{localize(project.summary)}</p>
      {project.tech.length > 0 && (
        <ul className="tags">
          {project.tech.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>
      )}
      {project.diagram === 'climora' && <ClimoraFlow />}
      {(project.url || project.repoUrl) && (
        <div className="project__actions">
          {project.url && (
            <a className="button" href={project.url} target="_blank" rel="noopener noreferrer">
              {localize(ui.project.open)}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}
          {project.repoUrl && (
            <a
              className="button button--secondary"
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code size={16} aria-hidden="true" />
              {localize(ui.project.repo)}
            </a>
          )}
        </div>
      )}
    </li>
  )
}

// All projects in one panel — scales with any number of entries
export function ProjectsPanel() {
  return (
    <ul className="projects">
      {projects.entries.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </ul>
  )
}
