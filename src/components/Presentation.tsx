import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactElement,
} from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";

interface PresentationProps {
  slides: ReactElement[];
}

export default function Presentation({ slides }: PresentationProps) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = slides.length;

  /* ── Navigation ── */
  const next = useCallback(
    () => setCurrent((c) => Math.min(c + 1, total - 1)),
    [total]
  );
  const prev = useCallback(
    () => setCurrent((c) => Math.max(c - 1, 0)),
    []
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  /* ── Fullscreen change listener ── */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ── Keyboard controls ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prev();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, toggleFullscreen]);

  /* ── Auto-hide controls ── */
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    // Start the initial auto-hide timer without calling setState synchronously
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    window.addEventListener("mousemove", showControls);
    return () => {
      window.removeEventListener("mousemove", showControls);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  /* ── Render ── */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const offset = i - current;
        return (
          <div
            key={i}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: offset === 0 ? 1 : 0,
              transform:
                offset === 0
                  ? "scale(1)"
                  : offset < 0
                  ? "scale(0.95)"
                  : "scale(1.05)",
              transition: "opacity 500ms ease-in-out, transform 500ms ease-in-out",
              pointerEvents: offset === 0 ? "auto" : "none",
              zIndex: offset === 0 ? 1 : 0,
            }}
          >
            {slide}
          </div>
        );
      })}

      {/* Keyboard hint – top-right */}
      <div
        className="absolute top-[2%] right-[2%] z-50 pointer-events-none"
        style={{
          opacity: controlsVisible ? 1 : 0,
          transition: "opacity 300ms ease",
          fontSize: "11px",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        ← → Navigate · F Fullscreen
      </div>

      {/* Bottom navigation bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          opacity: controlsVisible ? 1 : 0,
          transition: "opacity 300ms ease",
          padding: "1.2% 2.5%",
        }}
      >
        {/* Left – slide counter */}
        <span
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            fontVariantNumeric: "tabular-nums",
            minWidth: "60px",
          }}
        >
          {current + 1} / {total}
        </span>

        {/* Center – progress dots */}
        <div className="flex items-center gap-[6px]">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300 border-none outline-none cursor-pointer"
              style={{
                width: i === current ? "24px" : "6px",
                height: "6px",
                backgroundColor:
                  i === current
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Right – nav buttons + fullscreen */}
        <div className="flex items-center gap-[8px]">
          <button
            onClick={prev}
            className="flex items-center justify-center rounded-md border-none outline-none cursor-pointer transition-all duration-200"
            style={{
              width: "32px",
              height: "32px",
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={next}
            className="flex items-center justify-center rounded-md border-none outline-none cursor-pointer transition-all duration-200"
            style={{
              width: "32px",
              height: "32px",
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "18px",
              background: "rgba(255,255,255,0.2)",
            }}
          />

          <button
            onClick={toggleFullscreen}
            className="flex items-center justify-center rounded-md border-none outline-none cursor-pointer transition-all duration-200"
            style={{
              width: "32px",
              height: "32px",
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
