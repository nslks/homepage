import { localize, ui } from '../../content'

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// one cycle: a measurement travels from the sensor to the phone, then the push stays up a while
const CYCLE = '8s'

type Node = { x: number; y: number; w: number; label: string; sub: string }

const H = 44
// shared ingest: sensor → broker → collector → API
const ingest: Node[] = [
  { x: 75, y: 8, w: 170, label: 'ESP32', sub: 'DHT11: Temperatur & Feuchte' },
  { x: 75, y: 76, w: 170, label: 'MQTT', sub: 'Broker, Publish/Subscribe' },
  { x: 75, y: 144, w: 170, label: 'Data Collector', sub: 'Python, prüft Messwerte' },
  { x: 75, y: 212, w: 170, label: 'API', sub: 'FastAPI' },
]

// after the API the flow splits into two scenarios, each in its own lane
// titles sit at the outer edge so the lines can enter each lane on the inner side
type Lane = { x: number; title: string; titleX: number; anchor: 'start' | 'end'; nodes: Node[] }
const LANE_Y = 268
const LANE_H = 256
const lanes: Lane[] = [
  {
    x: 4,
    title: 'Echtzeit → handeln',
    titleX: 14,
    anchor: 'start',
    nodes: [
      { x: 12, y: 304, w: 136, label: 'Ollama', sub: 'lokales Sprachmodell' },
      { x: 12, y: 384, w: 136, label: 'ntfy', sub: 'Push aufs Handy' },
    ],
  },
  {
    x: 164,
    title: 'Verlauf → Learnings',
    titleX: 306,
    anchor: 'end',
    nodes: [
      { x: 172, y: 304, w: 136, label: 'InfluxDB', sub: 'Zeitreihen-DB' },
      { x: 172, y: 384, w: 136, label: 'MCP-Server', sub: 'liest den Verlauf' },
      { x: 172, y: 464, w: 136, label: 'KI-Agent', sub: 'wertet Wochen aus' },
    ],
  },
]

// paths run through node centres; the nodes are drawn on top, so dots "enter" each box
const mainPath = 'M160 30 V262 H140 V326 H80 V406'
const storePath = 'M160 262 H180 V326 H240'
// the agent asks for history through the MCP server and gets it back
const historyPath = 'M240 486 V326'

function FlowNode({ node }: { node: Node }) {
  return (
    <g>
      <rect className="flow__node" x={node.x} y={node.y} width={node.w} height={H} rx="10" />
      <text className="flow__label" x={node.x + node.w / 2} y={node.y + 19}>
        {node.label}
      </text>
      <text className="flow__sub" x={node.x + node.w / 2} y={node.y + 35}>
        {node.sub}
      </text>
    </g>
  )
}

// Animated system diagram for Climora (no UI of its own, so the flow is what there is to see)
export function ClimoraFlow() {
  const animate = !prefersReducedMotion()
  return (
    <svg
      className="flow"
      viewBox="0 0 320 532"
      role="img"
      aria-label={localize(ui.project.climoraDiagram)}
    >
      {lanes.map((lane) => (
        <g key={lane.title}>
          <rect className="flow__lane" x={lane.x} y={LANE_Y} width="152" height={LANE_H} rx="14" />
          <text
            className="flow__lane-title"
            x={lane.titleX}
            y={LANE_Y + 19}
            textAnchor={lane.anchor}
          >
            {lane.title}
          </text>
        </g>
      ))}

      <path className="flow__line" d={mainPath} />
      <path className="flow__line" d={storePath} />
      <path className="flow__line" d={historyPath} />

      {animate && (
        <>
          <circle className="flow__dot" r="6">
            <animateMotion dur={CYCLE} repeatCount="indefinite" path={mainPath} />
          </circle>
          {/* waits below the API until the main dot gets there (about half of the main path) */}
          <circle className="flow__dot" r="6">
            <animateMotion
              dur={CYCLE}
              repeatCount="indefinite"
              path={storePath}
              keyPoints="0;0;1;1"
              keyTimes="0;0.51;0.68;1"
              calcMode="linear"
            />
          </circle>
          {/* a history query: up to InfluxDB and back down to the agent */}
          <circle className="flow__dot flow__dot--query" r="6">
            <animateMotion
              dur={CYCLE}
              repeatCount="indefinite"
              path={historyPath}
              keyPoints="0;0;1;0;0"
              keyTimes="0;0.1;0.35;0.6;1"
              calcMode="linear"
            />
          </circle>
        </>
      )}

      {ingest.map((node) => (
        <FlowNode key={node.label} node={node} />
      ))}
      {lanes.map((lane) => lane.nodes.map((node) => <FlowNode key={node.label} node={node} />))}

      {/* appears when the dot reaches ntfy and stays for about 3.5 s */}
      <g className="flow__push">
        <rect x="12" y="448" width="136" height="28" rx="14" />
        <text x="80" y="466">
          Bad: 78 % – lüften!
        </text>
        {animate && (
          <animate
            attributeName="opacity"
            dur={CYCLE}
            repeatCount="indefinite"
            values="1;1;0;0;1"
            keyTimes="0;0.4;0.45;0.96;1"
          />
        )}
      </g>
    </svg>
  )
}
