import type { ReactElement } from "react";

/* ── Types (mirror server) ── */
export interface DiagramNode {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
}

export interface DiagramSlideData {
  title: string;
  content?: string;
  diagramType?: "flow" | "architecture" | "layers" | "cycle";
  nodes?: DiagramNode[];
  connections?: DiagramConnection[];
  architectureImage?: string;
  pageLabel?: string;
}

/* ── Azure icon colors ── */
const ICON_COLORS: Record<string, string> = {
  "app-service": "#0078D4",
  functions: "#FFB900",
  storage: "#0078D4",
  database: "#E8731B",
  container: "#0078D4",
  kubernetes: "#326CE5",
  network: "#3999C6",
  security: "#E74856",
  monitor: "#68217A",
  ai: "#0078D4",
  api: "#47B5B1",
  identity: "#FFB900",
  messaging: "#FF8C00",
  compute: "#0078D4",
  devops: "#0078D4",
  cloud: "#0078D4",
};

/* ── Simple icon shapes (24x24 viewBox) ── */
function AzureIconSvg({ icon, size = 28 }: { icon?: string; size?: number }) {
  const color = (icon && ICON_COLORS[icon]) || "#0078D4";

  // Simple recognizable shapes per service
  const shapes: Record<string, ReactElement> = {
    "app-service": (
      <g>
        <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M7 8h10M7 12h10M7 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ),
    functions: (
      <g>
        <path d="M13 2L4 14h6l-2 8 9-12h-6l2-8z" fill={color} opacity="0.9" />
      </g>
    ),
    storage: (
      <g>
        <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="1.5" />
        <line x1="2" y1="14" x2="22" y2="14" stroke={color} strokeWidth="1.5" />
        <circle cx="6" cy="8" r="1" fill={color} />
        <circle cx="6" cy="12" r="1" fill={color} />
        <circle cx="6" cy="16" r="1" fill={color} />
      </g>
    ),
    database: (
      <g>
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" fill="none" stroke={color} strokeWidth="1.5" />
      </g>
    ),
    container: (
      <g>
        <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="9" y1="4" x2="9" y2="20" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="15" y1="4" x2="15" y2="20" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth="1" opacity="0.5" />
      </g>
    ),
    kubernetes: (
      <g>
        <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill={color} opacity="0.3" stroke={color} strokeWidth="1" />
        <line x1="12" y1="3" x2="12" y2="9" stroke={color} strokeWidth="1" />
        <line x1="12" y1="15" x2="12" y2="21" stroke={color} strokeWidth="1" />
        <line x1="4" y1="8" x2="9.5" y2="10.5" stroke={color} strokeWidth="1" />
        <line x1="14.5" y1="13.5" x2="20" y2="16" stroke={color} strokeWidth="1" />
      </g>
    ),
    network: (
      <g>
        <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke={color} strokeWidth="1" />
        <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1" />
        <path d="M4.5 8h15" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <path d="M4.5 16h15" stroke={color} strokeWidth="0.8" opacity="0.5" />
      </g>
    ),
    security: (
      <g>
        <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    ),
    monitor: (
      <g>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="8" y1="20" x2="16" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12" y2="20" stroke={color} strokeWidth="1.5" />
        <polyline points="7,12 10,9 13,11 17,7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ),
    ai: (
      <g>
        <circle cx="12" cy="12" r="4" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="4" r="2" fill={color} opacity="0.6" />
        <circle cx="12" cy="20" r="2" fill={color} opacity="0.6" />
        <circle cx="4" cy="8" r="2" fill={color} opacity="0.6" />
        <circle cx="20" cy="8" r="2" fill={color} opacity="0.6" />
        <circle cx="4" cy="16" r="2" fill={color} opacity="0.6" />
        <circle cx="20" cy="16" r="2" fill={color} opacity="0.6" />
        <line x1="12" y1="6" x2="12" y2="8" stroke={color} strokeWidth="1" />
        <line x1="12" y1="16" x2="12" y2="18" stroke={color} strokeWidth="1" />
        <line x1="5.5" y1="9" x2="8.5" y2="10.5" stroke={color} strokeWidth="1" />
        <line x1="15.5" y1="13.5" x2="18.5" y2="15" stroke={color} strokeWidth="1" />
      </g>
    ),
    api: (
      <g>
        <path d="M14 12l-2 2-2-2 2-2z" fill={color} />
        <path d="M12 6l2.12 2.12 2.5-2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M6 12l2.12-2.12-2.5-2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M18 12l-2.12 2.12 2.5 2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M12 18l-2.12-2.12-2.5 2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    ),
    identity: (
      <g>
        <circle cx="12" cy="8" r="4" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6" fill="none" stroke={color} strokeWidth="1.5" />
      </g>
    ),
    messaging: (
      <g>
        <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
        <polyline points="3,5 12,13 21,5" fill="none" stroke={color} strokeWidth="1.5" />
      </g>
    ),
    compute: (
      <g>
        <rect x="3" y="4" width="18" height="12" rx="1" fill="none" stroke={color} strokeWidth="1.5" />
        <line x1="8" y1="20" x2="16" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12" y2="20" stroke={color} strokeWidth="1.5" />
      </g>
    ),
    devops: (
      <g>
        <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M8 4l1 3M16 4l-1 3" stroke={color} strokeWidth="1" fill="none" />
      </g>
    ),
    cloud: (
      <g>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="none" stroke={color} strokeWidth="1.5" />
      </g>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {shapes[icon || "cloud"] || shapes["cloud"]}
    </svg>
  );
}

/* ── Layout engine: position nodes based on diagram type ── */
interface PositionedNode extends DiagramNode {
  x: number;
  y: number;
}

function layoutNodes(
  nodes: DiagramNode[],
  diagramType: string,
  width: number,
  height: number
): PositionedNode[] {
  const n = nodes.length;
  const padX = 100;
  const padY = 60;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  switch (diagramType) {
    case "flow": {
      // Horizontal flow: left to right
      return nodes.map((node, i) => ({
        ...node,
        x: padX + (usableW / Math.max(n - 1, 1)) * i,
        y: height / 2,
      }));
    }
    case "layers": {
      // Vertical layers: top to bottom
      return nodes.map((node, i) => ({
        ...node,
        x: width / 2,
        y: padY + (usableH / Math.max(n - 1, 1)) * i,
      }));
    }
    case "cycle": {
      // Circular layout
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(usableW, usableH) / 2.5;
      return nodes.map((node, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        return {
          ...node,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        };
      });
    }
    case "architecture":
    default: {
      // Grid layout: 2-3 columns
      const cols = n <= 4 ? 2 : 3;
      const rows = Math.ceil(n / cols);
      return nodes.map((node, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          ...node,
          x: padX + (usableW / Math.max(cols - 1, 1)) * col,
          y: padY + (usableH / Math.max(rows - 1, 1)) * row,
        };
      });
    }
  }
}

/* ── Main render function ── */
export function DiagramSlideContent({
  data,
  accentColor,
}: {
  data: DiagramSlideData;
  accentColor: string;
}): ReactElement {
  const nodes = data.nodes || [];
  const connections = data.connections || [];
  const diagramType = data.diagramType || "architecture";
  const hasArchImage = !!data.architectureImage;

  // If we have an architecture image from Learn, use split layout
  if (hasArchImage) {
    return (
      <div className="flex flex-1 w-full" style={{ padding: "0 4% 3%", gap: "3%" }}>
        {/* Architecture image from Learn */}
        <div
          className="flex items-center justify-center rounded-2xl overflow-hidden"
          style={{
            flex: "0 0 48%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "2%",
          }}
        >
          <img
            src={data.architectureImage}
            alt={data.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
            onError={(e) => {
              // Fallback: hide the image panel if it fails to load
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
        </div>
        {/* Text + mini diagram */}
        <div className="flex flex-col flex-1 justify-center">
          {data.content && (
            <p
              style={{
                fontSize: "clamp(13px, 1.05vw, 20px)",
                opacity: 0.9,
                lineHeight: 1.6,
                marginBottom: "3%",
              }}
            >
              {data.content}
            </p>
          )}
          {nodes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-2 rounded-lg"
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "clamp(11px, 0.9vw, 15px)",
                  }}
                >
                  <AzureIconSvg icon={node.icon} size={20} />
                  <span>{node.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // SVG diagram rendering
  const svgW = 800;
  const svgH = 400;
  const positioned = layoutNodes(nodes, diagramType, svgW, svgH);
  const nodeById = new Map(positioned.map((n) => [n.id, n]));

  return (
    <div className="flex flex-1 w-full" style={{ padding: "0 4% 3%", gap: "3%" }}>
      {/* SVG diagram */}
      <div
        className="flex items-center justify-center flex-1"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "2%",
          minHeight: 0,
        }}
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ width: "100%", height: "100%", maxHeight: "100%" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill={accentColor}
                opacity="0.7"
              />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connections */}
          {connections.map((conn, i) => {
            const from = nodeById.get(conn.from);
            const to = nodeById.get(conn.to);
            if (!from || !to) return null;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={`conn-${i}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={accentColor}
                  strokeWidth="2"
                  opacity="0.4"
                  markerEnd="url(#arrowhead)"
                />
                {/* Glow line */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={accentColor}
                  strokeWidth="4"
                  opacity="0.1"
                  filter="url(#glow)"
                />
                {conn.label && (
                  <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    fill="white"
                    opacity="0.6"
                    fontSize="11"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {positioned.map((node) => {
            const iconColor = (node.icon && ICON_COLORS[node.icon]) || accentColor;
            return (
              <g key={node.id}>
                {/* Background glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="45"
                  fill={iconColor}
                  opacity="0.06"
                  filter="url(#glow)"
                />
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill="rgba(0,0,0,0.6)"
                  stroke={iconColor}
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                {/* Icon */}
                <g transform={`translate(${node.x - 12}, ${node.y - 12})`}>
                  <AzureIconSvg icon={node.icon} size={24} />
                </g>
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + 48}
                  textAnchor="middle"
                  fill="white"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {node.label}
                </text>
                {/* Description */}
                {node.description && (
                  <text
                    x={node.x}
                    y={node.y + 63}
                    textAnchor="middle"
                    fill="white"
                    opacity="0.5"
                    fontSize="10"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {node.description.length > 30
                      ? node.description.slice(0, 30) + "…"
                      : node.description}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Content panel */}
      {data.content && (
        <div
          className="flex flex-col justify-center"
          style={{ flex: "0 0 30%", minWidth: 0 }}
        >
          <p
            style={{
              fontSize: "clamp(13px, 1.05vw, 20px)",
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            {data.content}
          </p>
        </div>
      )}
    </div>
  );
}
