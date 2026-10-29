import { Code, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { localize, projects, ui } from '../../content'
import type { Projects } from '../../content/schema'
import { useAppStore } from '../../state/store'

type Project = Projects['entries'][number]

function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="project">
      <h3 className="project__name">
        <span
          className="project__door"
          style={{ background: project.doorColor }}
          aria-hidden="true"
        />
        {project.name}
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
      <div className="project__actions">
        {project.url ? (
          <a className="button" href={project.url} target="_blank" rel="noopener noreferrer">
            {localize(ui.project.open)}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        ) : (
          <button type="button" className="button" disabled>
            {localize(ui.project.comingSoon)}
          </button>
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
    </li>
  )
}

// Opened at a door: that project. Opened via the station label: all projects
export function ProjectsPanel() {
  const [selected] = useState(() => useAppStore.getState().nearProject)
  const shown = selected !== null ? [projects.entries[selected]!] : projects.entries
  return (
    <ul className="projects">
      {shown.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </ul>
  )
}
