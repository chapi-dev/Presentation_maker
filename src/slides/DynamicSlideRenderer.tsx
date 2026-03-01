import type { ReactElement } from "react";
import Logo from "../components/Logo";
import {
  Monitor,
  Brain,
  Briefcase,
  Lightbulb,
  Shield,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Globe,
  Users,
  Rocket,
  Star,
  Award,
  Database,
  Cpu,
  Layers,
  Settings,
  Heart,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Types ── */
export type SlideType =
  | "cover"
  | "intro"
  | "content"
  | "stats"
  | "quote"
  | "cards"
  | "outro"
  | "split"
  | "comparison"
  | "big-number"
  | "image-text";

export interface SlideData {
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string;
  bullets?: string[];
  quote?: { text: string; author: string };
  stats?: { value: string; label: string }[];
  cards?: { title: string; description: string; icon: string }[];
  contactItems?: { icon: string; text: string }[];
  author?: string;
  pageLabel?: string;
  imageQuery?: string;
  leftTitle?: string;
  leftContent?: string;
  rightTitle?: string;
  rightContent?: string;
}

/* ── Icon map ── */
const iconMap: Record<string, LucideIcon> = {
  Monitor, Brain, Briefcase, Lightbulb, Shield,
  TrendingUp, BarChart3, Target, Zap, Globe,
  Users, Rocket, Star, Award, Database,
  Cpu, Layers, Settings, Heart, BookOpen,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Lightbulb;
}

/* ── Video backgrounds (pool of 5 Mux videos) ── */
const VIDEO_POOL = [
  "https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8",
  "https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8",
  "https://stream.mux.com/fHfa8VIbBdqZelLGg5thjsypZ101M01dbyIMLNDWQwlLA.m3u8",
  "https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8",
  "https://stream.mux.com/00qQnfNo7sSpn3pB1hYKkyeSDvxs01NxiQ3sr29uL3e028.m3u8",
];

function getVideoForIndex(index: number): string {
  return VIDEO_POOL[index % VIDEO_POOL.length];
}

/* ── Color accent system for visual variety ── */
const ACCENT_COLORS = [
  { bg: "rgba(59, 130, 246, 0.12)", border: "rgba(59, 130, 246, 0.25)", glow: "rgba(59, 130, 246, 0.06)", solid: "#3b82f6" },   // blue
  { bg: "rgba(168, 85, 247, 0.12)", border: "rgba(168, 85, 247, 0.25)", glow: "rgba(168, 85, 247, 0.06)", solid: "#a855f7" },   // purple
  { bg: "rgba(236, 72, 153, 0.12)", border: "rgba(236, 72, 153, 0.25)", glow: "rgba(236, 72, 153, 0.06)", solid: "#ec4899" },   // pink
  { bg: "rgba(20, 184, 166, 0.12)", border: "rgba(20, 184, 166, 0.25)", glow: "rgba(20, 184, 166, 0.06)", solid: "#14b8a6" },   // teal
  { bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.25)", glow: "rgba(245, 158, 11, 0.06)", solid: "#f59e0b" },   // amber
  { bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.25)", glow: "rgba(239, 68, 68, 0.06)", solid: "#ef4444" },      // red
  { bg: "rgba(34, 197, 94, 0.12)", border: "rgba(34, 197, 94, 0.25)", glow: "rgba(34, 197, 94, 0.06)", solid: "#22c55e" },      // green
  { bg: "rgba(6, 182, 212, 0.12)", border: "rgba(6, 182, 212, 0.25)", glow: "rgba(6, 182, 212, 0.06)", solid: "#06b6d4" },      // cyan
];

function getAccent(index: number) {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

/* ── Decorative components ── */

function AccentGlow({ index }: { index: number }) {
  const accent = getAccent(index);
  const positions = [
    { top: "-15%", right: "-10%" },
    { bottom: "-20%", left: "-10%" },
    { top: "-10%", left: "-15%" },
    { bottom: "-15%", right: "-12%" },
  ];
  const pos = positions[index % positions.length];
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...pos,
        width: "clamp(250px, 45vw, 700px)",
        height: "clamp(250px, 45vw, 700px)",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${accent.glow}, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
  );
}

function GlassPanel({
  children,
  accent,
  className = "",
}: {
  children: React.ReactNode;
  accent: ReturnType<typeof getAccent>;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl relative overflow-hidden ${className}`}
      style={{
        padding: "clamp(20px, 2.5vw, 48px)",
        background: `linear-gradient(135deg, ${accent.bg}, rgba(255,255,255,0.03))`,
        border: `1px solid ${accent.border}`,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-[50%] h-[50%] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${accent.glow}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

function GradientArt({ index }: { index: number }) {
  const accent = getAccent(index);
  const patterns = [
    `radial-gradient(circle at 30% 30%, ${accent.bg}, transparent 50%), radial-gradient(circle at 70% 70%, ${accent.border}, transparent 40%), linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.15))`,
    `linear-gradient(135deg, ${accent.bg} 0%, transparent 50%), linear-gradient(225deg, ${accent.border} 0%, transparent 50%), linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))`,
    `radial-gradient(ellipse at 40% 50%, ${accent.bg}, transparent 60%), conic-gradient(from 180deg at 60% 50%, ${accent.glow}, transparent, ${accent.border}, transparent), linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2))`,
    `linear-gradient(160deg, ${accent.bg}, transparent 40%), radial-gradient(circle at 80% 20%, ${accent.border}, transparent 50%), linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15))`,
  ];
  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: patterns[index % patterns.length],
        border: `1px solid ${accent.border}`,
      }}
    />
  );
}

/* ── Reusable pieces ── */
import VideoBackground from "../components/VideoBackground";

function SlideHeader({ pageLabel }: { pageLabel?: string }) {
  return (
    <header
      className="flex items-center justify-between w-full"
      style={{ padding: "3% 5.2%" }}
    >
      <Logo />
      <span style={{ fontSize: "clamp(12px, 1.05vw, 20px)", opacity: 0.8 }}>
        Pitch Deck
      </span>
      {pageLabel ? (
        <span style={{ fontSize: "clamp(12px, 1.05vw, 20px)", opacity: 0.8 }}>
          {pageLabel}
        </span>
      ) : (
        <span />
      )}
    </header>
  );
}

function GlassCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const Icon = getIcon(icon);
  return (
    <div
      className="flex flex-col justify-end flex-1 rounded-2xl"
      style={{
        padding: "clamp(20px, 2.5vw, 48px)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute top-0 left-0 w-[60%] h-[60%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(255,255,255,0.07), transparent 70%)",
        }}
      />
      <Icon
        style={{
          width: "clamp(32px, 2.5vw, 48px)",
          height: "clamp(32px, 2.5vw, 48px)",
          strokeWidth: 1.5,
        }}
        color="white"
      />
      <h3
        style={{
          fontSize: "clamp(18px, 1.8vw, 36px)",
          fontWeight: 700,
          marginTop: "clamp(10px, 1vw, 18px)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "clamp(12px, 1.05vw, 20px)",
          opacity: 0.8,
          marginTop: "clamp(4px, 0.4vw, 8px)",
          lineHeight: 1.4,
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ── Individual slide renderers ── */

function CoverSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader />
        <div className="flex-1 flex flex-col items-center justify-center" style={{ marginTop: "-3%" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 96px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontWeight: 700,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {data.title}
          </h1>
          {data.subtitle && (
            <p style={{ fontSize: "clamp(20px, 2.5vw, 48px)", opacity: 0.9, marginTop: "1.5%", textAlign: "center" }}>
              {data.subtitle}
            </p>
          )}
          {data.author && (
            <p style={{ fontSize: "clamp(14px, 1.2vw, 24px)", opacity: 0.75, marginTop: "2%", textAlign: "center" }}>
              {data.author}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function IntroSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div style={{ padding: "0 5.2%" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            {data.title}
          </h1>
        </div>
        <div className="flex" style={{ marginTop: "3.5%", padding: "0 5.2%", gap: "4%", flex: 1 }}>
          <div style={{ flex: "0 0 55%" }}>
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, lineHeight: 1.5 }}>
              {data.content}
            </p>
          </div>
          {data.stats && data.stats.length > 0 && (
            <div className="flex flex-col gap-[6%]" style={{ flex: "0 0 30%" }}>
              {data.stats.map((s, i) => (
                <div key={i}>
                  <span style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, lineHeight: 1, color: accent.solid }}>
                    {s.value}
                  </span>
                  <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.8, marginTop: "2%" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContentSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div className="flex-1 flex flex-col justify-center" style={{ padding: "0 5.2%" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {data.title}
          </h1>
          {data.content && (
            <p
              style={{
                fontSize: "clamp(13px, 1.05vw, 20px)",
                opacity: 0.9,
                maxWidth: "60%",
                marginTop: "3%",
                lineHeight: 1.6,
              }}
            >
              {data.content}
            </p>
          )}
          {data.bullets && data.bullets.length > 0 && (
            <ul style={{ marginTop: "2.5%", maxWidth: "60%", listStyle: "none", padding: 0 }}>
              {data.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-[10px]"
                  style={{
                    fontSize: "clamp(13px, 1.05vw, 20px)",
                    opacity: 0.9,
                    lineHeight: 1.5,
                    marginTop: i > 0 ? "1.5%" : 0,
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent.solid, flexShrink: 0, marginTop: "0.5em" }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div className="text-center" style={{ padding: "0 5.2%", marginTop: "2%" }}>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {data.title}
          </h1>
          {data.content && (
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, marginTop: "1.5%", maxWidth: "60%", marginInline: "auto", lineHeight: 1.5 }}>
              {data.content}
            </p>
          )}
        </div>
        {data.stats && (
          <div className="flex-1 flex items-center justify-center" style={{ padding: "0 5.2%", gap: "clamp(20px, 4vw, 80px)" }}>
            {data.stats.map((s, i) => (
              <div
                key={i}
                className="text-center rounded-2xl"
                style={{
                  padding: "clamp(24px, 3vw, 60px) clamp(20px, 2.5vw, 48px)",
                  background: `linear-gradient(135deg, ${accent.bg}, rgba(255,255,255,0.03))`,
                  border: `1px solid ${accent.border}`,
                  backdropFilter: "blur(24px) saturate(1.4)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-[60%] h-[60%] pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${accent.glow}, transparent 70%)` }}
                />
                <span style={{ fontSize: "clamp(32px, 4vw, 80px)", fontWeight: 700, lineHeight: 1, color: accent.solid }}>
                  {s.value}
                </span>
                <p style={{ fontSize: "clamp(12px, 1.05vw, 20px)", opacity: 0.8, marginTop: "clamp(8px, 0.8vw, 16px)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuoteSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center text-center" style={{ maxWidth: "70%", gap: "12px" }}>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: accent.solid, marginBottom: "8px" }} />
          {data.quote?.author && (
            <p style={{ fontSize: "clamp(14px, 1.1vw, 20px)", opacity: 0.9, color: accent.solid }}>
              {data.quote.author}
            </p>
          )}
          <blockquote
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            &ldquo;{data.quote?.text}&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}

function CardsSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const cards = data.cards || [];
  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div className="text-center" style={{ padding: "0 5.2%" }}>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {data.title}
          </h1>
        </div>
        <div className="flex flex-col flex-1" style={{ padding: "2% 5.2% 3%", gap: "clamp(10px, 1.3vw, 25px)" }}>
          <div className="flex flex-1" style={{ gap: "clamp(10px, 1.4vw, 27px)" }}>
            {topRow.map((c, i) => (
              <GlassCard key={i} icon={c.icon} title={c.title} description={c.description} />
            ))}
          </div>
          {bottomRow.length > 0 && (
            <div className="flex flex-1" style={{ gap: "clamp(10px, 1.3vw, 25px)" }}>
              {bottomRow.map((c, i) => (
                <GlassCard key={i} icon={c.icon} title={c.title} description={c.description} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OutroSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div className="flex-1 flex flex-col justify-center" style={{ padding: "0 5.2%" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {data.title}
          </h1>
          {data.content && (
            <p
              style={{
                fontSize: "clamp(13px, 1.05vw, 20px)",
                opacity: 0.9,
                maxWidth: "50%",
                marginTop: "3%",
                lineHeight: 1.5,
              }}
            >
              {data.content}
            </p>
          )}
        </div>
        <footer className="flex items-center justify-center w-full" style={{ padding: "2% 5.2%" }}>
          <div style={{ width: 40, height: 3, borderRadius: 2, background: accent.solid, opacity: 0.6 }} />
        </footer>
      </div>
    </div>
  );
}

/* ── New slide types ── */

function SplitSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div style={{ padding: "0 5.2%" }}>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {data.title}
          </h1>
        </div>
        <div className="flex flex-1" style={{ padding: "3% 5.2% 4%", gap: "clamp(16px, 2.5vw, 48px)" }}>
          <GlassPanel accent={accent} className="flex-1 flex flex-col">
            {data.leftTitle && (
              <h3 style={{ fontSize: "clamp(18px, 1.8vw, 36px)", fontWeight: 700, marginBottom: "clamp(8px, 1vw, 16px)", color: accent.solid }}>
                {data.leftTitle}
              </h3>
            )}
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, lineHeight: 1.6 }}>
              {data.leftContent}
            </p>
          </GlassPanel>
          <GlassPanel accent={accent} className="flex-1 flex flex-col">
            {data.rightTitle && (
              <h3 style={{ fontSize: "clamp(18px, 1.8vw, 36px)", fontWeight: 700, marginBottom: "clamp(8px, 1vw, 16px)", color: accent.solid }}>
                {data.rightTitle}
              </h3>
            )}
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, lineHeight: 1.6 }}>
              {data.rightContent}
            </p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function ComparisonSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  const accent2 = getAccent(index + 3);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div className="text-center" style={{ padding: "0 5.2%" }}>
          <h1 style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {data.title}
          </h1>
          {data.content && (
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.8, marginTop: "1%", maxWidth: "60%", marginInline: "auto" }}>
              {data.content}
            </p>
          )}
        </div>
        <div className="flex flex-1 items-center" style={{ padding: "2% 5.2% 4%", gap: "clamp(12px, 1.5vw, 30px)" }}>
          <GlassPanel accent={accent} className="flex-1 flex flex-col h-full">
            {data.leftTitle && (
              <h3 style={{ fontSize: "clamp(18px, 1.8vw, 36px)", fontWeight: 700, marginBottom: "clamp(8px, 1vw, 16px)", color: accent.solid }}>
                {data.leftTitle}
              </h3>
            )}
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, lineHeight: 1.6 }}>
              {data.leftContent}
            </p>
          </GlassPanel>
          <div className="flex items-center justify-center" style={{ flexShrink: 0 }}>
            <span style={{ fontSize: "clamp(16px, 1.5vw, 28px)", fontWeight: 700, opacity: 0.5 }}>VS</span>
          </div>
          <GlassPanel accent={accent2} className="flex-1 flex flex-col h-full">
            {data.rightTitle && (
              <h3 style={{ fontSize: "clamp(18px, 1.8vw, 36px)", fontWeight: 700, marginBottom: "clamp(8px, 1vw, 16px)", color: accent2.solid }}>
                {data.rightTitle}
              </h3>
            )}
            <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, lineHeight: 1.6 }}>
              {data.rightContent}
            </p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function BigNumberSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  const stat = data.stats?.[0];
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        <h2 style={{ fontSize: "clamp(18px, 1.8vw, 36px)", fontWeight: 600, opacity: 0.8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {data.title}
        </h2>
        {stat && (
          <>
            <span
              style={{
                fontSize: "clamp(64px, 10vw, 200px)",
                fontWeight: 800,
                lineHeight: 1,
                marginTop: "1%",
                background: `linear-gradient(135deg, ${accent.solid}, white)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.value}
            </span>
            <p style={{ fontSize: "clamp(16px, 1.5vw, 30px)", opacity: 0.8, marginTop: "1%" }}>
              {stat.label}
            </p>
          </>
        )}
        {data.content && (
          <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.7, maxWidth: "50%", marginTop: "3%", lineHeight: 1.5 }}>
            {data.content}
          </p>
        )}
      </div>
    </div>
  );
}

function ImageTextSlideRender({ data, videoSrc, index }: { data: SlideData; videoSrc: string; index: number }) {
  const accent = getAccent(index);
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <AccentGlow index={index} />
      <div className="relative z-10 flex flex-col w-full h-full">
        <SlideHeader pageLabel={data.pageLabel} />
        <div className="flex flex-1" style={{ padding: "0 5.2% 4%", gap: "clamp(16px, 2.5vw, 48px)" }}>
          {/* Gradient art panel */}
          <div className="flex items-center" style={{ flex: "0 0 38%" }}>
            <GradientArt index={index} />
          </div>
          {/* Text content */}
          <div className="flex flex-col justify-center flex-1">
            <h1 style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              {data.title}
            </h1>
            {data.content && (
              <p style={{ fontSize: "clamp(13px, 1.05vw, 20px)", opacity: 0.9, marginTop: "3%", lineHeight: 1.6, maxWidth: "90%" }}>
                {data.content}
              </p>
            )}
            {data.imageQuery && (
              <div style={{ marginTop: "3%", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 24, height: 2, background: accent.solid }} />
                <span style={{ fontSize: "clamp(11px, 0.9vw, 16px)", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {data.imageQuery}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main renderer: converts SlideData[] → ReactElement[] ── */
export function renderSlides(slides: SlideData[]): ReactElement[] {
  return slides.map((data, index) => {
    const videoSrc = getVideoForIndex(index);
    const key = `slide-${index}`;

    switch (data.type) {
      case "cover":
        return <CoverSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "intro":
        return <IntroSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "content":
        return <ContentSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "stats":
        return <StatsSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "quote":
        return <QuoteSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "cards":
        return <CardsSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "split":
        return <SplitSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "comparison":
        return <ComparisonSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "big-number":
        return <BigNumberSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "image-text":
        return <ImageTextSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      case "outro":
        return <OutroSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
      default:
        return <ContentSlideRender key={key} data={data} videoSrc={videoSrc} index={index} />;
    }
  });
}
