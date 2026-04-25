import {
  ActivityItem,
  CampaignTemplate,
  Client,
  DashboardGoal,
  Investor,
  Listing,
  MarketPin,
  MonthlyClosing,
  Vendor
} from "@/lib/types";

export const saleListings: Listing[] = [
  {
    id: "sale-1",
    type: "sale",
    title: "Avenues View Residence",
    address: "417 E 11th Ave",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84103",
    neighborhood: "The Avenues",
    status: "Active",
    propertyType: "Single Family",
    price: 945000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2680,
    lotSize: 7405,
    yearBuilt: 1989,
    stories: 2,
    parkingSpaces: 2,
    parkingFeatures: "Attached garage",
    hoaDues: 0,
    description:
      "Updated hillside home with downtown access, mountain light, a finished lower level, and strong move-up buyer appeal.",
    tags: ["Mountain views", "Updated kitchen", "Move-up"],
    highlight: "Ideal for the buyer segment focused on walkability plus private outdoor space.",
    amenities: ["Hardwood floors", "Updated kitchen", "Office", "Deck"],
    photoUrls: [],
    listingTerms: ["Cash", "Conventional", "FHA"],
    mlsNumber: "UT-2026-1142"
  },
  {
    id: "sale-2",
    type: "sale",
    title: "Draper Ridge Home",
    address: "14267 Canyon Vine Cv",
    city: "Draper",
    state: "UT",
    zipCode: "84020",
    neighborhood: "SunCrest",
    status: "Pending",
    propertyType: "Single Family",
    price: 1285000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3920,
    lotSize: 12632,
    yearBuilt: 2016,
    stories: 2,
    parkingSpaces: 3,
    parkingFeatures: "Attached garage",
    hoaDues: 167,
    description:
      "Family-scale property with two living levels, trail access, and a polished interior ready for high-intent relocation buyers.",
    tags: ["Trail access", "Family layout", "Wasatch views"],
    highlight: "Pending after a short launch cycle and strong digital interest from the south valley segment.",
    amenities: ["Mudroom", "Mountain view", "Finished basement", "Patio"],
    photoUrls: [],
    listingTerms: ["Cash", "Conventional"],
    mlsNumber: "UT-2026-1198"
  },
  {
    id: "sale-3",
    type: "sale",
    title: "Sugar House Corner Tudor",
    address: "1865 S 1400 E",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84105",
    neighborhood: "Sugar House",
    status: "Sold",
    propertyType: "Historic Home",
    price: 835000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2140,
    lotSize: 6098,
    yearBuilt: 1941,
    stories: 2,
    parkingSpaces: 1,
    parkingFeatures: "Detached garage",
    hoaDues: 0,
    description:
      "Character-rich brick home with renovated baths, mature landscaping, and a fast commute to the city core.",
    tags: ["Historic", "Walkable", "Updated baths"],
    highlight: "Closed after a targeted campaign to buyers prioritizing neighborhood identity and commute time.",
    amenities: ["Historic trim", "Updated baths", "Fenced yard"],
    photoUrls: [],
    listingTerms: ["Cash", "Conventional"],
    mlsNumber: "UT-2026-1015"
  }
];

export const rentalListings: Listing[] = [
  {
    id: "rent-1",
    type: "rent",
    title: "Downtown Loft 8",
    address: "260 S 200 E Unit 8",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84111",
    neighborhood: "Central City",
    status: "Active",
    propertyType: "Condo",
    price: 2450,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1180,
    lotSize: 1180,
    yearBuilt: 2018,
    stories: 1,
    parkingSpaces: 1,
    parkingFeatures: "Assigned garage",
    hoaDues: 0,
    description:
      "Modern downtown rental with garage parking, in-unit laundry, and strong appeal for professional tenants working in the core.",
    tags: ["In-unit laundry", "Garage", "Downtown"],
    highlight: "Best fit for renter leads seeking transit access and flexible commute options.",
    amenities: ["In-unit laundry", "Fitness room", "Garage parking"],
    photoUrls: [],
    availableDate: "2026-05-01",
    securityDeposit: 2450,
    applicationFee: 45,
    petFee: 300,
    utilitiesIncluded: ["Water", "Trash"],
    leaseTermMonths: 12,
    petPolicy: "Cats and dogs considered"
  },
  {
    id: "rent-2",
    type: "rent",
    title: "Murray Garden Apartment",
    address: "5110 S Orchard Ln",
    city: "Murray",
    state: "UT",
    zipCode: "84107",
    neighborhood: "Murray East",
    status: "Upcoming",
    propertyType: "Apartment",
    price: 1895,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 980,
    lotSize: 980,
    yearBuilt: 1998,
    stories: 1,
    parkingSpaces: 1,
    parkingFeatures: "Reserved lot parking",
    hoaDues: 0,
    description:
      "Light-filled apartment close to Intermountain Medical Center with updated flooring, reserved parking, and a short lease ramp.",
    tags: ["Reserved parking", "Near hospital", "Updated flooring"],
    highlight: "Useful inventory for healthcare-adjacent renters moving on a short notice timeline.",
    amenities: ["Reserved parking", "Updated flooring", "On-site laundry"],
    photoUrls: [],
    availableDate: "2026-06-01",
    securityDeposit: 1895,
    applicationFee: 40,
    petFee: 0,
    utilitiesIncluded: ["Trash"],
    leaseTermMonths: 6,
    petPolicy: "No pets"
  },
  {
    id: "rent-3",
    type: "rent",
    title: "Lehi Tech Townhome",
    address: "3896 N Traverse Pkwy",
    city: "Lehi",
    state: "UT",
    zipCode: "84043",
    neighborhood: "Thanksgiving Point",
    status: "Leased",
    propertyType: "Townhome",
    price: 2695,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1640,
    lotSize: 1640,
    yearBuilt: 2021,
    stories: 3,
    parkingSpaces: 2,
    parkingFeatures: "Attached garage",
    hoaDues: 0,
    description:
      "Three-level townhome with attached garage, office nook, and direct access to the tech corridor.",
    tags: ["Garage", "Home office", "Tech corridor"],
    highlight: "Leased quickly after segmented email outreach to relocation renters moving south of Salt Lake.",
    amenities: ["Garage", "Home office", "Smart thermostat"],
    photoUrls: [],
    availableDate: "2026-04-15",
    securityDeposit: 2695,
    applicationFee: 50,
    petFee: 250,
    utilitiesIncluded: [],
    leaseTermMonths: 12,
    petPolicy: "Small dogs only"
  }
];

export const buyerClients: Client[] = [
  {
    id: "buyer-1",
    type: "buyer",
    name: "Andrea Walsh",
    email: "andrea.walsh@example.com",
    phone: "(801) 555-0112",
    address: "225 S Temple St, Salt Lake City, UT 84101",
    status: "Qualified",
    budget: 975000,
    timeline: "30-60 days",
    priority: "High",
    preferredAreas: ["Sugar House", "The Avenues", "Millcreek"],
    desiredPropertyTypes: ["Single Family", "Townhome"],
    minimumBedrooms: 3,
    minimumBathrooms: 2,
    preferenceSummary: "Needs 3+ bedrooms, updated kitchen, office space, and quick freeway access for dual commutes.",
    notes: "Selling current condo before closing on next property.",
    nextAction: "Send two Avenues options and prep a sell-before-buy sequence."
  },
  {
    id: "buyer-2",
    type: "buyer",
    name: "Marcus Reed",
    email: "marcus.reed@example.com",
    phone: "(385) 555-0194",
    address: "1184 Pioneer Rd, Sandy, UT 84094",
    status: "Touring",
    budget: 1350000,
    timeline: "2 weeks",
    priority: "High",
    preferredAreas: ["Draper", "South Jordan", "Sandy"],
    desiredPropertyTypes: ["Single Family"],
    minimumBedrooms: 4,
    minimumBathrooms: 3,
    preferenceSummary: "Looking for canyon access, guest room, and strong school options with at least a 3-car garage.",
    notes: "Financing pre-approval already in hand.",
    nextAction: "Confirm weekend tour route and share comparative neighborhood pricing."
  },
  {
    id: "buyer-3",
    type: "buyer",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "(435) 555-0138",
    address: "920 East 3900 South, Salt Lake City, UT 84124",
    status: "New",
    budget: 740000,
    timeline: "90 days",
    priority: "Medium",
    preferredAreas: ["Murray", "Cottonwood Heights", "Holladay"],
    desiredPropertyTypes: ["Condo", "Single Family"],
    minimumBedrooms: 2,
    minimumBathrooms: 2,
    preferenceSummary: "Prioritizes low-maintenance living, mountain proximity, and room for visiting family.",
    notes: "Wants to understand HOA tradeoffs before deciding between condo and detached home.",
    nextAction: "Send neighborhood primer and first-round shortlist."
  }
];

export const renterClients: Client[] = [
  {
    id: "renter-1",
    type: "renter",
    name: "Luis Martinez",
    email: "luis.martinez@example.com",
    phone: "(801) 555-0171",
    address: "45 West 100 South, Salt Lake City, UT 84101",
    status: "Application",
    budget: 2400,
    timeline: "Move next month",
    priority: "High",
    preferredAreas: ["Downtown SLC", "Central City", "9th and 9th"],
    desiredPropertyTypes: ["Condo", "Apartment"],
    minimumBedrooms: 1,
    minimumBathrooms: 1,
    preferenceSummary: "Needs covered parking, in-unit laundry, and a dog-friendly lease close to downtown employers.",
    notes: "Verifying income documents this week.",
    nextAction: "Submit application package for Downtown Loft 8 and keep one backup option active."
  },
  {
    id: "renter-2",
    type: "renter",
    name: "Rachel Kim",
    email: "rachel.kim@example.com",
    phone: "(385) 555-0188",
    address: "1011 Vine St, Murray, UT 84107",
    status: "Qualified",
    budget: 1950,
    timeline: "45 days",
    priority: "Medium",
    preferredAreas: ["Murray", "Midvale", "Millcreek"],
    desiredPropertyTypes: ["Apartment", "Condo"],
    minimumBedrooms: 2,
    minimumBathrooms: 1,
    preferenceSummary: "Wants reserved parking, easy hospital commute, and a calm apartment setting with simple lease terms.",
    notes: "Prefers a six-month option if available.",
    nextAction: "Send Murray Garden Apartment details when it turns active."
  },
  {
    id: "renter-3",
    type: "renter",
    name: "Owen Harper",
    email: "owen.harper@example.com",
    phone: "(801) 555-0163",
    address: "4550 N Ashton Blvd, Lehi, UT 84043",
    status: "New",
    budget: 2800,
    timeline: "60 days",
    priority: "Medium",
    preferredAreas: ["Lehi", "Draper", "South Jordan"],
    desiredPropertyTypes: ["Townhome", "Single Family"],
    minimumBedrooms: 2,
    minimumBathrooms: 2,
    preferenceSummary: "Needs garage parking, office nook, and a pet-friendly lease near I-15 and the tech corridor.",
    notes: "Comparing Lehi and Draper commute tradeoffs.",
    nextAction: "Share available townhome inventory and segment into south-valley follow-up list."
  }
];

export const investors: Investor[] = [
  {
    id: "investor-1",
    name: "Canyon Capital Partners",
    email: "acquisitions@canyoncapital.example",
    phone: "(801) 555-0301",
    company: "Canyon Capital Partners",
    investmentRange: 1500000,
    preferredAreas: ["Salt Lake City", "Draper", "Lehi"],
    assetTypes: ["Fix and Flip", "Multifamily", "Buy and Hold"],
    notes: "Prefers value-add opportunities with quick access to transit or freeway corridors.",
    committed: true
  },
  {
    id: "investor-2",
    name: "Nora Ellison",
    email: "nora.ellison@example.com",
    phone: "(385) 555-0305",
    company: "Private Investor",
    investmentRange: 500000,
    preferredAreas: ["Sugar House", "Millcreek"],
    assetTypes: ["Single Family Rental", "Townhome"],
    notes: "Interested in long-term rental stock and light rehab projects.",
    committed: false
  }
];

export const vendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Blue Peak Roofing",
    email: "dispatch@bluepeakroofing.example",
    phone: "(801) 555-0411",
    company: "Blue Peak Roofing",
    category: "Roofing",
    serviceAreas: ["Salt Lake City", "Murray", "Draper"],
    address: "215 West 3300 South, Salt Lake City, UT 84115",
    notes: "Fast emergency patching and insurance claim documentation."
  },
  {
    id: "vendor-2",
    name: "Wasatch Yard Care",
    email: "service@wasatchyardcare.example",
    phone: "(801) 555-0422",
    company: "Wasatch Yard Care",
    category: "Gardening",
    serviceAreas: ["Sandy", "Draper", "South Jordan"],
    address: "1024 East 10600 South, Sandy, UT 84094",
    notes: "Weekly maintenance, seasonal cleanup, and irrigation tune-ups."
  }
];

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: "buyers-weekly",
    name: "Buyer Weekly Match",
    audience: "Qualified buyers",
    subject: "New Utah homes matched to your budget and area",
    body:
      "Hi {{first_name}},\n\nI pulled the strongest new listings for your target price range and preferred areas. This set focuses on the homes most aligned with your timing, layout needs, and commute goals.\n\nReply if you want me to line up private tours or narrow the list down to the top three.\n\nSergio",
    sent: 42,
    opened: 29,
    replied: 8,
    segmentSize: 64,
    openGoal: 55,
    conversionGoal: 12,
    status: "Ready"
  },
  {
    id: "renters-alert",
    name: "Rental Alert",
    audience: "Active renter prospects",
    subject: "New rentals now available in your preferred areas",
    body:
      "Hi {{first_name}},\n\nI just added a few rental options that fit the budget, lease timing, and neighborhood preferences you shared with me. The strongest matches are moving quickly, so I wanted to send them first before they spread widely.\n\nIf one stands out, I can help you schedule the next step right away.\n\nSergio",
    sent: 58,
    opened: 39,
    replied: 11,
    segmentSize: 91,
    openGoal: 50,
    conversionGoal: 10,
    status: "Ready"
  },
  {
    id: "seller-sphere",
    name: "Home Valuation Invite",
    audience: "Seller sphere / future move-up owners",
    subject: "What your Utah home may be worth this season",
    body:
      "Hi {{first_name}},\n\nIf moving is even a possibility this year, I can put together a focused pricing snapshot for your home and show you what buyers are responding to in your neighborhood right now.\n\nIt is a clean way to understand your options before making any commitments.\n\nSergio",
    sent: 35,
    opened: 22,
    replied: 6,
    segmentSize: 80,
    openGoal: 45,
    conversionGoal: 8,
    status: "Draft"
  }
];

export const dashboardGoals: DashboardGoal[] = [
  {
    label: "Annual revenue",
    current: "$2.36M",
    target: "$3.2M",
    progress: 74,
    helper: "Driven by closed sale volume plus tenant placement fees."
  },
  {
    label: "Transactions",
    current: "18",
    target: "24",
    progress: 75,
    helper: "Combined closings and executed leases for the current year."
  },
  {
    label: "Buyer pipeline",
    current: "9 active",
    target: "12 active",
    progress: 75,
    helper: "Qualified buyers currently in nurture, tour, or contract stages."
  },
  {
    label: "Rental placements",
    current: "11",
    target: "16",
    progress: 69,
    helper: "Executed or highly likely renter placements within the current period."
  }
];

export const activityFeed: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Downtown Loft 8 drew three new inquiries.",
    detail: "Two came from renter email segmentation and one from direct referral traffic.",
    time: "14 minutes ago"
  },
  {
    id: "activity-2",
    title: "Andrea Walsh advanced to qualified buyer status.",
    detail: "Budget and preferred areas confirmed, waiting on shortlist delivery.",
    time: "43 minutes ago"
  },
  {
    id: "activity-3",
    title: "Draper Ridge Home moved to pending.",
    detail: "Offer accepted after a weekend push focused on south valley buyers.",
    time: "2 hours ago"
  },
  {
    id: "activity-4",
    title: "Rental Alert campaign exceeded target opens.",
    detail: "Open rate crossed the goal and generated two application-stage conversations.",
    time: "Today"
  }
];

export const mapMarkets: MarketPin[] = [
  { city: "Salt Lake City", county: "Salt Lake County", distance: "0 mi", activePins: 7, x: "47%", y: "42%" },
  { city: "Murray", county: "Salt Lake County", distance: "9 mi", activePins: 3, x: "47%", y: "54%" },
  { city: "Draper", county: "Salt Lake County", distance: "18 mi", activePins: 4, x: "57%", y: "67%" },
  { city: "South Jordan", county: "Salt Lake County", distance: "20 mi", activePins: 3, x: "54%", y: "63%" },
  { city: "Lehi", county: "Utah County", distance: "32 mi", activePins: 2, x: "63%", y: "78%" },
  { city: "Ogden", county: "Weber County", distance: "37 mi", activePins: 2, x: "43%", y: "16%" }
];

export const monthlyClosings: MonthlyClosing[] = [
  { label: "Jan", closed: 2 },
  { label: "Feb", closed: 3 },
  { label: "Mar", closed: 4 },
  { label: "Apr", closed: 4 },
  { label: "May", closed: 5 },
  { label: "Jun", closed: 6 }
];
