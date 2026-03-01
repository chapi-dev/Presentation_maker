import VideoBackground from "../components/VideoBackground";

const VIDEO_SRC =
  "https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8";

export default function QuoteSlide() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <VideoBackground src={VIDEO_SRC} />

      {/* Content layer – centered */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div
          className="flex flex-col items-center text-center"
          style={{ maxWidth: "70%", gap: "12px" }}
        >
          <p
            style={{
              fontSize: "clamp(14px, 1.1vw, 20px)",
              opacity: 0.9,
            }}
          >
            Andrew Ng
          </p>
          <blockquote
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            &ldquo;Artificial Intelligence is the new electricity.&rdquo;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
