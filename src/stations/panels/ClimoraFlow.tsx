import { localize, ui } from '../../content'

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// one cycle: a measurement travels from the sensor to the phone, then the push shows up
const CYCLE = '6s'

type Node = { x: number; y: number; w: number; label: string; sub: string }

const W = 150
const H = 44
const nodes: Node[] = [
  { x: 85, y: 8, w: W, label: 'Sensor', sub: 'Arduino' },
  { x: 85, y: 84, w: W, label: 'MQTT', sub: 'Mosquitto' },
  { x: 85, y: 160, w: W, label: 'Collector', sub: 'prüft die Messung' },
  { x: 85, y: 236, w: W, label: 'Processor', sub: 'FastAPI' },
  { x: 10, y: 312, w: 130, label: 'InfluxDB', sub: 'speichert' },
  { x: 180, y: 312, w: 130, label: 'Ollama', sub: 'entscheidet' },
  { x: 85, y: 388, w: W, label: 'ntfy', sub: 'Push aufs Handy' },
]

// both paths run through node centres; the nodes are drawn on top, so dots "enter" each box
const mainPath = 'M160 30 V258 L245 334 L160 410'
const storePath = 'M160 258 L75 334'

// Animated system diagram for Climora (no UI of its own, so the flow is what there is to see)
export function ClimoraFlow() {
  const animate = !prefersReducedMotion()
  return (
    <svg
      className="flow"
      viewBox="0 0 320 470"
      role="img"
      aria-label={localize(ui.project.climoraDiagram)}
    >
      <path className="flow__line" d={mainPath} />
      <path className="flow__line" d={storePath} />

      {animate && (
        <>
          <circle className="flow__dot" r="6">
            <animateMotion dur={CYCLE} repeatCount="indefinite" path={mainPath} />
          </circle>
          {/* waits at the processor until the main dot arrives (half of the main path) */}
          <circle className="flow__dot" r="6">
            <animateMotion
              dur={CYCLE}
              repeatCount="indefinite"
              path={storePath}
              keyPoints="0;0;1;1"
              keyTimes="0;0.5;0.65;1"
              calcMode="linear"
            />
          </circle>
        </>
      )}

      {nodes.map((node) => (
        <g key={node.label}>
          <rect className="flow__node" x={node.x} y={node.y} width={node.w} height={H} rx="10" />
          <text className="flow__label" x={node.x + node.w / 2} y={node.y + 19}>
            {node.label}
          </text>
          <text className="flow__sub" x={node.x + node.w / 2} y={node.y + 35}>
            {node.sub}
          </text>
        </g>
      ))}

      <g className="flow__push">
        <rect x="60" y="440" width="200" height="26" rx="13" />
        <text x="160" y="457">
          Bad: 78 % – jetzt lüften
        </text>
        {animate && (
          <animate
            attributeName="opacity"
            dur={CYCLE}
            repeatCount="indefinite"
            values="1;0;0;1;1"
            keyTimes="0;0.1;0.88;0.92;1"
          />
        )}
      </g>
    </svg>
  )
}
