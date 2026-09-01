import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `When fees are refundable at ${site.name}, how much, and how to request a refund.`,
  alternates: { canonical: `${site.url}/refund-policy` },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="1 September 2026"
      intro="When fees are refundable, how much, and how to ask. Written plainly so there is nothing to discover later."
      sections={[
        {
          heading: "Before your batch starts",
          paragraphs: [
            "If you withdraw before your batch begins, fees paid are refunded in full. There is no registration fee, so there is nothing non-refundable at this stage.",
          ],
        },
        {
          heading: "In the first week",
          paragraphs: [
            "If you withdraw within seven calendar days of your batch starting, we refund the fees paid less a charge for the sessions delivered, calculated pro rata. Study material already issued is charged at cost.",
            "This is the window in which most withdrawals happen, usually because a student realises the level is wrong. We would rather move you to a more suitable course than process a refund — ask us before withdrawing.",
          ],
        },
        {
          heading: "After the first week",
          paragraphs: [
            "Beyond seven days, fees are generally non-refundable, because the seat has been held and the trainer scheduled for the full batch. We consider individual exceptions in genuine hardship — medical, relocation, family circumstances — on written request with supporting documentation.",
          ],
        },
        {
          heading: "If we cancel or reschedule",
          bullets: [
            "If we cancel a batch before it starts, you receive a full refund or a seat in the next batch, whichever you prefer.",
            "If we cannot deliver a course we have started, we refund the fees for the undelivered portion in full.",
            "A change of trainer is not grounds for a refund, provided the syllabus and delivery standard are maintained.",
          ],
        },
        {
          heading: "Transfers instead of refunds",
          paragraphs: [
            "You can transfer to a different course, a different duration or a later batch once, at no charge, at any point in the first four weeks. Where the new course costs more, the difference is payable; where it costs less, the difference is credited.",
            "You can also pause your enrolment for a documented reason and rejoin a later batch within twelve months, with your seat held at no additional cost.",
          ],
        },
        {
          heading: "Instalments and EMI",
          paragraphs: [
            "If you are paying in instalments and withdraw, the refund is calculated against the total fee due for the sessions delivered, not against the amount paid so far. Where that produces a balance owing, it remains payable.",
            "EMI arrangements made with a third-party financier are governed by that financier's terms, which you should read separately.",
          ],
        },
        {
          heading: "External exam fees",
          paragraphs: [
            "Charges for external certification exams — AWS, Azure, CEH and similar — are paid to the certifying body and are governed by their refund rules, not ours.",
          ],
        },
        {
          heading: "How to request a refund",
          paragraphs: [
            `Email ${site.contact.email} with your name, batch, course and the reason for withdrawing, or hand a written request in at reception. We acknowledge requests within two working days and complete approved refunds within fifteen working days to the account fees were paid from.`,
          ],
        },
      ]}
    />
  );
}
