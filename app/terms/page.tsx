import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use this website and when you enrol on a course at ${site.name}.`,
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="1 September 2026"
      intro={`These terms apply when you use this website and when you enrol on a course with ${site.name}. Please read them before enrolling.`}
      sections={[
        {
          heading: "Using this website",
          paragraphs: [
            "The content on this site is provided for information. Course syllabi, durations, fees and batch timings are accurate at the time of publishing but may change — the position confirmed to you in writing at enrolment is the one that applies.",
            "You may not copy our course materials, syllabi or written content for commercial use without written permission.",
          ],
        },
        {
          heading: "Enrolment",
          bullets: [
            "A seat is confirmed only when the enrolment form is completed and the agreed first payment is received.",
            "There is no registration fee. Nothing is payable before you have attended a demo class if you choose to.",
            "Where a course has prerequisites, we may recommend a foundation module first. We will tell you before you pay, not after.",
          ],
        },
        {
          heading: "Fees and payment",
          paragraphs: [
            "Fees are quoted per course and per duration, and are confirmed in writing at enrolment. Where an instalment or EMI arrangement is agreed, the schedule forms part of your enrolment record.",
            "Fees do not include external certification exam charges, which are paid directly to the certifying body.",
          ],
        },
        {
          heading: "Attendance and conduct",
          bullets: [
            "Certificates are issued on the basis of attendance, assessment and project completion — not on payment alone.",
            "Lab equipment and network access are provided for coursework. Misuse, including any unauthorised access to systems outside our lab environment, results in immediate withdrawal without refund.",
            "Security and ethical hacking coursework is conducted only within our isolated lab range and only against targets we own. Applying those techniques elsewhere without written authorisation is illegal and outside the scope of your enrolment.",
          ],
        },
        {
          heading: "Batches and scheduling",
          paragraphs: [
            "We reserve the right to reschedule a batch start date if minimum enrolment is not met, and will offer you an alternative batch or a full refund of anything paid.",
            "Sessions missed by a student can be caught up through recordings or by attending the same module with another batch, subject to seat availability.",
          ],
        },
        {
          heading: "Placement support",
          paragraphs: [
            "Placement support — CV review, mock interviews, drives with hiring partners — is included in your fee. We do not guarantee employment, and no representation made verbally or in marketing should be understood as such a guarantee.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "Course materials, recordings and assessments remain our property and are licensed to you for personal study during and after your course. Redistribution or resale is not permitted.",
            "Work you produce on your own projects remains yours. Work produced on a live client project is governed by the agreement with that client, which we will explain before you join the project.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "Our liability in connection with a course is limited to the fees you have paid for it. We are not liable for indirect losses, including loss of earnings or opportunity.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            `These terms are governed by the laws of India, and the courts at ${site.address.city} have exclusive jurisdiction over any dispute arising from them.`,
          ],
        },
      ]}
    />
  );
}
