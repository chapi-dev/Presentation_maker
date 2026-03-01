import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Presentation as PresentationIcon,
  Sparkles,
  LogOut,
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Generando presentación...");
  const [error, setError] = useState("");

  // Detect Microsoft/Azure topics for loading indicator
  const MS_KEYWORDS = [
    "azure", "microsoft", "dotnet", ".net", "c#", "visual studio", "vscode",
    "power bi", "power automate", "sharepoint", "teams", "dynamics", "cosmos",
    "entra", "defender", "sentinel", "synapse", "fabric", "copilot", "bicep",
    "app service", "container apps", "aks", "functions", "devops", "blazor",
    "graph api", "maui", "signalr", "asp.net", "openai",
  ];

  const isMsTopic = (t: string) => {
    const lower = t.toLowerCase();
    return MS_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Escribe un tema para la presentación.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingMsg(
      isMsTopic(topic.trim())
        ? "Investigando Microsoft Learn..."
        : "Generando presentación..."
    );

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${apiBase}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), numSlides }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      const data = await res.json();
      // Store slides in sessionStorage and navigate to presentation
      sessionStorage.setItem("generatedSlides", JSON.stringify(data.slides));
      navigate("/present");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error generando las slides.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between w-full"
        style={{ padding: "2% 5%" }}
      >
        <div className="flex items-center gap-3">
          <PresentationIcon size={28} style={{ opacity: 0.9 }} />
          <span
            style={{
              fontSize: "clamp(16px, 1.3vw, 24px)",
              fontWeight: 700,
            }}
          >
            Presentation Maker
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span
              style={{
                fontSize: "clamp(12px, 0.9vw, 16px)",
                opacity: 0.7,
              }}
            >
              {user?.name || user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg cursor-pointer border-none"
              style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ marginTop: "-4%" }}>
        <Sparkles size={48} style={{ opacity: 0.6, marginBottom: "2%" }} />

        <h1
          style={{
            fontSize: "clamp(28px, 3.5vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Crea tu presentación
          <br />
          <span style={{ opacity: 0.6 }}>con inteligencia artificial</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(13px, 1.05vw, 20px)",
            opacity: 0.5,
            marginTop: "1.5%",
            textAlign: "center",
          }}
        >
          Escribe un tema, elige el número de slides, y la AI se encarga del resto.
        </p>

        {/* Form */}
        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: "min(560px, 90%)",
            marginTop: "3%",
            gap: "clamp(12px, 1vw, 20px)",
          }}
        >
          {/* Topic input */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: "clamp(12px, 0.85vw, 15px)",
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              Tema de la presentación
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: El futuro de la inteligencia artificial en la medicina"
              onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
              className="w-full rounded-xl outline-none"
              style={{
                padding: "clamp(12px, 1vw, 18px) clamp(16px, 1.2vw, 24px)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
                fontSize: "clamp(14px, 1.05vw, 18px)",
                fontFamily: "inherit",
                backdropFilter: "blur(24px) saturate(1.4)",
                transition: "border-color 200ms",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            />
          </div>

          {/* Number of slides */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: "clamp(12px, 0.85vw, 15px)",
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              Número de slides: {numSlides}
            </label>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "12px", opacity: 0.4 }}>2</span>
              <input
                type="range"
                min={2}
                max={15}
                value={numSlides}
                onChange={(e) => setNumSlides(Number(e.target.value))}
                className="flex-1"
                style={{
                  accentColor: "white",
                  height: "4px",
                }}
              />
              <span style={{ fontSize: "12px", opacity: 0.4 }}>15</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#ff6b6b", fontSize: "clamp(12px, 0.9vw, 15px)" }}>
              {error}
            </p>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-xl cursor-pointer border-none"
            style={{
              padding: "clamp(14px, 1.1vw, 20px)",
              background: loading
                ? "rgba(255,255,255,0.04)"
                : "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: "clamp(14px, 1.05vw, 18px)",
              fontWeight: 600,
              fontFamily: "inherit",
              backdropFilter: "blur(24px) saturate(1.4)",
              transition: "all 200ms",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.1))";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))";
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {loadingMsg}
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generar Presentación
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="flex items-center justify-center w-full"
        style={{ padding: "1.5% 5%" }}
      >
        <span style={{ fontSize: "11px", opacity: 0.3 }}>
          Powered by Azure OpenAI · Microsoft Learn · React
        </span>
      </footer>
    </div>
  );
}
