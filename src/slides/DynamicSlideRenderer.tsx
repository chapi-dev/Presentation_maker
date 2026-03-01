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
  | "outro";

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

function CoverSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
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
        <footer className="flex items-center justify-center w-full" style={{ padding: "2% 5.2%" }}>
          <span style={{ fontSize: "clamp(12px, 1.05vw, 20px)", opacity: 0.6 }}>2024</span>
        </footer>
      </div>
    </div>
  );
}

function IntroSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
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
                  <span style={{ fontSize: "clamp(28px, 3.5vw, 64px)", fontWeight: 700, lineHeight: 1 }}>
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

function ContentSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
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
                  <span style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>—</span>
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

function StatsSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
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
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(24px) saturate(1.4)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-[60%] h-[60%] pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.07), transparent 70%)" }}
                />
                <span style={{ fontSize: "clamp(32px, 4vw, 80px)", fontWeight: 700, lineHeight: 1 }}>
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

function QuoteSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center text-center" style={{ maxWidth: "70%", gap: "12px" }}>
          {data.quote?.author && (
            <p style={{ fontSize: "clamp(14px, 1.1vw, 20px)", opacity: 0.9 }}>
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

function CardsSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  const cards = data.cards || [];
  // Split into top row (3) and bottom row (rest)
  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
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

function OutroSlideRender({ data, videoSrc }: { data: SlideData; videoSrc: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={videoSrc} />
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
          <span style={{ fontSize: "clamp(14px, 1.1vw, 22px)", opacity: 0.6 }}>
            Thank you
          </span>
        </footer>
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
        return <CoverSlideRender key={key} data={data} videoSrc={videoSrc} />;
      case "intro":
        return <IntroSlideRender key={key} data={data} videoSrc={videoSrc} />;
      case "content":
        return <ContentSlideRender key={key} data={data} videoSrc={videoSrc} />;
      case "stats":
        return <StatsSlideRender key={key} data={data} videoSrc={videoSrc} />;
      case "quote":
        return <QuoteSlideRender key={key} data={data} videoSrc={videoSrc} />;
      case "cards":
        return <CardsSlideRender key={key} data={data} videoSrc={videoSrc} />;
      case "outro":
        return <OutroSlideRender key={key} data={data} videoSrc={videoSrc} />;
      default:
        return <ContentSlideRender key={key} data={data} videoSrc={videoSrc} />;
    }
  });
}
