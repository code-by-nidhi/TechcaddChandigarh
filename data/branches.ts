import { site } from "./site";

/**
 * The centre network, headed by the Chandigarh campus.
 *
 * Contact details other than the head campus are placeholders — replace them
 * with the live numbers and addresses for each centre before going live. The
 * head campus takes its number and map link from `site`, so there is one place
 * to change the main line rather than two that can disagree.
 *
 * Every slug here is a published route (`/branches/<slug>`) and is also the
 * target of `ServiceArea.nearestBranch` below. Removing a branch without
 * re-pointing the areas that name it leaves `branchFor` returning undefined
 * behind a non-null assertion, which crashes the area page at request time.
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
  /**
   * That centre's own site, where it runs one. Only some do, so anything
   * rendering this has to handle its absence rather than assume a link.
   */
  website?: string;
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
    slug: "ludhiana",
    name: "Ludhiana",
    address: "Ferozepur Road, Ludhiana, Punjab 141001",
    locality: "Ferozepur Road",
    phone: "+91 98881 22262",
    phoneHref: "tel:+919888122262",
    mapUrl: "https://maps.google.com/?q=Ferozepur+Road+Ludhiana",
    website: "https://techcaddludhiana.com/",
    blurb:
      "Our largest Punjab centre outside the tricity, serving a manufacturing belt that hires as much for CAD and accounting as it does for software.",
    labs: "4 labs · 90 seats",
    highlights: [
      "CAD, CAM and design lab",
      "Accounting and office tracks",
      "Industry visits with local manufacturers",
      "Weekday, evening and weekend batches",
    ],
  },
  {
    slug: "jalandhar",
    name: "Jalandhar",
    address: "Model Town, Jalandhar, Punjab 144003",
    locality: "Model Town",
    phone: "+91 98881 22263",
    phoneHref: "tel:+919888122263",
    mapUrl: "https://maps.google.com/?q=Model+Town+Jalandhar",
    website: "https://techcaddjalandhar.com/",
    blurb:
      "A full-syllabus centre in the heart of Model Town, running the same assessments and project reviews as the head campus.",
    labs: "4 labs · 85 seats",
    highlights: [
      "Full AI and full-stack tracks",
      "University tie-ups for industrial training",
      "Placement drives with regional employers",
      "Walk-in counselling six days a week",
    ],
  },
  {
    slug: "hoshiarpur",
    name: "Hoshiarpur",
    address: "Una Road, Hoshiarpur, Punjab 146001",
    locality: "Una Road",
    phone: "+91 98881 22264",
    phoneHref: "tel:+919888122264",
    mapUrl: "https://maps.google.com/?q=Una+Road+Hoshiarpur",
    blurb:
      "Small batches and close trainer attention, with the same syllabus and the same placement support as the larger campuses.",
    labs: "2 labs · 45 seats",
    highlights: [
      "Small batches, close trainer attention",
      "Programming and office skills tracks",
      "Free counselling and demo classes",
      "Placement support after course completion",
    ],
  },
  {
    slug: "phagwara",
    name: "Phagwara",
    address: "GT Road, Phagwara, Punjab 144401",
    locality: "GT Road",
    phone: "+91 98881 22265",
    phoneHref: "tel:+919888122265",
    mapUrl: "https://maps.google.com/?q=GT+Road+Phagwara",
    website: "https://techcaddphagwara.in/",
    blurb:
      "In the university belt on the GT Road, with batch timings built around college hours and a steady intake of industrial-training students.",
    labs: "3 labs · 60 seats",
    highlights: [
      "Batch timings around college hours",
      "Industrial training specialists",
      "Full-stack, AI and data tracks",
      "Campus tie-ups with nearby universities",
    ],
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    address: "Ranjit Avenue, Amritsar, Punjab 143001",
    locality: "Ranjit Avenue",
    phone: "+91 98881 22266",
    phoneHref: "tel:+919888122266",
    mapUrl: "https://maps.google.com/?q=Ranjit+Avenue+Amritsar",
    blurb:
      "Our centre in the north of the state, with a full lab floor for AI, cyber security and full-stack tracks and its own placement drives.",
    labs: "3 labs · 70 seats",
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
 *
 * `nearestBranch` must name a slug that exists in `branches` above.
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
  { slug: "panchkula", name: "Panchkula", nearestBranch: "chandigarh", distance: "10 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
  { slug: "zirakpur", name: "Zirakpur", nearestBranch: "chandigarh", distance: "15 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
  { slug: "kharar", name: "Kharar", nearestBranch: "mohali", distance: "12 km", note: "Nearest centre is Phase 7, Mohali." },
  { slug: "ambala", name: "Ambala", nearestBranch: "chandigarh", distance: "50 km", note: "Weekend batches available at the Chandigarh campus." },
  { slug: "manimajra", name: "Manimajra", nearestBranch: "chandigarh", distance: "8 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
  { slug: "dera-bassi", name: "Dera Bassi", nearestBranch: "chandigarh", distance: "25 km", note: "Direct bus routes to the Chandigarh campus." },
  { slug: "baltana", name: "Baltana", nearestBranch: "chandigarh", distance: "14 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
  { slug: "banur", name: "Banur", nearestBranch: "mohali", distance: "20 km", note: "Nearest centre is Phase 7, Mohali." },
  { slug: "kurali", name: "Kurali", nearestBranch: "mohali", distance: "25 km", note: "Weekend batches available at the Mohali centre." },
  { slug: "new-chandigarh", name: "New Chandigarh", nearestBranch: "mohali", distance: "20 km", note: "Nearest centre is Phase 7, Mohali." },
  { slug: "pinjore", name: "Pinjore", nearestBranch: "chandigarh", distance: "22 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
  { slug: "rajpura", name: "Rajpura", nearestBranch: "chandigarh", distance: "30 km", note: "Nearest centre is Sector 34-A, Chandigarh." },
];

export const serviceAreasBySlug = new Map(serviceAreas.map((a) => [a.slug, a]));

export const branchFor = (area: ServiceArea) => branchesBySlug.get(area.nearestBranch)!;

export const cityLabel = site.city;
