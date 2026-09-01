import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Which cookies ${site.name} uses on this website, what each one does, and how to control them.`,
  alternates: { canonical: `${site.url}/cookie-policy` },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="1 September 2026"
      intro="What this site stores in your browser, why, and how to turn it off."
      sections={[
        {
          heading: "What cookies are",
          paragraphs: [
            "Cookies are small text files a website stores in your browser. Some are needed for the site to work at all; others record how the site is used so we can improve it.",
          ],
        },
        {
          heading: "Essential cookies",
          paragraphs: [
            "These keep the site functioning — remembering your preferences within a session and protecting forms against abuse. They cannot be switched off without breaking the site, and they do not identify you personally.",
          ],
        },
        {
          heading: "Analytics cookies",
          paragraphs: [
            "We use analytics to see which pages are visited, how people arrive and where they leave. This is aggregate: it tells us that a course page is heavily read, not who read it.",
          ],
          bullets: [
            "Pages visited and time spent on each.",
            "Referring source — search, social or a direct link.",
            "Device type and approximate location at city level.",
          ],
        },
        {
          heading: "What we do not do",
          bullets: [
            "We do not sell data collected through cookies.",
            "We do not use cookies to build advertising profiles about you across other websites.",
            "We do not store your enquiry details in a cookie.",
          ],
        },
        {
          heading: "Controlling cookies",
          paragraphs: [
            "Every major browser lets you block or delete cookies in its settings, and offers a private browsing mode that discards them when you close the window. Blocking analytics cookies has no effect on your ability to use this site.",
            "If you would prefer we did not count your visits at all, browser-level tracking protection or an ad blocker will achieve that.",
          ],
        },
        {
          heading: "Third-party embeds",
          paragraphs: [
            "Where we embed content from another service — a map or a video, for example — that service may set its own cookies under its own policy. We keep such embeds to a minimum.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "If we add or remove a category of cookie, we will update this page and the date at the top of it.",
          ],
        },
      ]}
    />
  );
}
