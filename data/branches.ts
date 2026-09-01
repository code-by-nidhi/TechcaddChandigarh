import { site } from "./site";

/**
 * Regional centres around the tricity. Contact details are placeholders —
 * replace with the live numbers and addresses for each branch.
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
    address: "SCO 118-120, 2nd Floor, Sector 34-A, Chandigarh 160022",
    locality: "Sector 34-A",
    phone: site.contact.phone,
    phoneHref: site.contact.phoneHref,
    mapUrl: "https://maps.google.com/?q=Sector+34A+Chandigarh",
    blurb:
      "Our head campus, with the largest lab floor, the AI and cyber security ranges, and the placement team that runs drives for every branch.",
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
    address: "Phase 7, Industrial Area, Sahibzada Ajit Singh Nagar 160055",
    locality: "Phase 7",
    phone: "+91 98881 22255",
    phoneHref: "tel:+919888122255",
    mapUrl: "https://maps.google.com/?q=Phase+7+Mohali",
    blurb:
      "Close to the IT parks, this centre runs the heaviest full-stack and cloud schedules, including early-morning batches for working professionals.",
    labs: "4 labs · 90 seats",
    highlights: [
      "Full-stack and DevOps focus",
      "7 AM batches for working professionals",
      "Walking distance from Phase 8 IT offices",
      "Interview drives with local product teams",
    ],
  },
  {
    slug: "panchkula",
    name: "Panchkula",
    address: "Sector 11, Main Market, Panchkula, Haryana 134109",
    locality: "Sector 11",
    phone: "+91 98881 22256",
    phoneHref: "tel:+919888122256",
    mapUrl: "https://maps.google.com/?q=Sector+11+Panchkula",
    blurb:
      "Serving Panchkula and the Haryana side of the tricity, with strong data analytics, digital marketing and office skills programs.",
    labs: "3 labs · 70 seats",
    highlights: [
      "Data analytics and marketing focus",
      "Tally and office skills batches",
      "Student transport routes from Pinjore",
      "Saturday doubt-clearing sessions",
    ],
  },
  {
    slug: "zirakpur",
    name: "Zirakpur",
    address: "VIP Road, Near Paras Down Town, Zirakpur, Punjab 140603",
    locality: "VIP Road",
    phone: "+91 98881 22257",
    phoneHref: "tel:+919888122257",
    mapUrl: "https://maps.google.com/?q=VIP+Road+Zirakpur",
    blurb:
      "A fast-growing centre for students commuting from Dera Bassi, Banur and the Ambala highway corridor.",
    labs: "3 labs · 60 seats",
    highlights: [
      "Convenient for highway commuters",
      "Evening batches after 6 PM",
      "Industrial training for nearby colleges",
      "Free parking on site",
    ],
  },
  {
    slug: "kharar",
    name: "Kharar",
    address: "Landran Road, Near Chandigarh University, Kharar, Punjab 140301",
    locality: "Landran Road",
    phone: "+91 98881 22258",
    phoneHref: "tel:+919888122258",
    mapUrl: "https://maps.google.com/?q=Landran+Road+Kharar",
    blurb:
      "Built around the university belt — the majority of our 45-day and six-week industrial training cohorts run from here.",
    labs: "4 labs · 100 seats",
    highlights: [
      "Industrial training specialists",
      "Campus tie-ups with nearby universities",
      "Batch timings around college hours",
      "Group enrolment discounts",
    ],
  },
  {
    slug: "ambala",
    name: "Ambala",
    address: "Nicholson Road, Ambala Cantt, Haryana 133001",
    locality: "Ambala Cantt",
    phone: "+91 98881 22259",
    phoneHref: "tel:+919888122259",
    mapUrl: "https://maps.google.com/?q=Nicholson+Road+Ambala+Cantt",
    blurb:
      "Our Haryana centre, running the programming, data and government-exam typing tracks with hostel guidance for outstation students.",
    labs: "3 labs · 65 seats",
    highlights: [
      "Programming and data tracks",
      "Government exam typing preparation",
      "Hostel guidance for outstation students",
      "Monthly placement drives",
    ],
  },
];

export const branchesBySlug = new Map(branches.map((b) => [b.slug, b]));

export const headBranch = branches.find((b) => b.isHead)!;

/**
 * Local SEO landing areas — smaller localities we serve from the nearest
 * branch, published as `/computer-training-in/<area>`.
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
  { slug: "mohali", name: "Mohali", nearestBranch: "mohali", distance: "On site", note: "Phase 7 centre, minutes from the Phase 8 IT parks." },
  { slug: "panchkula", name: "Panchkula", nearestBranch: "panchkula", distance: "On site", note: "Sector 11 centre serving all Panchkula sectors." },
  { slug: "zirakpur", name: "Zirakpur", nearestBranch: "zirakpur", distance: "On site", note: "VIP Road centre on the Ambala highway." },
  { slug: "kharar", name: "Kharar", nearestBranch: "kharar", distance: "On site", note: "Landran Road centre in the university belt." },
  { slug: "dera-bassi", name: "Dera Bassi", nearestBranch: "zirakpur", distance: "12 km", note: "Nearest centre is Zirakpur, on the same highway." },
  { slug: "banur", name: "Banur", nearestBranch: "zirakpur", distance: "16 km", note: "Direct bus routes to the Zirakpur centre." },
  { slug: "landran", name: "Landran", nearestBranch: "kharar", distance: "6 km", note: "Kharar centre serves the entire Landran college belt." },
  { slug: "new-chandigarh", name: "New Chandigarh", nearestBranch: "kharar", distance: "9 km", note: "Kharar centre is the closest campus." },
  { slug: "pinjore", name: "Pinjore", nearestBranch: "panchkula", distance: "20 km", note: "Student transport route runs to Panchkula." },
  { slug: "rajpura", name: "Rajpura", nearestBranch: "zirakpur", distance: "24 km", note: "Weekend batches available at Zirakpur." },
  { slug: "morinda", name: "Morinda", nearestBranch: "kharar", distance: "22 km", note: "Kharar centre with weekend batch options." },
];

export const serviceAreasBySlug = new Map(serviceAreas.map((a) => [a.slug, a]));

export const branchFor = (area: ServiceArea) => branchesBySlug.get(area.nearestBranch)!;

export const cityLabel = site.city;
