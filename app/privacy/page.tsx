import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal information you share through this website and our enquiry forms.`,
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="1 September 2026"
      intro={`This policy explains what information ${site.name} collects when you use this website or contact us, why we collect it, and what we do with it.`}
      sections={[
        {
          heading: "Information we collect",
          paragraphs: [
            "We collect only what we need to respond to you and to run our courses. That falls into two categories: information you give us directly, and technical information collected automatically when you browse the site.",
          ],
          bullets: [
            "Information you provide: name, mobile number, email address, course of interest, preferred centre and anything you write in an enquiry message.",
            "Enrolment information, if you join a course: educational background, identification documents where required for certification, and payment records.",
            "Technical information: IP address, browser type, pages visited and referring source, collected through analytics.",
          ],
        },
        {
          heading: "How we use it",
          bullets: [
            "To respond to your enquiry and arrange a counselling session or demo class.",
            "To administer your course, issue certificates and maintain attendance records.",
            "To share relevant course, batch and placement information with you.",
            "To improve the website and understand which pages are useful.",
          ],
          paragraphs: [
            "We do not use your information for automated decision-making, and we do not profile you beyond understanding which course you enquired about.",
          ],
        },
        {
          heading: "Sharing your information",
          paragraphs: [
            "We do not sell your personal information, and we do not share your contact details with third-party marketers.",
            "We share information only in these circumstances: with hiring partners during placement, and only with your consent and for a specific opportunity; with service providers who host our website, send our email or process payments, under agreements that restrict their use of it; and where we are required to by law.",
          ],
        },
        {
          heading: "Cookies and analytics",
          paragraphs: [
            "We use cookies for essential site function and for analytics that tell us which pages are visited. Our cookie policy sets out what is used and how to control it in your browser.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Enquiry records are kept for up to two years so that we can pick up a conversation where it left off. Student records — enrolment, attendance, assessment and certification — are kept for seven years, because certificate verification requests arrive long after a course ends.",
          ],
        },
        {
          heading: "Your rights",
          bullets: [
            "Ask for a copy of the personal information we hold about you.",
            "Ask us to correct anything that is inaccurate.",
            "Ask us to delete your information, where we are not required to keep it.",
            "Withdraw consent for marketing messages at any time.",
          ],
          paragraphs: [
            `To exercise any of these, write to ${site.contact.email}. We will respond within thirty days.`,
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "We use technical and organisational measures appropriate to the sensitivity of the information we hold, including access controls on student records and encrypted transmission of data submitted through this site. No system is perfectly secure, and we will tell you promptly if a breach affects your information.",
          ],
        },
        {
          heading: "Children",
          paragraphs: [
            "Our courses are open to students aged 16 and above. Where a student is under 18, we ask that a parent or guardian is involved in the enrolment and provides consent for us to hold their information.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "If we change this policy materially we will update the date at the top of this page and, where the change affects how we use information you have already given us, contact you directly.",
          ],
        },
      ]}
    />
  );
}
