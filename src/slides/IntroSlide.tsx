import VideoBackground from "../components/VideoBackground";
import Logo from "../components/Logo";

const VIDEO_SRC =
  "https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8";

export default function IntroSlide() {
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
          <span
            style={{
              fontSize: "clamp(12px, 1.05vw, 20px)",
              opacity: 0.8,
            }}
          >
            Page 001
          </span>
        </header>

        {/* Title */}
        <div style={{ padding: "0 5.2%" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            The Rise of AI
            <br />
            in Data Analytics
          </h1>
        </div>

        {/* Three-column layout */}
        <div
          className="flex"
          style={{
            marginTop: "3.5%",
            padding: "0 5.2%",
            gap: "4%",
            flex: 1,
          }}
        >
          {/* Column 1 */}
          <div style={{ flex: "0 0 22%" }}>
            <p
              style={{
                fontSize: "clamp(13px, 1.05vw, 20px)",
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              The AI analytics market is witnessing unprecedented growth,
              projected to expand from $150 billion to $300 billion by 2027,
              driven by increasing demand for data-driven decision-making
              across industries.
            </p>
            <div className="flex items-end gap-[8px]" style={{ marginTop: "6%" }}>
              <span
                style={{
                  fontSize: "clamp(28px, 3.5vw, 64px)",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                $300
              </span>
              <span
                style={{
                  fontSize: "clamp(13px, 1.05vw, 20px)",
                  opacity: 0.8,
                  paddingBottom: "0.4em",
                }}
              >
                2027
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ flex: "0 0 38%" }}>
            <p
              style={{
                fontSize: "clamp(13px, 1.05vw, 20px)",
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              Businesses of all sizes are rapidly adopting AI-driven analysis
              to gain a competitive edge. From automating routine data
              processing to uncovering deep insights hidden in massive
              datasets, artificial intelligence is transforming how
              organizations approach everything from customer behavior
              analysis to supply chain optimization. The fusion of machine
              learning algorithms with traditional analytics frameworks is
              creating unprecedented opportunities for innovation, enabling
              companies to predict market trends with remarkable accuracy and
              make data-informed decisions at the speed of business.
            </p>
          </div>

          {/* Column 3 */}
          <div
            className="flex flex-col"
            style={{ flex: "0 0 20%" }}
          >
            <span
              style={{
                fontSize: "clamp(28px, 3.5vw, 64px)",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              25–40%
            </span>
            <p
              style={{
                fontSize: "clamp(13px, 1.05vw, 20px)",
                opacity: 0.9,
                lineHeight: 1.5,
                marginTop: "4%",
              }}
            >
              Average efficiency improvement reported by organizations that
              have integrated AI-powered analytics into their core operations.
            </p>

            {/* Mini SVG line graph */}
            <svg
              viewBox="0 0 200 80"
              className="w-full mt-auto"
              style={{ maxHeight: "80px" }}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="graphFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#D2FF55" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#D2FF55" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d="M10 60 Q50 55 80 40 Q120 20 150 30 Q170 35 190 15 L190 75 L10 75 Z"
                fill="url(#graphFill)"
              />
              {/* Line */}
              <path
                d="M10 60 Q50 55 80 40 Q120 20 150 30 Q170 35 190 15"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              {/* Start dot */}
              <circle
                cx="10"
                cy="60"
                r="4"
                fill="#B750B2"
                stroke="white"
                strokeWidth="1.5"
              />
              {/* End dot */}
              <circle
                cx="190"
                cy="15"
                r="4"
                fill="#B750B2"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-end w-full"
          style={{ padding: "2% 5.2%" }}
        >
          <span
            style={{
              fontSize: "clamp(12px, 1.05vw, 20px)",
              opacity: 0.6,
            }}
          >
            The Rise of AI
          </span>
        </footer>
      </div>
    </div>
  );
}
