import { TechMark, type TechName } from "@/components/TechMark";
import { cx } from "@/components/ui";

/**
 * An app-store style tile for one tool: its brand colour, and either a drawn
 * mark from {@link TechMark} or a short lettermark.
 *
 * Only a handful of tools have a hand-drawn mark, so everything else falls back
 * to initials on the brand colour — which is what makes the folder read as a
 * shelf of real software rather than a row of generic glyphs.
 *
 * The tool name is not set as `title` here: the stage draws its own hover label,
 * and a native tooltip would surface a second copy a moment later.
 */
interface Tile {
  /** Brand colour. The tile gradient is mixed from this single value. */
  bg: string;
  /** Drawn mark, when one exists for this tool. */
  mark?: TechName;
  /** Lettermark used when there is no drawn mark. */
  text?: string;
  /** Set on pale brands, where white would not survive the contrast check. */
  dark?: boolean;
}

const TILES: Record<string, Tile> = {
  /* Programming */
  Python: { bg: "#3776ab", mark: "python" },
  JavaScript: { bg: "#f7df1e", mark: "javascript", dark: true },
  TypeScript: { bg: "#3178c6", mark: "typescript" },
  Java: { bg: "#e12b2b", mark: "java" },
  C: { bg: "#5c6bc0", text: "C" },
  "C++": { bg: "#00599c", text: "C++" },
  Kotlin: { bg: "#7f52ff", text: "Kt" },
  PHP: { bg: "#777bb4", text: "php" },
  SQL: { bg: "#00758f", mark: "sql" },
  Dart: { bg: "#0175c2", text: "Dt" },

  /* Frameworks */
  React: { bg: "#0ea5c4", mark: "react" },
  "Next.js": { bg: "#1e293b", text: "N" },
  "Node.js": { bg: "#5fa04e", mark: "node" },
  Express: { bg: "#475569", text: "Ex" },
  Angular: { bg: "#dd0031", text: "A" },
  Django: { bg: "#0c4b33", text: "dj" },
  Laravel: { bg: "#ff2d20", text: "La" },
  "Spring Boot": { bg: "#6db33f", text: "Sp" },
  Flutter: { bg: "#0468d7", text: "Fl" },
  "Tailwind CSS": { bg: "#06b6d4", text: "tw" },

  /* AI & ML */
  TensorFlow: { bg: "#ff6f00", text: "TF" },
  PyTorch: { bg: "#ee4c2c", text: "Py" },
  Keras: { bg: "#d00000", text: "K" },
  "scikit-learn": { bg: "#f7931e", text: "sk" },
  "Hugging Face": { bg: "#ffd21e", text: "HF", dark: true },
  LangChain: { bg: "#1c3c3c", text: "LC" },
  LangGraph: { bg: "#2f6f4e", text: "LG" },
  OpenAI: { bg: "#10a37f", mark: "ai" },
  Anthropic: { bg: "#d97757", text: "A" },
  OpenCV: { bg: "#5c3ee8", text: "CV" },
  Pandas: { bg: "#2d0f5e", text: "pd" },
  NumPy: { bg: "#4d77cf", text: "np" },
  Jupyter: { bg: "#f37626", text: "Jp" },
  Streamlit: { bg: "#ff4b4b", text: "St" },

  /* Databases */
  MySQL: { bg: "#00758f", mark: "sql" },
  PostgreSQL: { bg: "#336791", text: "Pg" },
  MongoDB: { bg: "#47a248", text: "Mo" },
  Redis: { bg: "#dc382d", text: "Rd" },
  SQLite: { bg: "#0b4f6c", mark: "sql" },
  Pinecone: { bg: "#3730e0", text: "Pc" },
  pgvector: { bg: "#4b8bbe", text: "pgv" },

  /* DevOps */
  Git: { bg: "#f05032", mark: "git" },
  "GitHub Actions": { bg: "#2088ff", text: "GA" },
  Docker: { bg: "#2496ed", mark: "docker" },
  Kubernetes: { bg: "#326ce5", mark: "kubernetes" },
  Jenkins: { bg: "#d24939", text: "Jk" },
  Terraform: { bg: "#7b42bc", text: "Tf" },
  Ansible: { bg: "#1f2937", text: "An" },
  Prometheus: { bg: "#e6522c", text: "Pr" },
  Grafana: { bg: "#f46800", text: "Gf" },
  Nginx: { bg: "#009639", text: "Nx" },

  /* Cloud */
  AWS: { bg: "#ec7211", mark: "aws" },
  Azure: { bg: "#0078d4", mark: "cloud" },
  "Google Cloud": { bg: "#4285f4", mark: "cloud" },
  Vercel: { bg: "#111827", text: "V" },
  Firebase: { bg: "#ffca28", text: "Fb", dark: true },
  Cloudflare: { bg: "#f38020", mark: "cloud" },

  /* Security */
  "Kali Linux": { bg: "#367bf0", text: "Kali" },
  "Burp Suite": { bg: "#ff6633", text: "Bp" },
  Wireshark: { bg: "#1679a7", text: "Ws" },
  Metasploit: { bg: "#334155", text: "Ms" },
  Nmap: { bg: "#4c1d95", text: "Nm" },
  Splunk: { bg: "#e0447c", text: "Sp" },

  /* CAD & Design */
  AutoCAD: { bg: "#e51050", text: "AC" },
  SolidWorks: { bg: "#d6002a", text: "SW" },
  Revit: { bg: "#0696d7", text: "Rv" },
  "3ds Max": { bg: "#00a4e4", text: "3ds" },
  Figma: { bg: "#f24e1e", mark: "figma" },
  Photoshop: { bg: "#0b3d63", text: "Ps" },
  Illustrator: { bg: "#7a3b00", text: "Ai" },
  CorelDRAW: { bg: "#5aa02c", text: "CD" },

  /* Marketing & Analytics */
  "Google Ads": { bg: "#4285f4", text: "Ads" },
  "Meta Ads": { bg: "#0866ff", text: "M" },
  GA4: { bg: "#e37400", text: "GA4" },
  "Search Console": { bg: "#458cf5", text: "SC" },
  Semrush: { bg: "#ff642d", text: "Sm" },
  "Power BI": { bg: "#f2c811", text: "BI", dark: true },
  Tableau: { bg: "#e97627", text: "Tb" },
  HubSpot: { bg: "#ff7a59", text: "Hs" },
};

/** Palette the fallback cycles through, so an unregistered tool still fits in. */
const FALLBACK_BG = ["#3b82f6", "#8b5cf6", "#0ea5e9", "#14b8a6", "#f97316", "#e11d48"];

/** Initials for a tool with no entry above — "Spring Boot" → "SB", "Redis" → "Re". */
function fallbackTile(name: string): Tile {
  const words = name.split(/[\s.-]+/).filter(Boolean);
  const text =
    words.length > 1
      ? words
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase()
      : name.slice(0, 2);
  const hash = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return { bg: FALLBACK_BG[hash % FALLBACK_BG.length], text };
}

/** Lettermarks get smaller as they get longer, so three characters still fit. */
const fontScale = (text: string) => (text.length > 2 ? 0.26 : text.length > 1 ? 0.34 : 0.44);

/**
 * `size` is a share of the stage width, in container-query units, so a tile
 * scales with the stage instead of being pinned to a pixel size.
 */
export function TechTile({
  name,
  size,
  className,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  const tile = TILES[name] ?? fallbackTile(name);
  const text = tile.text ?? fallbackTile(name).text ?? "?";

  return (
    <span
      style={{
        width: `${size}cqw`,
        height: `${size}cqw`,
        borderRadius: `${size * 0.27}cqw`,
        background: `linear-gradient(155deg, color-mix(in oklab, ${tile.bg} 68%, white), ${tile.bg})`,
        boxShadow: "0 10px 20px -8px rgb(15 23 42 / 0.45)",
      }}
      className={cx(
        "flex items-center justify-center ring-1 ring-white/50",
        tile.dark ? "text-slate-900" : "text-white",
        className,
      )}
    >
      {tile.mark ? (
        <svg viewBox="0 0 24 24" className="w-[56%]" aria-hidden="true">
          <TechMark name={tile.mark} />
        </svg>
      ) : (
        <span
          style={{ fontSize: `${size * fontScale(text)}cqw` }}
          className="font-display leading-none font-bold tracking-tight"
        >
          {text}
        </span>
      )}
    </span>
  );
}
