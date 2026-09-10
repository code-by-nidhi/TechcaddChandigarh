import { site } from "./site";

/**
 * The tricity network, headed by the Chandigarh campus.
 *
 * Contact details other than the head campus are placeholders — replace them
 * with the live numbers and addresses for each centre before going live. The
 * head campus takes its number and map link from `site`, so there is one place
 * to change the main line rather than two that can disagree.
 */
export interface Branch {
  slug: string;
  name: string;
  isHead?: boolean;
  address: string;
  locality: string;
  phone: string;
  phoneHref: string;
  mapUrl: string;
  blurb: string;
  labs: string;
  highlights: string[];
}

export const branches: Branch[] = [
  {
    slug: "chandigarh",
    name: "Chandigarh",
    isHead: true,
    address: `${site.address.line1}, Chandigarh ${site.address.postalCode}`,
    locality: "Sector 34-A",
    phone: site.contact.phone,
    phoneHref: site.contact.phoneHref,
    mapUrl: site.address.mapUrl,
    blurb:
      "Our head campus, with the largest lab floor, the AI and cyber security ranges, and the placement team that runs drives for every centre.",
    labs: "6 labs · 140 seats",
    highlights: [
      "Dedicated AI and GPU lab",
      "Isolated cyber security range",
      "Placement cell on site",
      "Weekend and evening batches",
    ],
  },
  {
    slug: "mohali",
    name: "Mohali",
    address: "Phase 7, Industrial Area, Mohali, Punjab 160055",
    locality: "Phase 7",
    phone: "+91 98881 22261",
    phoneHref: "tel:+919888122261",
    mapUrl: "https://maps.google.com/?q=Phase+7+Industrial+Area+Mohali",
    blurb:
      "Next to the IT park, with a schedule weighted toward working professionals and a hiring pipeline into the companies on its doorstep.",
    labs: "3 labs · 65 seats",
    highlights: [
      "Evening batches for working professionals",
      "Full-stack, cloud and data tracks",
      "Placement drives with IT City employers",
      "Group enrolment discounts",
    ],
  },
  {
    slug: "panchkula",
    name: "Panchkula",
    address: "Sector 11, Panchkula, Haryana 134109",
    locality: "Sector 11",
    phone: "+91 98881 22262",
    phoneHref: "tel:+919888122262",
    mapUrl: "https://maps.google.com/?q=Sector+11+Panchkula",
    blurb:
      "Serving the Haryana side of the tricity, with batch timings built around college hours and campus tie-ups for industrial training.",
    labs: "2 labs · 50 seats",
    highlights: [
      "Campus tie-ups with nearby colleges",
      "Batch timings around college hours",
      "Industrial training specialists",
      "Student transport support",
    ],
  },
  {
    slug: "zirakpur",
    name: "Zirakpur",
    address: "VIP Road, Zirakpur, Punjab 140603",
    locality: "VIP Road",
    phone: "+91 98881 22263",
    phoneHref: "tel:+919888122263",
    mapUrl: "https://maps.google.com/?q=VIP+Road+Zirakpur",
    blurb:
      "On the Ambala highway for students commuting in from Dera Bassi and Baltana, running the same syllabus as the Sector 34 campus.",
    labs: "2 labs · 45 seats",
    highlights: [
      "Same syllabus as the Chandigarh campus",
      "Weekday and weekend batches",
      "Local doubt-clearing sessions",
      "Walk-in counselling",
    ],
  },
  {
    slug: "kharar",
    name: "Kharar",
    address: "Landran Road, Kharar, Punjab 140301",
    locality: "Landran Road",
    phone: "+91 98881 22264",
    phoneHref: "tel:+919888122264",
    mapUrl: "https://maps.google.com/?q=Landran+Road+Kharar",
    blurb:
      "In the university belt, bringing the same industry-practitioner trainers and placement cell to a smaller-batch campus.",
    labs: "2 labs · 40 seats",
    highlights: [
      "Small batches, close trainer attention",
      "Programming and office skills tracks",
      "Free counselling and demo classes",
      "Placement support after course completion",
    ],
  },
  {
    slug: "ambala",
    name: "Ambala",
    address: "Nicholson Road, Ambala Cantt, Haryana 133001",
    locality: "Nicholson Road",
    phone: "+91 98881 22265",
    phoneHref: "tel:+919888122265",
    mapUrl: "https://maps.google.com/?q=Nicholson+Road+Ambala+Cantt",
    blurb:
      "Our Haryana centre beyond the tricity, with a full lab floor for AI, cyber security and full-stack tracks.",
    labs: "3 labs · 60 seats",
    highlights: [
      "AI and cyber security lab access",
      "Full-stack and cloud tracks",
      "Placement drives with local employers",
      "Weekend batches for students and professionals",
    ],
  },
];

export const branchesBySlug = new Map(branches.map((b) => [b.slug, b]));

export const headBranch = branches.find((b) => b.isHead)!;

/**
 * Local SEO landing areas — smaller localities we serve from the nearest
 * centre, published as `/computer-training-in/<area>`.
 */
export interface ServiceArea {
  slug: string;
  name: string;
  nearestBranch: string;
  distance: string;
  note: string;
}

export const serviceAreas: ServiceArea[] = [
  { slug: "chandigarh", name: "Chandigarh", nearestBranch: "chandigarh", distance: "On site", note: "All sectors served from the Sector 34-A campus." },
  { slug: "mohali", name: "Mohali", nearestBranch: "mohali", distance: "On site", note: "Phase 7 centre serving all of Mohali." },
  { slug: "panchkula", name: "Panchkula", nearestBranch: "panchkula", distance: "On site", note: "Sector 11 centre serving all of Panchkula." },
  { slug: "zirakpur", name: "Zirakpur", nearestBranch: "zirakpur", distance: "On site", note: "VIP Road centre on the Ambala highway." },
  { slug: "kharar", name: "Kharar", nearestBranch: "kharar", distance: "On site", note: "Landran Road centre in the university belt." },
  { slug: "ambala", name: "Ambala", nearestBranch: "ambala", distance: "On site", note: "Nicholson Road centre serving Ambala Cantt and city." },
  { slug: "manimajra", name: "Manimajra", nearestBranch: "chandigarh", distance: "8 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
  { slug: "dera-bassi", name: "Dera Bassi", nearestBranch: "zirakpur", distance: "12 km", note: "Direct bus routes to the Zirakpur centre." },
  { slug: "baltana", name: "Baltana", nearestBranch: "zirakpur", distance: "3 km", note: "Nearest centre is VIP Road, Zirakpur." },
  { slug: "banur", name: "Banur", nearestBranch: "mohali", distance: "20 km", note: "Nearest centre is Phase 7, Mohali." },
  { slug: "kurali", name: "Kurali", nearestBranch: "kharar", distance: "12 km", note: "Weekend batches available at the Kharar centre." },
  { slug: "new-chandigarh", name: "New Chandigarh", nearestBranch: "kharar", distance: "10 km", note: "Nearest centre is the Kharar campus on Landran Road." },
  { slug: "pinjore", name: "Pinjore", nearestBranch: "panchkula", distance: "20 km", note: "Nearest centre is Sector 11, Panchkula." },
  { slug: "rajpura", name: "Rajpura", nearestBranch: "zirakpur", distance: "25 km", note: "Nearest centre is VIP Road, Zirakpur." },
];

export const serviceAreasBySlug = new Map(serviceAreas.map((a) => [a.slug, a]));

export const branchFor = (area: ServiceArea) => branchesBySlug.get(area.nearestBranch)!;

export const cityLabel = site.city;
