import Link from "next/link";
import { Icon, Rail } from "@/components/ui";
import { CountUp } from "@/components/motion/Reveal";
import { site } from "@/data/site";

export function TrainingHighlights() {
  return (
    <section className="bg-subtle py-16 lg:py-20">
      <Rail>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="rounded-3xl bg-hero-950 p-7 text-white lg:p-8">
            <p className="text-xs font-semibold tracking-widest text-brand-200/70 uppercase">
              Excellence, measured.
            </p>
            <h3 className="mt-3 font-display text-xl leading-snug font-bold tracking-tight text-balance">
              Discover how our training builds industry-ready tech professionals.
            </h3>
            <div className="mt-7 flex gap-10 border-t border-white/10 pt-6">
              <div>
                <p className="text-xs text-white/50">Placement Success</p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                  <CountUp value={site.stats.placement} />
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50">Students Trained</p>
                <p className="mt-1 font-display text-3xl font-bold tracking-tight">
                  <CountUp value={site.stats.alumni} />
                </p>
              </div>
            </div>
          </div>

          <Link
            href={site.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-violet-500 to-accent-400 p-7 text-white lg:p-8"
          >
            <span className="grid size-11 place-items-center rounded-full bg-hero-950/70 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Icon name="play" className="ml-0.5 size-4.5" />
            </span>
            <p className="relative font-display text-sm leading-relaxed font-semibold text-balance">
              Breaking down full-stack coding, AI reasoning and digital marketing.
            </p>
          </Link>

          <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-emerald-300 to-cyan-400 p-7 text-hero-950 lg:p-8">
            <h3 className="font-display text-xl leading-snug font-bold tracking-tight text-balance">
              Next-gen performance across learning, logic and practical skills.
            </h3>
            <div className="mt-7 flex gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl bg-hero-950 text-white">
                <Icon name="sparkles" className="size-4.5" />
              </span>
              <span className="grid size-10 place-items-center rounded-xl bg-hero-950 text-white">
                <Icon name="layers" className="size-4.5" />
              </span>
            </div>
          </div>
        </div>
      </Rail>
    </section>
  );
}
