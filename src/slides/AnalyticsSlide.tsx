import VideoBackground from "../components/VideoBackground";
import Logo from "../components/Logo";
import { Monitor, Brain, Briefcase, Lightbulb, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const VIDEO_SRC =
  "https://stream.mux.com/fHfa8VIbBdqZelLGg5thjsypZ101M01dbyIMLNDWQwlLA.m3u8";

interface CardData {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const topCards: CardData[] = [
  {
    Icon: Monitor,
    title: "Advanced Capabilities",
    description:
      "Real-time processing, predictive analytics, and machine learning.",
  },
  {
    Icon: Brain,
    title: "Smarter Decision-Making",
    description:
      "Helping businesses unlock insights and optimize efficiency.",
  },
  {
    Icon: Briefcase,
    title: "Industry Leader",
    description: "Driving AI-driven data analytics innovation.",
  },
];

const bottomCards: CardData[] = [
  {
    Icon: Lightbulb,
    title: "Future-Ready Solutions",
    description:
      "Empowering organizations to stay competitive in a data-driven world.",
  },
  {
    Icon: Shield,
    title: "Scalable & Secure",
    description:
      "Ensuring seamless AI integration with robust data protection.",
  },
];

function GlassCard({ Icon, title, description }: CardData) {
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
      {/* Specular highlight */}
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

export default function AnalyticsSlide() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={VIDEO_SRC} />

      <div className="relative z-10 flex flex-col w-full h-full">
        {/* Header */}
        <header
          className="flex items-center justify-between w-full"
          style={{ padding: "3% 5.2%" }}
        >
          <Logo />
          <span
            style={{
              fontSize: "clamp(12px, 1.05vw, 20px)",
              opacity: 0.8,
            }}
          >
            Pitch Deck
          </span>
          <span
            style={{
              fontSize: "clamp(12px, 1.05vw, 20px)",
              opacity: 0.8,
            }}
          >
            Page 002
          </span>
        </header>

        {/* Centered title section */}
        <div className="text-center" style={{ padding: "0 5.2%" }}>
          <p
            style={{
              fontSize: "clamp(14px, 1.2vw, 24px)",
              opacity: 0.9,
            }}
          >
            Transforming Data into Intelligence with
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: "0.3%",
            }}
          >
            AI-Powered Analytics
          </h1>
        </div>

        {/* Card grid */}
        <div
          className="flex flex-col flex-1"
          style={{ padding: "2% 5.2% 3%", gap: "clamp(10px, 1.3vw, 25px)" }}
        >
          {/* Top row – 3 cards */}
          <div
            className="flex flex-1"
            style={{ gap: "clamp(10px, 1.4vw, 27px)" }}
          >
            {topCards.map((card) => (
              <GlassCard key={card.title} {...card} />
            ))}
          </div>

          {/* Bottom row – 2 cards */}
          <div
            className="flex flex-1"
            style={{ gap: "clamp(10px, 1.3vw, 25px)" }}
          >
            {bottomCards.map((card) => (
              <GlassCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
