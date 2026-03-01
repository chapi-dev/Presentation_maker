import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Presentation from "../components/Presentation";
import { renderSlides, type SlideData } from "../slides/DynamicSlideRenderer";
import { ArrowLeft } from "lucide-react";

function readSlidesFromSession(): SlideData[] | null {
  try {
    const raw = sessionStorage.getItem("generatedSlides");
    if (!raw) return null;
    return JSON.parse(raw) as SlideData[];
  } catch {
    return null;
  }
}

export default function PresentationPage() {
  const navigate = useNavigate();
  const slides = useMemo(() => readSlidesFromSession(), []);

  if (!slides) {
    // Redirect on next tick so we don't call navigate during render
    queueMicrotask(() => navigate("/"));
    return null;
  }

  const renderedSlides = renderSlides(slides);

  return (
    <div className="relative w-full h-full">
      {/* Back button (top-left, shows on hover) */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-[2%] left-[2%] z-[100] flex items-center gap-2 rounded-lg cursor-pointer border-none"
        style={{
          padding: "8px 16px",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.7)",
          fontSize: "12px",
          backdropFilter: "blur(12px)",
          transition: "all 200ms",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.95)";
          e.currentTarget.style.background = "rgba(0,0,0,0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          e.currentTarget.style.background = "rgba(0,0,0,0.5)";
        }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <Presentation slides={renderedSlides} />
    </div>
  );
}
