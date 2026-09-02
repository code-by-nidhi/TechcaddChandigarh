import { Fragment, type CSSProperties } from "react";

export interface WordSegment {
  text: string;
  /** Applied to the words of this segment — lets one headline mix colours. */
  className?: string;
}

/**
 * Splits a headline into per-word spans so `[data-reveal-words]` can float them
 * in one after the other. Rendered on the server, so the words are in the HTML
 * for search engines and for anyone without JavaScript.
 *
 * Put `data-reveal-words` on the heading itself; this goes inside it.
 */
export function Words({
  segments,
  step = 55,
  delay = 0,
}: {
  segments: WordSegment[];
  /** Milliseconds between one word and the next. */
  step?: number;
  /** Milliseconds before the first word moves. */
  delay?: number;
}) {
  let index = 0;

  return (
    <>
      {segments.map((segment, s) => (
        <span key={s}>
          {segment.text.split(/\s+/).filter(Boolean).map((word) => {
            const style = { "--word-delay": `${delay + index++ * step}ms` } as CSSProperties;
            return (
              <Fragment key={`${word}-${index}`}>
                <span className="sh-clip">
                  <span className={`sh-word ${segment.className ?? ""}`} style={style}>
                    {word}
                  </span>
                </span>{" "}
              </Fragment>
            );
          })}
        </span>
      ))}
    </>
  );
}

/** Inline `--reveal-delay` for staggering a list of `[data-reveal]` items. */
export const revealDelay = (i: number, step = 80) =>
  ({ "--reveal-delay": `${i * step}ms` }) as CSSProperties;

/** Inline `--word-delay`, for headline words assembled by hand. */
export const wordDelay = (ms: number) => ({ "--word-delay": `${ms}ms` }) as CSSProperties;
