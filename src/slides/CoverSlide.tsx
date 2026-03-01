import VideoBackground from "../components/VideoBackground";
import Logo from "../components/Logo";

const VIDEO_SRC =
  "https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8";

export default function CoverSlide() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={VIDEO_SRC} />

      {/* Content layer */}
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
        </header>

        {/* Center content */}
        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{ marginTop: "-3%" }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 96px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            AI-Powered Data Analytics
          </h1>
          <p
            style={{
              fontSize: "clamp(20px, 2.5vw, 48px)",
              opacity: 0.9,
              marginTop: "1.5%",
              textAlign: "center",
            }}
          >
            Unlocking Business Potential
          </p>
          <p
            style={{
              fontSize: "clamp(14px, 1.2vw, 24px)",
              opacity: 0.75,
              marginTop: "2%",
              textAlign: "center",
            }}
          >
            By John Doe
          </p>
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-center w-full"
          style={{ padding: "2% 5.2%" }}
        >
          <span
            style={{
              fontSize: "clamp(12px, 1.05vw, 20px)",
              opacity: 0.6,
            }}
          >
            2024
          </span>
        </footer>
      </div>
    </div>
  );
}
