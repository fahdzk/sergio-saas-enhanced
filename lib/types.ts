export type NavigationTab =
  | "dashboard"
  | "for-sale"
  | "for-rent"
  | "buyers"
  | "renters"
  | "investors"
  | "vendors"
  | "scraping"
  | "property-stats"
  | "map"
  | "email"
  | "settings";

export type ListingType = "sale" | "rent";

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  neighborhood: string;
  status: string;
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  stories?: number;
  parkingSpaces?: number;
  parkingFeatures?: string;
  hoaDues?: number;
  description: string;
  tags: string[];
  highlight: string;
  amenities?: string[];
  photoUrls?: string[];
  availableDate?: string;
  securityDeposit?: number;
  applicationFee?: number;
  petFee?: number;
  utilitiesIncluded?: string[];
  listingTerms?: string[];
  mlsNumber?: string;
  soldDate?: string;
  soldRole?: "Listing Agent" | "Buyer's Agent";
  leaseTermMonths?: number;
  petPolicy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ClientType = "buyer" | "renter";

export type Client = {
  id: string;
  type: ClientType;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
  budget: number;
  timeline: string;
  priority: string;
  preferredAreas: string[];
  desiredPropertyTypes?: string[];
  minimumBedrooms?: number;
  minimumBathrooms?: number;
  preferenceSummary: string;
  notes: string;
  nextAction: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Investor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  investmentRange: number;
  preferredAreas: string[];
  assetTypes: string[];
  notes: string;
  committed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Vendor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  serviceAreas: string[];
  address: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CampaignTemplate = {
  id: string;
  name: string;
  audience: string;
  subject: string;
  body: string;
  sent: number;
  opened: number;
  replied: number;
  segmentSize: number;
  openGoal: number;
  conversionGoal: number;
  status: string;
};

export type DashboardGoal = {
  label: string;
  current: string;
  target: string;
  progress: number;
  helper: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type MarketPin = {
  city: string;
  county: string;
  distance: string;
  activePins: number;
  x: string;
  y: string;
};

export type MonthlyClosing = {
  label: string;
  closed: number;
};

export type ListingPayload = Omit<Listing, "id" | "createdAt" | "updatedAt">;

export type ClientPayload = Omit<Client, "id" | "createdAt" | "updatedAt">;
export type InvestorPayload = Omit<Investor, "id" | "createdAt" | "updatedAt">;
export type VendorPayload = Omit<Vendor, "id" | "createdAt" | "updatedAt">;
