import { TechTile } from "@/components/TechTile";
import { cx } from "@/components/ui";

/**
 * Real vendor logos for the technology tiles.
 *
 * Two sources, because neither covers everything on its own:
 *
 * - `DEVICON` — full-colour original marks, served as plain `<img>`. These are
 *   the artwork as the vendor draws it, multi-colour and all.
 * - `SIMPLE` — official single-colour marks. Simple Icons ships them as black
 *   paths, so each is painted through a CSS mask with the brand's own hex.
 *
 * Anything in neither list falls back to {@link TechTile}, which draws a
 * lettermark on the brand colour. Every slug below was checked against the CDN
 * before being added, and only exact matches are mapped — a parent company's
 * mark standing in for a product (Autodesk for AutoCAD, Maya for 3ds Max) is
 * worse than a lettermark, so those deliberately fall through.
 */
const DEVICON: Record<string, string> = {
  Python: "python/python-original",
  JavaScript: "javascript/javascript-original",
  TypeScript: "typescript/typescript-original",
  Java: "java/java-original",
  C: "c/c-original",
  "C++": "cplusplus/cplusplus-original",
  Kotlin: "kotlin/kotlin-original",
  PHP: "php/php-original",
  Dart: "dart/dart-original",
  React: "react/react-original",
  "Next.js": "nextjs/nextjs-original",
  "Node.js": "nodejs/nodejs-original",
  Express: "express/express-original",
  Angular: "angular/angular-original",
  Django: "django/django-plain",
  Laravel: "laravel/laravel-original",
  "Spring Boot": "spring/spring-original",
  Flutter: "flutter/flutter-original",
  "Tailwind CSS": "tailwindcss/tailwindcss-original",
  TensorFlow: "tensorflow/tensorflow-original",
  PyTorch: "pytorch/pytorch-original",
  Keras: "keras/keras-original",
  "scikit-learn": "scikitlearn/scikitlearn-original",
  OpenCV: "opencv/opencv-original",
  Pandas: "pandas/pandas-original",
  NumPy: "numpy/numpy-original",
  Jupyter: "jupyter/jupyter-original",
  Streamlit: "streamlit/streamlit-original",
  "Kali Linux": "kalilinux/kalilinux-original",
  MySQL: "mysql/mysql-original",
  PostgreSQL: "postgresql/postgresql-original",
  MongoDB: "mongodb/mongodb-original",
  Redis: "redis/redis-original",
  SQLite: "sqlite/sqlite-original",
  Git: "git/git-original",
  "GitHub Actions": "githubactions/githubactions-original",
  Docker: "docker/docker-original",
  Kubernetes: "kubernetes/kubernetes-original",
  Jenkins: "jenkins/jenkins-original",
  Terraform: "terraform/terraform-original",
  Ansible: "ansible/ansible-original",
  Prometheus: "prometheus/prometheus-original",
  Grafana: "grafana/grafana-original",
  Nginx: "nginx/nginx-original",
  AWS: "amazonwebservices/amazonwebservices-original-wordmark",
  Azure: "azure/azure-original",
  "Google Cloud": "googlecloud/googlecloud-original",
  Vercel: "vercel/vercel-original",
  Firebase: "firebase/firebase-plain",
  Cloudflare: "cloudflare/cloudflare-original",
  Figma: "figma/figma-original",
  Photoshop: "photoshop/photoshop-original",
  Illustrator: "illustrator/illustrator-plain",
  Tableau: "tableau/tableau-original",
};

const SIMPLE: Record<string, { slug: string; color: string }> = {
  "Hugging Face": { slug: "huggingface", color: "#FFD21E" },
  LangChain: { slug: "langchain", color: "#1C3C3C" },
  OpenAI: { slug: "openai", color: "#412991" },
  Anthropic: { slug: "anthropic", color: "#D97757" },
  "Burp Suite": { slug: "burpsuite", color: "#FF6633" },
  Wireshark: { slug: "wireshark", color: "#1679A7" },
  Metasploit: { slug: "metasploit", color: "#2596CD" },
  Splunk: { slug: "splunk", color: "#FF375F" },
  CorelDRAW: { slug: "coreldraw", color: "#7AC143" },
  Revit: { slug: "autodeskrevit", color: "#186BFF" },
  "Google Ads": { slug: "googleads", color: "#4285F4" },
  "Meta Ads": { slug: "meta", color: "#0467DF" },
  GA4: { slug: "googleanalytics", color: "#E37400" },
  "Search Console": { slug: "googlesearchconsole", color: "#458CF5" },
  Semrush: { slug: "semrush", color: "#FF642D" },
  HubSpot: { slug: "hubspot", color: "#FF7A59" },
};

const DEVICON_CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
const SIMPLE_CDN = "https://cdn.jsdelivr.net/npm/simple-icons@13/icons";

/** One technology mark, at whatever size the parent gives it. */
export function TechLogo({ name, className }: { name: string; className?: string }) {
  const devicon = DEVICON[name];
  const simple = SIMPLE[name];

  // No real mark for this one — the lettermark tile fills its own box.
  if (!devicon && !simple) {
    return (
      <span style={{ containerType: "inline-size" }} className={cx("block", className)}>
        <TechTile name={name} size={100} />
      </span>
    );
  }

  return (
    <span
      className={cx(
        "grid place-items-center rounded-2xl bg-white p-2 ring-1 ring-black/5 shadow-[0_8px_18px_-8px_rgba(18,63,102,0.45)]",
        className,
      )}
    >
      {devicon ? (
        /* eslint-disable-next-line @next/next/no-img-element -- remote SVG; next/image
           would need a remotePatterns entry and gives nothing back for vector art. */
        <img
          src={`${DEVICON_CDN}/${devicon}.svg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
        />
      ) : (
        // Simple Icons ships black paths, so the glyph is used as a mask and
        // the brand colour is painted behind it.
        <span
          aria-hidden="true"
          className="block size-full"
          style={{
            backgroundColor: simple!.color,
            maskImage: `url(${SIMPLE_CDN}/${simple!.slug}.svg)`,
            WebkitMaskImage: `url(${SIMPLE_CDN}/${simple!.slug}.svg)`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          }}
        />
      )}
    </span>
  );
}
