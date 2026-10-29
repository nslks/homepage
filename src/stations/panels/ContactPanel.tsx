import { Mail } from 'lucide-react'
import { contact, localize } from '../../content'
import { BrandIcon } from '../../ui/BrandIcon'
import { CvLink } from '../../ui/CvLink'

export function ContactPanel() {
  return (
    <ul className="contact-links">
      {contact.links.map((link) => {
        const external = !link.url.startsWith('mailto:')
        return (
          <li key={link.url}>
            <a
              className="button button--large"
              href={link.url}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {link.kind === 'email' ? (
                <Mail size={18} aria-hidden="true" />
              ) : (
                <BrandIcon kind={link.kind} />
              )}
              {localize(link.label)}
            </a>
          </li>
        )
      })}
      <li>
        <CvLink className="button button--large button--secondary" />
      </li>
    </ul>
  )
}
