import { useId } from 'react'
import { siGithub } from 'simple-icons'

type Props = { kind: 'github' | 'linkedin'; size?: number }

// GitHub mark from simple-icons (CC0). LinkedIn asked simple-icons to drop its logo, so it gets
// a plain "in" badge instead of the trademarked mark
export function BrandIcon({ kind, size = 18 }: Props) {
  const maskId = useId()
  if (kind === 'github') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={siGithub.path} />
      </svg>
    )
  }
  // the letters are cut out of the square, so the badge works on any background
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <mask id={maskId}>
        <rect width="24" height="24" fill="#fff" />
        <text
          x="12"
          y="17.2"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="13.5"
          fontWeight="700"
          fill="#000"
        >
          in
        </text>
      </mask>
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="5"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}
