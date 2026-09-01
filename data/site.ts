/**
 * Central site configuration.
 *
 * NOTE: address / phone / social handles below are placeholders for the
 * Chandigarh centre — swap them for the real details before going live.
 */
export const site = {
  name: "techcadd Chandigarh",
  shortName: "techcadd",
  tagline: "Your Skill & Technology Partner",
  city: "Chandigarh",
  citySlug: "chandigarh",
  state: "Punjab",
  url: "https://techcaddchandigarh.com",
  description:
    "Learn with techcadd Chandigarh, an industry-focused IT training centre. Explore 50+ AI and software courses with hands-on labs, live project execution, mentor code reviews, internship experience and placement assistance across top job roles.",
  founded: 2007,
  /** Taken from the techcadd Jalandhar site — confirm for the Chandigarh entity. */
  founder: {
    name: "Mr. Gourav Gupta",
    title: "Founder & CEO, techcadd",
  },
  contact: {
    phone: "+91 98881 22254",
    phoneHref: "tel:+919888122254",
    whatsapp: "https://wa.me/919888122254",
    email: "info@techcadd.com",
    hours: "Mon – Sat, 9 AM – 7 PM",
  },
  address: {
    line1: "SCO 118-120, 2nd Floor, Sector 34-A",
    line2: "Near Sector 34 Market",
    city: "Chandigarh",
    postalCode: "160022",
    country: "IN",
    mapUrl: "https://maps.google.com/?q=Sector+34A+Chandigarh",
  },
  social: {
    instagram: "https://instagram.com/techcadd",
    youtube: "https://youtube.com/@techcadd",
    linkedin: "https://linkedin.com/company/techcadd",
    facebook: "https://facebook.com/techcadd",
  },
  stats: {
    rating: "4.9",
    reviews: "556+",
    alumni: "15K+",
    partners: "500+",
    technologies: "100+",
    placement: "92%",
  },
} as const;

export type Site = typeof site;
