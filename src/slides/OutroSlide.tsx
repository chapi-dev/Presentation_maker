import VideoBackground from "../components/VideoBackground";
import Logo from "../components/Logo";
import { Phone, Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";

const VIDEO_SRC =
  "https://stream.mux.com/00qQnfNo7sSpn3pB1hYKkyeSDvxs01NxiQ3sr29uL3e028.m3u8";

/* Simple SVG icons for Instagram and Facebook */
function InstagramIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
    </svg>
  );
}

interface ContactItem {
  icon: ReactNode;
  text: string;
}

const iconSize = "clamp(24px, 1.6vw, 32px)";

const contacts: ContactItem[] = [
  {
    icon: <InstagramIcon size={iconSize} />,
    text: "Instagram.com/grapho",
  },
  {
    icon: <FacebookIcon size={iconSize} />,
    text: "Facebook.com/grapho",
  },
  {
    icon: (
      <Phone
        style={{ width: iconSize, height: iconSize }}
        strokeWidth={1.5}
        color="white"
      />
    ),
    text: "+1 (415) 987-6543",
  },
  {
    icon: (
      <Mail
        style={{ width: iconSize, height: iconSize }}
        strokeWidth={1.5}
        color="white"
      />
    ),
    text: "contact@optimalai.com",
  },
  {
    icon: (
      <MapPin
        style={{ width: iconSize, height: iconSize }}
        strokeWidth={1.5}
        color="white"
      />
    ),
    text: "Headquarters: San Francisco, CA, USA",
  },
];

export default function OutroSlide() {
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
            Page 020
          </span>
        </header>

        {/* Main content – vertically centered, left-aligned */}
        <div
          className="flex-1 flex flex-col justify-center"
          style={{ padding: "0 5.2%" }}
        >
          <h1
            style={{
              fontSize: "clamp(28px, 3.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Contact Information &
            <br />
            Final Call to Action
          </h1>

          <p
            style={{
              fontSize: "clamp(13px, 1.05vw, 20px)",
              opacity: 0.9,
              maxWidth: "38%",
              marginTop: "3%",
              lineHeight: 1.5,
            }}
          >
            Ready to transform your data into actionable intelligence? Reach
            out to our team and discover how AI-powered analytics can
            accelerate your business outcomes. We are here to help you take the
            next step.
          </p>

          {/* Contact items */}
          <div
            className="flex flex-col"
            style={{ gap: "clamp(12px, 1vw, 19px)", marginTop: "3%" }}
          >
            {contacts.map((item, i) => (
              <div key={i} className="flex items-center gap-[12px]">
                <span className="flex-shrink-0">{item.icon}</span>
                <span
                  style={{
                    fontSize: "clamp(13px, 1.05vw, 20px)",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
