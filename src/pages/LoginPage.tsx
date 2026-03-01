import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { Presentation as PresentationIcon, LogIn } from "lucide-react";

export default function LoginPage() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(console.error);
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0a0a0a, #111, #0a0a0a)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <PresentationIcon size={56} style={{ opacity: 0.5, marginBottom: "2%" }} />

      <h1
        style={{
          fontSize: "clamp(28px, 3.5vw, 64px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Presentation Maker
      </h1>

      <p
        style={{
          fontSize: "clamp(13px, 1.05vw, 20px)",
          opacity: 0.5,
          marginTop: "1%",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        Genera presentaciones profesionales con AI.
        <br />
        Inicia sesión para comenzar.
      </p>

      <button
        onClick={handleLogin}
        className="flex items-center gap-3 rounded-xl cursor-pointer border-none"
        style={{
          marginTop: "3%",
          padding: "clamp(14px, 1.1vw, 20px) clamp(28px, 2.5vw, 48px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          fontSize: "clamp(14px, 1.05vw, 18px)",
          fontWeight: 600,
          fontFamily: "inherit",
          backdropFilter: "blur(24px) saturate(1.4)",
          transition: "all 200ms",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.1))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))";
        }}
      >
        <LogIn size={20} />
        Iniciar sesión con Microsoft
      </button>

      <span
        style={{
          fontSize: "11px",
          opacity: 0.25,
          marginTop: "6%",
        }}
      >
        Powered by Azure OpenAI · Microsoft Entra ID
      </span>
    </div>
  );
}
