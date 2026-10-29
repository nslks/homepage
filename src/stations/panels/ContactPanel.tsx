import { Code, Link, Mail } from 'lucide-react'
import { contact, localize } from '../../content'
import type { Contact } from '../../content/schema'

type Kind = Contact['links'][number]['kind']

// lucide ships no brand logos; neutral icons keep the panel calm
const icons: Record<Kind, typeof Code> = { github: Code, linkedin: Link, email: Mail }

export function ContactPanel() {
  return (
    <ul className="contact-links">
      {contact.links.map((link) => {
        const Icon = icons[link.kind]
        const external = !link.url.startsWith('mailto:')
        return (
          <li key={link.url}>
            <a
              className="button button--large"
              href={link.url}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <Icon size={18} aria-hidden="true" />
              {localize(link.label)}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
