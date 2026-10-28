import careerData from '../../content/career.yaml'
import contactData from '../../content/contact.yaml'
import projectsData from '../../content/projects.yaml'
import siteData from '../../content/site.yaml'
import uiData from '../../content/ui.yaml'
import workData from '../../content/work.yaml'
import type { Career, Contact, Localized, Projects, Site, Ui, Work } from './schema'

// Already validated at build time by build/content-plugin.ts
export const site = siteData as Site
export const career = careerData as Career
export const work = workData as Work
export const projects = projectsData as Projects
export const contact = contactData as Contact
export const ui = uiData as Ui

export type Lang = keyof Localized

export function localize(text: Localized, lang: Lang = 'de'): string {
  return text[lang] || text.de
}
