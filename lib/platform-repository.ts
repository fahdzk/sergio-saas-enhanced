import {
  defaultCampaigns,
  defaultClients,
  defaultInvestors,
  defaultListings,
  defaultVendors
} from "@/lib/platform-data";
import { createRecordId, readPlatformStore, writePlatformStore } from "@/lib/platform-store";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import {
  CampaignTemplate,
  Client,
  ClientPayload,
  Investor,
  InvestorPayload,
  Listing,
  ListingPayload,
  Vendor,
  VendorPayload
} from "@/lib/types";

function isRecoverableSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybe = error as { code?: string; message?: string };
  return maybe.code === "PGRST205" || maybe.message?.includes("fetch failed") === true;
}

function nowIso() {
  return new Date().toISOString();
}

type ListingRow = {
  id: string;
  listing_type: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood: string;
  status: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size: number;
  year_built: number;
  stories: number;
  parking_spaces: number;
  parking_features: string;
  hoa_dues: number;
  description: string;
  tags: string[] | null;
  highlight: string;
  amenities: string[] | null;
  photo_urls: string[] | null;
  available_date: string | null;
  security_deposit: number | null;
  application_fee: number | null;
  pet_fee: number | null;
  utilities_included: string[] | null;
  listing_terms: string[] | null;
  mls_number: string | null;
  lease_term_months: number | null;
  pet_policy: string | null;
  created_at: string;
  updated_at: string;
};

type ClientRow = {
  id: string;
  client_type: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  budget: number;
  timeline: string;
  priority: string;
  preferred_areas: string[] | null;
  desired_property_types: string[] | null;
  minimum_bedrooms: number;
  minimum_bathrooms: number;
  preference_summary: string;
  notes: string;
  next_action: string;
  created_at: string;
  updated_at: string;
};

function mapListingRow(row: ListingRow): Listing {
  return {
    id: row.id,
    type: row.listing_type as Listing["type"],
    title: row.title,
    address: row.address,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    neighborhood: row.neighborhood,
    status: row.status,
    propertyType: row.property_type,
    price: row.price,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    squareFeet: row.square_feet,
    lotSize: row.lot_size,
    yearBuilt: row.year_built,
    stories: row.stories,
    parkingSpaces: row.parking_spaces,
    parkingFeatures: row.parking_features,
    hoaDues: row.hoa_dues,
    description: row.description,
    tags: row.tags ?? [],
    highlight: row.highlight,
    amenities: row.amenities ?? [],
    photoUrls: row.photo_urls ?? [],
    availableDate: row.available_date ?? undefined,
    securityDeposit: row.security_deposit ?? undefined,
    applicationFee: row.application_fee ?? undefined,
    petFee: row.pet_fee ?? undefined,
    utilitiesIncluded: row.utilities_included ?? [],
    listingTerms: row.listing_terms ?? [],
    mlsNumber: row.mls_number ?? undefined,
    leaseTermMonths: row.lease_term_months ?? undefined,
    petPolicy: row.pet_policy ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapClientRow(row: ClientRow): Client {
  return {
    id: row.id,
    type: row.client_type as Client["type"],
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    status: row.status,
    budget: row.budget,
    timeline: row.timeline,
    priority: row.priority,
    preferredAreas: row.preferred_areas ?? [],
    desiredPropertyTypes: row.desired_property_types ?? [],
    minimumBedrooms: row.minimum_bedrooms,
    minimumBathrooms: row.minimum_bathrooms,
    preferenceSummary: row.preference_summary,
    notes: row.notes,
    nextAction: row.next_action,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function listingInsert(payload: ListingPayload) {
  return {
    listing_type: payload.type,
    title: payload.title,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    zip_code: payload.zipCode,
    neighborhood: payload.neighborhood,
    status: payload.status,
    property_type: payload.propertyType,
    price: payload.price,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    square_feet: payload.squareFeet,
    lot_size: payload.lotSize,
    year_built: payload.yearBuilt,
    stories: payload.stories,
    parking_spaces: payload.parkingSpaces,
    parking_features: payload.parkingFeatures,
    hoa_dues: payload.hoaDues,
    description: payload.description,
    tags: payload.tags,
    highlight: payload.highlight,
    amenities: payload.amenities,
    photo_urls: payload.photoUrls,
    available_date: payload.availableDate ?? null,
    security_deposit: payload.securityDeposit ?? null,
    application_fee: payload.applicationFee ?? null,
    pet_fee: payload.petFee ?? null,
    utilities_included: payload.utilitiesIncluded ?? [],
    listing_terms: payload.listingTerms ?? [],
    mls_number: payload.mlsNumber ?? null,
    lease_term_months: payload.leaseTermMonths ?? null,
    pet_policy: payload.petPolicy ?? null
  };
}

function clientInsert(payload: ClientPayload) {
  return {
    client_type: payload.type,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    status: payload.status,
    budget: payload.budget,
    timeline: payload.timeline,
    priority: payload.priority,
    preferred_areas: payload.preferredAreas,
    desired_property_types: payload.desiredPropertyTypes,
    minimum_bedrooms: payload.minimumBedrooms,
    minimum_bathrooms: payload.minimumBathrooms,
    preference_summary: payload.preferenceSummary,
    notes: payload.notes,
    next_action: payload.nextAction
  };
}

async function localGetListings(type?: Listing["type"]) {
  const store = await readPlatformStore();
  return type ? store.listings.filter((listing) => listing.type === type) : store.listings;
}

export async function getListings(type?: Listing["type"]) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return localGetListings(type);

  try {
    let query = supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (type) query = query.eq("listing_type", type);
    const { data, error } = await query;
    if (error) throw error;
    return (data as ListingRow[]).map(mapListingRow);
  } catch (error) {
    if (isRecoverableSupabaseError(error)) return localGetListings(type);
    throw error;
  }
}

export async function createListing(payload: ListingPayload) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("listings").insert(listingInsert(payload)).select("*").single();
      if (error) throw error;
      return mapListingRow(data as ListingRow);
    } catch (error) {
      if (!isRecoverableSupabaseError(error)) throw error;
    }
  }

  const store = await readPlatformStore();
  const now = nowIso();
  const listing: Listing = { ...payload, id: createRecordId("listing"), createdAt: now, updatedAt: now };
  store.listings = [listing, ...store.listings];
  await writePlatformStore(store);
  return listing;
}

export async function updateListing(id: string, payload: Partial<ListingPayload>) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("listings").update(listingInsert(payload as ListingPayload)).eq("id", id).select("*").single();
      if (error) throw error;
      return mapListingRow(data as ListingRow);
    } catch (error) {
      if (!isRecoverableSupabaseError(error)) throw error;
    }
  }

  const store = await readPlatformStore();
  const current = store.listings.find((item) => item.id === id);
  if (!current) throw new Error("Listing not found.");
  const updated: Listing = { ...current, ...payload, updatedAt: nowIso() };
  store.listings = store.listings.map((item) => (item.id === id ? updated : item));
  await writePlatformStore(store);
  return updated;
}

export async function deleteListing(id: string) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
      return;
    } catch (error) {
      if (!isRecoverableSupabaseError(error)) throw error;
    }
  }

  const store = await readPlatformStore();
  store.listings = store.listings.filter((item) => item.id !== id);
  await writePlatformStore(store);
}

async function localGetClients(type?: Client["type"]) {
  const store = await readPlatformStore();
  return type ? store.clients.filter((client) => client.type === type) : store.clients;
}

export async function getClients(type?: Client["type"]) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return localGetClients(type);
  try {
    let query = supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (type) query = query.eq("client_type", type);
    const { data, error } = await query;
    if (error) throw error;
    return (data as ClientRow[]).map(mapClientRow);
  } catch (error) {
    if (isRecoverableSupabaseError(error)) return localGetClients(type);
    throw error;
  }
}

export async function createClientRecord(payload: ClientPayload) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("clients").insert(clientInsert(payload)).select("*").single();
      if (error) throw error;
      return mapClientRow(data as ClientRow);
    } catch (error) {
      if (!isRecoverableSupabaseError(error)) throw error;
    }
  }
  const store = await readPlatformStore();
  const now = nowIso();
  const client: Client = { ...payload, id: createRecordId("client"), createdAt: now, updatedAt: now };
  store.clients = [client, ...store.clients];
  await writePlatformStore(store);
  return client;
}

export async function updateClientRecord(id: string, payload: Partial<ClientPayload>) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("clients").update(clientInsert(payload as ClientPayload)).eq("id", id).select("*").single();
      if (error) throw error;
      return mapClientRow(data as ClientRow);
    } catch (error) {
      if (!isRecoverableSupabaseError(error)) throw error;
    }
  }
  const store = await readPlatformStore();
  const current = store.clients.find((item) => item.id === id);
  if (!current) throw new Error("Client not found.");
  const updated: Client = { ...current, ...payload, updatedAt: nowIso() };
  store.clients = store.clients.map((item) => (item.id === id ? updated : item));
  await writePlatformStore(store);
  return updated;
}

export async function deleteClientRecord(id: string) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      return;
    } catch (error) {
      if (!isRecoverableSupabaseError(error)) throw error;
    }
  }
  const store = await readPlatformStore();
  store.clients = store.clients.filter((item) => item.id !== id);
  await writePlatformStore(store);
}

export async function getInvestors() {
  const store = await readPlatformStore();
  return store.investors;
}

export async function createInvestor(payload: InvestorPayload) {
  const store = await readPlatformStore();
  const now = nowIso();
  const investor: Investor = { ...payload, id: createRecordId("investor"), createdAt: now, updatedAt: now };
  store.investors = [investor, ...store.investors];
  await writePlatformStore(store);
  return investor;
}

export async function updateInvestor(id: string, payload: Partial<InvestorPayload>) {
  const store = await readPlatformStore();
  const current = store.investors.find((item) => item.id === id);
  if (!current) throw new Error("Investor not found.");
  const updated: Investor = { ...current, ...payload, updatedAt: nowIso() };
  store.investors = store.investors.map((item) => (item.id === id ? updated : item));
  await writePlatformStore(store);
  return updated;
}

export async function deleteInvestor(id: string) {
  const store = await readPlatformStore();
  store.investors = store.investors.filter((item) => item.id !== id);
  await writePlatformStore(store);
}

export async function getVendors() {
  const store = await readPlatformStore();
  return store.vendors;
}

export async function createVendor(payload: VendorPayload) {
  const store = await readPlatformStore();
  const now = nowIso();
  const vendor: Vendor = { ...payload, id: createRecordId("vendor"), createdAt: now, updatedAt: now };
  store.vendors = [vendor, ...store.vendors];
  await writePlatformStore(store);
  return vendor;
}

export async function updateVendor(id: string, payload: Partial<VendorPayload>) {
  const store = await readPlatformStore();
  const current = store.vendors.find((item) => item.id === id);
  if (!current) throw new Error("Vendor not found.");
  const updated: Vendor = { ...current, ...payload, updatedAt: nowIso() };
  store.vendors = store.vendors.map((item) => (item.id === id ? updated : item));
  await writePlatformStore(store);
  return updated;
}

export async function deleteVendor(id: string) {
  const store = await readPlatformStore();
  store.vendors = store.vendors.filter((item) => item.id !== id);
  await writePlatformStore(store);
}

export async function getCampaigns() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return defaultCampaigns;
  try {
    const { data, error } = await supabase.from("campaign_templates").select("*").order("name");
    if (error) throw error;
    return (data as CampaignTemplate[] | null) ?? defaultCampaigns;
  } catch (error) {
    if (isRecoverableSupabaseError(error)) return defaultCampaigns;
    throw error;
  }
}

export async function seedPlatformData() {
  const store = await readPlatformStore();
  if (!store.listings.length || !store.clients.length) {
    await writePlatformStore({
      listings: defaultListings,
      clients: defaultClients,
      investors: defaultInvestors,
      vendors: defaultVendors,
      campaigns: defaultCampaigns
    });
  }
}
