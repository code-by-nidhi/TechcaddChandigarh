/** Words an average technical reader gets through in a minute. */
const WORDS_PER_MINUTE = 220

/**
 * Reading time in whole minutes, never less than one.
 *
 * Derived on save rather than typed by an editor: a number entered by hand
 * describes the article as it was when someone last thought about it, and a
 * "4 min read" on a piece that has since doubled in length is worse than no
 * estimate at all.
 *
 * Tags are stripped first so markup does not inflate the count — an article
 * heavy with code blocks would otherwise read as twice its real length.
 */
export function readingTimeOf(body: string): number {
  const words = body
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
