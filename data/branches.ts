import { site } from "./site";

/**
 * Regional centres across the Punjab belt. Contact details are placeholders
 * — replace with the live numbers and addresses for each branch.
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
    slug: "jalandhar",
    name: "Jalandhar",
    isHead: true,
    address: "Model Town, Jalandhar, Punjab 144003",
    locality: "Model Town",
    phone: site.contact.phone,
    phoneHref: site.contact.phoneHref,
    mapUrl: "https://maps.google.com/?q=Model+Town+Jalandhar",
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
    slug: "ludhiana",
    name: "Ludhiana",
    address: "Ferozepur Road, Ludhiana, Punjab 141001",
    locality: "Ferozepur Road",
    phone: "+91 98881 22261",
    phoneHref: "tel:+919888122261",
    mapUrl: "https://maps.google.com/?q=Ferozepur+Road+Ludhiana",
    blurb:
      "Serving Punjab's largest industrial city, with a schedule weighted toward working professionals and evening batches.",
    labs: "3 labs · 65 seats",
    highlights: [
      "Evening batches for working professionals",
      "Programming and data tracks",
      "Placement drives with local industry",
      "Group enrolment discounts",
    ],
  },
  {
    slug: "phagwara",
    name: "Phagwara",
    address: "G.T. Road, Phagwara, Punjab 144401",
    locality: "G.T. Road",
    phone: "+91 98881 22262",
    phoneHref: "tel:+919888122262",
    mapUrl: "https://maps.google.com/?q=GT+Road+Phagwara",
    blurb:
      "Close to the university belt, with batch timings built around college hours and campus tie-ups for industrial training.",
    labs: "2 labs · 50 seats",
    highlights: [
      "Campus tie-ups with nearby universities",
      "Batch timings around college hours",
      "Industrial training specialists",
      "Student transport support",
    ],
  },
  {
    slug: "maqsudan",
    name: "Maqsudan",
    address: "Maqsudan, Jalandhar, Punjab 144008",
    locality: "Maqsudan",
    phone: "+91 98881 22263",
    phoneHref: "tel:+919888122263",
    mapUrl: "https://maps.google.com/?q=Maqsudan+Jalandhar",
    blurb:
      "A second Jalandhar centre for the Maqsudan side of the city, running the same syllabus as our Model Town campus.",
    labs: "2 labs · 45 seats",
    highlights: [
      "Same syllabus as the Model Town campus",
      "Weekday and weekend batches",
      "Local doubt-clearing sessions",
      "Walk-in counselling",
    ],
  },
  {
    slug: "hoshiarpur",
    name: "Hoshiarpur",
    address: "Adalat Bazar, Hoshiarpur, Punjab 146001",
    locality: "Adalat Bazar",
    phone: "+91 98881 22264",
    phoneHref: "tel:+919888122264",
    mapUrl: "https://maps.google.com/?q=Adalat+Bazar+Hoshiarpur",
    blurb:
      "Our newest Punjab centre, bringing the same industry-practitioner trainers and placement cell to a smaller-batch campus.",
    labs: "2 labs · 40 seats",
    highlights: [
      "Small batches, close trainer attention",
      "Programming and office skills tracks",
      "Free counselling and demo classes",
      "Placement support after course completion",
    ],
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    address: "Mall Road, Amritsar, Punjab 143001",
    locality: "Mall Road",
    phone: "+91 98881 22265",
    phoneHref: "tel:+919888122265",
    mapUrl: "https://maps.google.com/?q=Mall+Road+Amritsar",
    blurb:
      "Serving the Majha region, with a full lab floor for AI, cyber security and full-stack tracks.",
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
  { slug: "jalandhar", name: "Jalandhar", nearestBranch: "jalandhar", distance: "On site", note: "All sectors served from the Model Town campus." },
  { slug: "ludhiana", name: "Ludhiana", nearestBranch: "ludhiana", distance: "On site", note: "Ferozepur Road centre serving all of Ludhiana." },
  { slug: "phagwara", name: "Phagwara", nearestBranch: "phagwara", distance: "On site", note: "G.T. Road centre in the university belt." },
  { slug: "maqsudan", name: "Maqsudan", nearestBranch: "maqsudan", distance: "On site", note: "Second Jalandhar campus on the Maqsudan side of the city." },
  { slug: "hoshiarpur", name: "Hoshiarpur", nearestBranch: "hoshiarpur", distance: "On site", note: "Adalat Bazar centre serving all of Hoshiarpur." },
  { slug: "amritsar", name: "Amritsar", nearestBranch: "amritsar", distance: "On site", note: "Mall Road centre serving all of Amritsar." },
  { slug: "nakodar", name: "Nakodar", nearestBranch: "jalandhar", distance: "25 km", note: "Nearest centre is Model Town, Jalandhar." },
  { slug: "phillaur", name: "Phillaur", nearestBranch: "jalandhar", distance: "20 km", note: "Direct bus routes to the Jalandhar centre." },
  { slug: "khanna", name: "Khanna", nearestBranch: "ludhiana", distance: "35 km", note: "Nearest centre is Ferozepur Road, Ludhiana." },
  { slug: "jagraon", name: "Jagraon", nearestBranch: "ludhiana", distance: "40 km", note: "Weekend batches available at the Ludhiana centre." },
  { slug: "nawanshahr", name: "Nawanshahr", nearestBranch: "phagwara", distance: "20 km", note: "Nearest centre is the Phagwara campus." },
  { slug: "tarn-taran", name: "Tarn Taran", nearestBranch: "amritsar", distance: "25 km", note: "Nearest centre is Mall Road, Amritsar." },
];

export const serviceAreasBySlug = new Map(serviceAreas.map((a) => [a.slug, a]));

export const branchFor = (area: ServiceArea) => branchesBySlug.get(area.nearestBranch)!;

export const cityLabel = site.city;
