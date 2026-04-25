"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckSquare,
  DollarSign,
  Download,
  House,
  Mail,
  MapPinned,
  Menu,
  Pencil,
  Paperclip,
  Plus,
  Search,
  Save,
  Send,
  Settings,
  Target,
  Trash2,
  Users,
  FileText,
  Eye,
  ExternalLink,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { GoogleMarketMap } from "@/components/google-market-map";
import { defaultGoals } from "@/lib/platform-data";
import {
  CampaignTemplate,
  Client,
  ClientPayload,
  Investor,
  InvestorPayload,
  Listing,
  ListingPayload,
  NavigationTab,
  Vendor,
  VendorPayload
} from "@/lib/types";
import { cn, currency, percent } from "@/lib/utils";

const navigation: { id: NavigationTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "for-sale", label: "For Sale", icon: House },
  { id: "for-rent", label: "For Rent", icon: Building2 },
  { id: "buyers", label: "Buyers", icon: Users },
  { id: "renters", label: "Renters", icon: Users },
  { id: "investors", label: "Investors", icon: DollarSign },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "scraping", label: "Scraping", icon: CheckSquare },
  { id: "property-stats", label: "Property Stats", icon: Search },
  { id: "previously-sold", label: "Previously Sold", icon: FileText },
  { id: "map", label: "Map View", icon: MapPinned },
  { id: "email", label: "Email", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings }
];

const rentalAmenityOptions = [
  "Pet Friendly",
  "Washer/Dryer In Unit",
  "Air Conditioning",
  "Dishwasher",
  "Parking Included",
  "Garage",
  "Pool",
  "Gym",
  "Furnished",
  "Balcony/Patio",
  "Wheelchair Accessible",
  "EV Charging",
  "Storage Unit"
];

const vendorCategoryOptions = [
  "Handyman",
  "Plumber",
  "Electrician",
  "HVAC Technician",
  "Locksmith",
  "Gardener / Landscaping",
  "Pool Cleaner",
  "Roofing",
  "Painter",
  "Appliance Repair"
];

const bedBathOptions = [0, 1, 2, 3, 4, 5, 6];

const previouslySoldListings: Listing[] = [
  {
    id: "sold-2026-1",
    type: "sale",
    title: "Provo Residential - 1241 N 3100 W",
    address: "1241 N 3100 W",
    city: "Provo",
    state: "UT",
    zipCode: "84601",
    neighborhood: "Provo",
    status: "Sold",
    propertyType: "Single Family",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1850,
    description: "Recently sold residential property",
    tags: ["Sold 2026"],
    highlight: "Buyer's Agent",
    amenities: [],
    photoUrls: [],
    soldDate: "2026-04-20",
    soldRole: "Buyer's Agent"
  },
  {
    id: "sold-2026-2",
    type: "sale",
    title: "Orem Residential - 1542 W 525 S",
    address: "1542 W 525 S",
    city: "Orem",
    state: "UT",
    zipCode: "84058",
    neighborhood: "Orem",
    status: "Sold",
    propertyType: "Single Family",
    price: 495000,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2100,
    description: "Recently sold residential property",
    tags: ["Sold 2026"],
    highlight: "Listing Agent",
    amenities: [],
    photoUrls: [],
    soldDate: "2026-02-05",
    soldRole: "Listing Agent"
  },
  {
    id: "sold-2026-3",
    type: "sale",
    title: "Mapleton Condo - 4655 S 720 W #i301",
    address: "4655 S 720 W #i301",
    city: "Mapleton",
    state: "UT",
    zipCode: "84664",
    neighborhood: "Mapleton",
    status: "Sold",
    propertyType: "Condo",
    price: 325000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: "Recently sold residential property",
    tags: ["Sold 2026"],
    highlight: "Buyer's Agent",
    amenities: [],
    photoUrls: [],
    soldDate: "2026-01-30",
    soldRole: "Buyer's Agent"
  },
  {
    id: "sold-2026-4",
    type: "sale",
    title: "Orem Residential - 1154 W 1340 N",
    address: "1154 W 1340 N",
    city: "Orem",
    state: "UT",
    zipCode: "84057",
    neighborhood: "Orem",
    status: "Sold",
    propertyType: "Single Family",
    price: 455000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1950,
    description: "Recently sold residential property",
    tags: ["Sold 2026"],
    highlight: "Buyer's Agent",
    amenities: [],
    photoUrls: [],
    soldDate: "2026-01-26",
    soldRole: "Buyer's Agent"
  },
  {
    id: "sold-2026-5",
    type: "sale",
    title: "Orem Residential - 171 E 200 N",
    address: "171 E 200 N",
    city: "Orem",
    state: "UT",
    zipCode: "84057",
    neighborhood: "Orem",
    status: "Sold",
    propertyType: "Single Family",
    price: 485000,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2050,
    description: "Recently sold residential property",
    tags: ["Sold 2026"],
    highlight: "Buyer's Agent",
    amenities: [],
    photoUrls: [],
    soldDate: "2026-01-16",
    soldRole: "Buyer's Agent"
  }
];

const listingStatusTone: Record<string, string> = {
  Active: "bg-[#f5efe1] text-[#84581c]",
  Pending: "bg-[#eef1f7] text-[#173b76]",
  Sold: "bg-[#e7f4eb] text-[#16603b]",
  Upcoming: "bg-[#eef1f7] text-[#173b76]",
  Leased: "bg-[#e7f4eb] text-[#16603b]"
};

const clientStatusTone: Record<string, string> = {
  New: "bg-[#f5efe1] text-[#84581c]",
  Touring: "bg-[#eef1f7] text-[#173b76]",
  Qualified: "bg-[#efe8dc] text-[#5b402f]",
  Application: "bg-[#eef1f7] text-[#173b76]",
  Closed: "bg-[#e7f4eb] text-[#16603b]"
};

function createListingDraft(type: "sale" | "rent"): ListingPayload {
  return {
    type,
    title: "",
    address: "",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "",
    neighborhood: "",
    status: "Active",
    propertyType: type === "sale" ? "Single Family" : "Apartment",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    lotSize: 0,
    yearBuilt: 0,
    stories: 1,
    parkingSpaces: 0,
    parkingFeatures: "",
    hoaDues: 0,
    description: "",
    tags: [],
    highlight: "",
    amenities: [],
    photoUrls: [],
    availableDate: "",
    securityDeposit: 0,
    applicationFee: 0,
    petFee: 0,
    utilitiesIncluded: [],
    listingTerms: [],
    mlsNumber: "",
    leaseTermMonths: type === "rent" ? 12 : undefined,
    petPolicy: type === "rent" ? "No pets" : undefined
  };
}

function createInvestorDraft(): InvestorPayload {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    investmentRange: 0,
    preferredAreas: [],
    assetTypes: [],
    notes: "",
    committed: false
  };
}

function createVendorDraft(): VendorPayload {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    category: vendorCategoryOptions[0],
    serviceAreas: [],
    address: "",
    notes: ""
  };
}

function createClientDraft(type: "buyer" | "renter"): ClientPayload {
  return {
    type,
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "New",
    budget: 0,
    timeline: "",
    priority: "Medium",
    preferredAreas: [],
    desiredPropertyTypes: [],
    minimumBedrooms: 0,
    minimumBathrooms: 0,
    preferenceSummary: "",
    notes: "",
    nextAction: ""
  };
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload as T;
}

export function RealEstateApp() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignTemplate[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [selectedRecipientEmail, setSelectedRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailAttachments, setEmailAttachments] = useState<Array<{ filename: string; contentType: string; data: string }>>([]);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [investorModalOpen, setInvestorModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingInvestorId, setEditingInvestorId] = useState<string | null>(null);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [listingDraft, setListingDraft] = useState<ListingPayload>(createListingDraft("sale"));
  const [clientDraft, setClientDraft] = useState<ClientPayload>(createClientDraft("buyer"));
  const [investorDraft, setInvestorDraft] = useState<InvestorPayload>(createInvestorDraft());
  const [vendorDraft, setVendorDraft] = useState<VendorPayload>(createVendorDraft());
  const [listingTagsText, setListingTagsText] = useState("");
  const [listingAmenitiesText, setListingAmenitiesText] = useState("");
  const [listingAmenitiesCustomText, setListingAmenitiesCustomText] = useState("");
  const [listingUtilitiesText, setListingUtilitiesText] = useState("");
  const [listingTermsText, setListingTermsText] = useState("");
  const [clientAreasText, setClientAreasText] = useState("");
  const [clientPropertyTypesText, setClientPropertyTypesText] = useState("");
  const [investorAreasText, setInvestorAreasText] = useState("");
  const [investorAssetTypesText, setInvestorAssetTypesText] = useState("");
  const [vendorAreasText, setVendorAreasText] = useState("");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeFormat, setScrapeFormat] = useState<"csv" | "xlsx">("csv");
  const [scrapedRows, setScrapedRows] = useState<Array<Record<string, string>>>([]);
  const [propertyStatsQuery, setPropertyStatsQuery] = useState("");
  const [propertyStatsNotes, setPropertyStatsNotes] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [rentalAmenities, setRentalAmenities] = useState<string[]>([]);
  const [bedBathCustomMin, setBedBathCustomMin] = useState<number | null>(null);
  const [bedBathCustomMax, setBedBathCustomMax] = useState<number | null>(null);
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    void refreshPlatformData();
  }, []);

  async function refreshPlatformData() {
    try {
      setError(null);
      const [listingResponse, clientResponse, campaignResponse, investorResponse, vendorResponse] = await Promise.all([
        requestJson<{ data: Listing[] }>("/api/listings"),
        requestJson<{ data: Client[] }>("/api/clients"),
        requestJson<{ data: CampaignTemplate[] }>("/api/campaigns"),
        requestJson<{ data: Investor[] }>("/api/investors"),
        requestJson<{ data: Vendor[] }>("/api/vendors")
      ]);

      setListings(listingResponse.data);
      setClients(clientResponse.data);
      setCampaigns(campaignResponse.data);
      setInvestors(investorResponse.data);
      setVendors(vendorResponse.data);
      setSelectedCampaignId((current) => current || campaignResponse.data[0]?.id || "");
      const contactEmails = [
        ...clientResponse.data.map((client) => client.email),
        ...investorResponse.data.map((investor) => investor.email),
        ...vendorResponse.data.map((vendor) => vendor.email)
      ].filter(Boolean);
      setSelectedRecipientEmail((current) => current || contactEmails[0] || "");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load platform data.");
    }
  }

  const filteredListings = useMemo(() => {
    const query = deferredSearch.toLowerCase();
    return listings.filter((listing) =>
      [listing.title, listing.address, listing.city, listing.neighborhood, listing.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [deferredSearch, listings]);

  const filteredClients = useMemo(() => {
    const query = deferredSearch.toLowerCase();
    return clients.filter((client) =>
      [client.name, client.email, client.phone, client.preferredAreas.join(" "), client.notes]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [clients, deferredSearch]);

  const saleListings = filteredListings.filter((listing) => listing.type === "sale");
  const rentalListings = filteredListings.filter((listing) => listing.type === "rent");
  const buyerClients = filteredClients.filter((client) => client.type === "buyer");
  const renterClients = filteredClients.filter((client) => client.type === "renter");
  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0];
  const selectedRecipient = [...clients, ...investors, ...vendors].find((contact) => contact.email === selectedRecipientEmail);

  const stats = useMemo(() => {
    return {
      activeListings: listings.filter((l) => l.status === "Active").length,
      clientProfiles: clients.length,
      saleInventory: listings.filter((l) => l.type === "sale").reduce((sum, l) => sum + l.price, 0),
      rentalInventory: listings.filter((l) => l.type === "rent").reduce((sum, l) => sum + l.price * 12, 0)
    };
  }, [listings, clients]);

  const marketSummary = useMemo(() => {
    const summary = new Map<string, number>();
    listings.forEach((listing) => {
      summary.set(listing.city, (summary.get(listing.city) ?? 0) + 1);
    });
    return Array.from(summary.entries()).sort((a, b) => b[1] - a[1]);
  }, [listings]);

  const dashboardTitle = useMemo(() => {
    const tabLabels: Record<NavigationTab, string> = {
      dashboard: "Dashboard",
      "for-sale": "For Sale Listings",
      "for-rent": "For Rent Listings",
      buyers: "Buyer Clients",
      renters: "Renter Clients",
      investors: "Investors",
      vendors: "Vendors",
      scraping: "Web Scraping",
      "property-stats": "Property Stats",
      "previously-sold": "Previously Sold",
      map: "Map View",
      email: "Email Campaigns",
      settings: "Settings"
    };
    return tabLabels[activeTab] || "Dashboard";
  }, [activeTab]);

  function openListingModal(type: "sale" | "rent", listing?: Listing) {
    if (listing) {
      setEditingListingId(listing.id);
      setListingDraft(listing);
      setListingTagsText(listing.tags.join(", "));
      setListingAmenitiesText(listing.amenities?.join(", ") ?? "");
      setListingUtilitiesText(listing.utilitiesIncluded?.join(", ") ?? "");
      setListingTermsText(listing.listingTerms?.join(", ") ?? "");
      setRentalAmenities(listing.amenities ?? []);
    } else {
      setEditingListingId(null);
      setListingDraft(createListingDraft(type));
      setListingTagsText("");
      setListingAmenitiesText("");
      setListingUtilitiesText("");
      setListingTermsText("");
      setRentalAmenities([]);
    }
    setListingModalOpen(true);
  }

  function openClientModal(type: "buyer" | "renter", client?: Client) {
    if (client) {
      setEditingClientId(client.id);
      setClientDraft(client);
      setClientAreasText(client.preferredAreas.join(", "));
      setClientPropertyTypesText(client.desiredPropertyTypes?.join(", ") ?? "");
    } else {
      setEditingClientId(null);
      setClientDraft(createClientDraft(type));
      setClientAreasText("");
      setClientPropertyTypesText("");
    }
    setClientModalOpen(true);
  }

  function openInvestorModal(investor?: Investor) {
    if (investor) {
      setEditingInvestorId(investor.id);
      setInvestorDraft(investor);
      setInvestorAreasText(investor.preferredAreas.join(", "));
      setInvestorAssetTypesText(investor.assetTypes.join(", "));
    } else {
      setEditingInvestorId(null);
      setInvestorDraft(createInvestorDraft());
      setInvestorAreasText("");
      setInvestorAssetTypesText("");
    }
    setInvestorModalOpen(true);
  }

  function openVendorModal(vendor?: Vendor) {
    if (vendor) {
      setEditingVendorId(vendor.id);
      setVendorDraft(vendor);
      setVendorAreasText(vendor.serviceAreas.join(", "));
    } else {
      setEditingVendorId(null);
      setVendorDraft(createVendorDraft());
      setVendorAreasText("");
    }
    setVendorModalOpen(true);
  }

  async function handleListingSubmit() {
    try {
      setBusyAction("listing");
      setError(null);
      const payload = {
        ...listingDraft,
        tags: listingTagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
        amenities: listingDraft.type === "rent" ? rentalAmenities : listingAmenitiesText.split(",").map((a) => a.trim()).filter(Boolean),
        utilitiesIncluded: listingUtilitiesText.split(",").map((u) => u.trim()).filter(Boolean),
        listingTerms: listingTermsText.split(",").map((t) => t.trim()).filter(Boolean)
      };

      if (editingListingId) {
        await requestJson(`/api/listings/${editingListingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Listing updated.");
      } else {
        await requestJson("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Listing created.");
      }

      setListingModalOpen(false);
      await refreshPlatformData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save listing.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleClientSubmit() {
    try {
      setBusyAction("client");
      setError(null);
      const payload = {
        ...clientDraft,
        preferredAreas: clientAreasText
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean),
        desiredPropertyTypes: clientPropertyTypesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      if (editingClientId) {
        await requestJson(`/api/clients/${editingClientId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Client updated.");
      } else {
        await requestJson("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Client created.");
      }

      setClientModalOpen(false);
      await refreshPlatformData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save client.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleInvestorSubmit() {
    try {
      setBusyAction("investor");
      setError(null);
      const payload = {
        ...investorDraft,
        preferredAreas: investorAreasText.split(",").map((item) => item.trim()).filter(Boolean),
        assetTypes: investorAssetTypesText.split(",").map((item) => item.trim()).filter(Boolean)
      };
      if (editingInvestorId) {
        await requestJson(`/api/investors/${editingInvestorId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Investor updated.");
      } else {
        await requestJson("/api/investors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Investor created.");
      }
      setInvestorModalOpen(false);
      await refreshPlatformData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save investor.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleVendorSubmit() {
    try {
      setBusyAction("vendor");
      setError(null);
      const payload = {
        ...vendorDraft,
        serviceAreas: vendorAreasText.split(",").map((item) => item.trim()).filter(Boolean)
      };
      if (editingVendorId) {
        await requestJson(`/api/vendors/${editingVendorId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Vendor updated.");
      } else {
        await requestJson("/api/vendors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        setNotice("Vendor created.");
      }
      setVendorModalOpen(false);
      await refreshPlatformData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save vendor.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDelete(path: string, successMessage: string) {
    if (!window.confirm("Delete this record?")) {
      return;
    }

    try {
      setBusyAction(path);
      setError(null);
      await requestJson(path, { method: "DELETE" });
      setNotice(successMessage);
      await refreshPlatformData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to delete record.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleSeedSupabase() {
    try {
      setBusyAction("seed");
      setError(null);
      await requestJson("/api/platform/bootstrap", { method: "POST" });
      setNotice("Supabase seed completed.");
      await refreshPlatformData();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to seed Supabase.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleSendTestEmail() {
    if (!selectedRecipient || !selectedCampaign) {
      return;
    }

    try {
      setBusyAction("email");
      setError(null);
      await requestJson("/api/billionmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: selectedRecipient.email,
          attribs: {
            first_name: selectedRecipient.name.split(" ")[0] ?? selectedRecipient.name,
            username: selectedRecipient.name.split(" ")[0] ?? selectedRecipient.name
          }
        })
      });
      setNotice(`BillionMail request sent to ${selectedRecipient.email}.`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to send test email.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleScrapeContacts() {
    if (!scrapeUrl.trim()) {
      setError("Please enter a URL to scrape.");
      return;
    }

    try {
      setScrapingLoading(true);
      setError(null);
      const response = await requestJson<{ source: string; count: number; data: Array<Record<string, string>> }>("/api/scrape/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl })
      });

      setScrapedRows(response.data);
      setNotice(`Successfully scraped ${response.count} contacts from the page.`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to scrape contacts.");
    } finally {
      setScrapingLoading(false);
    }
  }

  function downloadScrapedData() {
    if (scrapedRows.length === 0) {
      setError("No data to download.");
      return;
    }

    try {
      if (scrapeFormat === "csv") {
        const headers = Object.keys(scrapedRows[0] || {});
        const csv = [
          headers.join(","),
          ...scrapedRows.map((row) => headers.map((h) => `"${(row[h] || "").replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `scraped_contacts_${new Date().getTime()}.csv`;
        link.click();
      } else {
        // For XLSX, we'd need a library like xlsx, but for now show a message
        setNotice("XLSX export requires additional setup. CSV export is available.");
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to download data.");
    }
  }

  function sendEmailToContact(email: string) {
    setSelectedRecipientEmail(email);
    setActiveTab("email");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-border bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[300px] lg:border-b-0 lg:border-r lg:overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-7 lg:py-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/sergio-listings-logo.png"
                  alt="Sergio's Listings logo"
                  width={68}
                  height={68}
                  className="h-16 w-16 rounded-2xl object-contain"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#84581c]">Utah Real Estate SaaS</p>
                  <h1 className="font-brand text-4xl leading-none text-primary">Sergio&apos;s Listings</h1>
                </div>
              </div>
              <p className="max-w-[18rem] text-sm text-muted-foreground">
                Live local workspace for listings, clients, campaigns, maps, and settings.
              </p>
            </div>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary lg:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className={cn("px-3 pb-4 lg:block lg:px-4", mobileMenuOpen ? "block" : "hidden")}>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeTab;
                return (
                  <button
                    key={item.id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
                      active ? "bg-primary text-white shadow-soft" : "text-[#30435d] hover:bg-[#f5f6f9]"
                    )}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 rounded-[28px] border border-[#efe3c9] bg-[#fffaf1] p-4 text-sm text-[#6c532d]">
              Supabase CRUD is wired through server routes. Google Maps and BillionMail turn live when their env keys are added.
            </div>
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header className="mb-6 rounded-[28px] border border-border bg-white px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#84581c]">Command Center</p>
                <h2 className="mt-2 text-3xl font-semibold text-primary">{dashboardTitle}</h2>
              </div>
              <input
                className="rounded-full border border-border bg-[#fbfbfc] px-4 py-3 text-sm outline-none md:min-w-[320px]"
                placeholder="Search listings or clients"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <QuickStat icon={House} label="Active Listings" value={stats.activeListings.toString()} />
              <QuickStat icon={Users} label="Client Profiles" value={stats.clientProfiles.toString()} />
              <QuickStat icon={DollarSign} label="Sale Inventory" value={currency(stats.saleInventory)} />
              <QuickStat icon={Target} label="Rental Inventory" value={currency(stats.rentalInventory)} />
            </div>

            {(notice || error) && (
              <div className={cn("mt-5 rounded-[20px] px-4 py-3 text-sm", error ? "bg-[#fff4f4] text-[#9d3030]" : "bg-[#eef7ef] text-[#1f6a39]")}>
                {error ?? notice}
              </div>
            )}
          </header>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === "dashboard" && (
              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
                <Panel>
                  <SectionHeading title="Revenue and Transaction Goals" description="Live dashboard view over the same records managed in the tabs below." />
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {defaultGoals.map((goal) => (
                      <div key={goal.label} className="rounded-[22px] border border-border bg-[#fcfcfd] p-4">
                        <p className="text-sm text-muted-foreground">{goal.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-primary">{goal.current}</p>
                        <div className="mt-4 h-2 rounded-full bg-[#e8ecf3]">
                          <div className="h-2 rounded-full bg-[#c88b2a]" style={{ width: `${goal.progress}%` }} />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">Target {goal.target}</p>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel>
                  <SectionHeading title="Market Coverage" description="Current listing counts grouped by city." />
                  <div className="mt-6 space-y-3">
                    {marketSummary.map(([city, count]) => (
                      <div key={city} className="flex items-center justify-between rounded-[20px] bg-[#f7f8fb] px-4 py-3">
                        <span className="font-medium text-primary">{city}</span>
                        <span className="text-sm text-muted-foreground">{count} active records</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {(activeTab === "for-sale" || activeTab === "for-rent") && (
              <Panel>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <SectionHeading
                    title={activeTab === "for-sale" ? "For Sale Properties" : "For Rent Properties"}
                    description="Real CRUD against Supabase/Postgres through Next.js API routes."
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c88b2a] px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => openListingModal(activeTab === "for-sale" ? "sale" : "rent")}
                  >
                    <Plus className="h-4 w-4" />
                    Add {activeTab === "for-sale" ? "Sale" : "Rental"} Listing
                  </button>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {(activeTab === "for-sale" ? saleListings : rentalListings).map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onEdit={() => openListingModal(listing.type, listing)}
                      onDelete={() => void handleDelete(`/api/listings/${listing.id}`, "Listing deleted.")}
                    />
                  ))}
                </div>
              </Panel>
            )}

            {(activeTab === "buyers" || activeTab === "renters") && (
              <Panel>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <SectionHeading
                    title={activeTab === "buyers" ? "Buyer Clients" : "Renter Clients"}
                    description="Create, edit, and delete client records directly in Supabase."
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c88b2a] px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => openClientModal(activeTab === "buyers" ? "buyer" : "renter")}
                  >
                    <Plus className="h-4 w-4" />
                    Add {activeTab === "buyers" ? "Buyer" : "Renter"}
                  </button>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {(activeTab === "buyers" ? buyerClients : renterClients).map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onEdit={() => openClientModal(client.type, client)}
                      onDelete={() => void handleDelete(`/api/clients/${client.id}`, "Client deleted.")}
                      onEmailClick={() => sendEmailToContact(client.email)}
                    />
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === "investors" && (
              <Panel>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <SectionHeading
                    title="Investors"
                    description="Track committed capital, preferred markets, and target asset classes."
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c88b2a] px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => openInvestorModal()}
                  >
                    <Plus className="h-4 w-4" />
                    Add Investor
                  </button>
                </div>
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {investors.map((investor) => (
                    <InvestorCard
                      key={investor.id}
                      investor={investor}
                      onEdit={() => openInvestorModal(investor)}
                      onDelete={() => void handleDelete(`/api/investors/${investor.id}`, "Investor deleted.")}
                      onEmailClick={() => sendEmailToContact(investor.email)}
                    />
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === "vendors" && (
              <Panel>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <SectionHeading
                    title="Vendors"
                    description="Keep contractor and service provider contacts organized by trade and service area."
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c88b2a] px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => openVendorModal()}
                  >
                    <Plus className="h-4 w-4" />
                    Add Vendor
                  </button>
                </div>
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {vendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onEdit={() => openVendorModal(vendor)}
                      onDelete={() => void handleDelete(`/api/vendors/${vendor.id}`, "Vendor deleted.")}
                      onEmailClick={() => sendEmailToContact(vendor.email)}
                    />
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === "map" && (
              <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <Panel>
                  <SectionHeading title="Google Maps Coverage" description="Uses the Google Maps JavaScript API when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is present." />
                  <div className="mt-6">
                    <GoogleMarketMap listings={listings} />
                  </div>
                </Panel>

                <Panel>
                  <SectionHeading title="Mapped Listings" description="The current records feeding the live map markers." />
                  <div className="mt-6 space-y-3">
                    {listings.map((listing) => (
                      <div key={listing.id} className="rounded-[20px] bg-[#f7f8fb] px-4 py-3">
                        <p className="font-medium text-primary">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.city} • {listing.type === "sale" ? currency(listing.price) : `${currency(listing.price)}/mo`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === "email" && (
              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <Panel>
                  <SectionHeading title="Campaign Templates" description="Live campaign records from Supabase, or local defaults before setup." />
                  <div className="mt-6 space-y-3">
                    {campaigns.map((campaign) => (
                      <button
                        key={campaign.id}
                        className={cn(
                          "w-full rounded-[22px] border px-4 py-4 text-left transition",
                          campaign.id === selectedCampaignId ? "border-primary bg-[#f5f8fd]" : "border-border bg-[#fcfcfd]"
                        )}
                        onClick={() => setSelectedCampaignId(campaign.id)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-primary">{campaign.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{campaign.audience}</p>
                          </div>
                          <span className="rounded-full bg-[#fffaf1] px-3 py-1 text-xs font-semibold text-[#84581c]">{campaign.status}</span>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <MetricChip label="Sent" value={campaign.sent.toString()} />
                          <MetricChip label="Open" value={percent(campaign.opened, campaign.sent)} />
                          <MetricChip label="Reply" value={percent(campaign.replied, campaign.sent)} />
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>

                <Panel>
                  <SectionHeading title={selectedCampaign?.name ?? "Email"} description="BillionMail is connected through `/api/billionmail/send`." />
                  {selectedCampaign && (
                    <>
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <InfoTile label="Audience" value={selectedCampaign.audience} />
                        <InfoTile label="Subject" value={selectedCampaign.subject} />
                      </div>

                      <label className="mt-6 block text-sm font-medium text-primary">
                        Test Recipient
                        <select
                          className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                          value={selectedRecipientEmail}
                          onChange={(event) => setSelectedRecipientEmail(event.target.value)}
                        >
                          {[...clients, ...investors, ...vendors].map((recipient) => (
                            <option key={`${recipient.email}-${recipient.name}`} value={recipient.email}>
                              {recipient.name} ({recipient.email})
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="mt-6 rounded-[24px] border border-border bg-[#fcfcfd] p-5">
                        <p className="whitespace-pre-line text-sm leading-7 text-[#415166]">{selectedCampaign.body}</p>
                      </div>

                      <button
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                        onClick={() => void handleSendTestEmail()}
                        disabled={busyAction === "email"}
                      >
                        <Mail className="h-4 w-4" />
                        {busyAction === "email" ? "Sending..." : "Send Test with BillionMail"}
                      </button>
                    </>
                  )}
                </Panel>
              </div>
            )}

            {activeTab === "scraping" && (
              <Panel>
                <SectionHeading
                  title="Web Scraping"
                  description="Extract contact information from public websites and export as CSV or XLSX."
                />

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary">
                      Public Website URL
                      <input
                        className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                        type="url"
                        placeholder="https://example.com/directory"
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-[#c88b2a] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      onClick={() => void handleScrapeContacts()}
                      disabled={scrapingLoading || !scrapeUrl.trim()}
                    >
                      <Search className="h-4 w-4" />
                      {scrapingLoading ? "Scraping..." : "Scrape Contacts"}
                    </button>

                    {scrapedRows.length > 0 && (
                      <>
                        <button
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-primary"
                          onClick={() => setScrapeFormat("csv")}
                        >
                          <Download className="h-4 w-4" />
                          CSV
                        </button>
                        <button
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-primary"
                          onClick={() => downloadScrapedData()}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </>
                    )}
                  </div>

                  {scrapedRows.length > 0 && (
                    <div className="mt-6 overflow-x-auto rounded-[20px] border border-border">
                      <table className="w-full text-sm">
                        <thead className="border-b border-border bg-[#f7f8fb]">
                          <tr>
                            {Object.keys(scrapedRows[0] || {}).map((key) => (
                              <th key={key} className="px-4 py-3 text-left font-semibold text-primary">
                                {key}
                              </th>
                            ))}
                            <th className="px-4 py-3 text-left font-semibold text-primary">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scrapedRows.slice(0, 20).map((row, idx) => (
                            <tr key={idx} className="border-b border-border hover:bg-[#f7f8fb]">
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="px-4 py-3 text-[#415166]">
                                  {val}
                                </td>
                              ))}
                              <td className="px-4 py-3">
                                {row.email && (
                                  <button
                                    className="text-xs font-medium text-primary hover:underline"
                                    onClick={() => sendEmailToContact(row.email)}
                                  >
                                    Email
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {scrapedRows.length > 20 && (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                          Showing 20 of {scrapedRows.length} results. Download to see all.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
            )}

            {activeTab === "property-stats" && (
              <Panel>
                <SectionHeading
                  title="Property Stats & Market Analysis"
                  description="Search and analyze properties using Walker & Dunlop WDSuite platform data."
                />

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary">
                      Property Search Query
                      <input
                        className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                        placeholder="Search by property name or address"
                        value={propertyStatsQuery}
                        onChange={(e) => setPropertyStatsQuery(e.target.value)}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary">
                      Analysis Notes
                      <textarea
                        className="mt-2 min-h-24 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                        placeholder="Add your analysis notes here..."
                        value={propertyStatsNotes}
                        onChange={(e) => setPropertyStatsNotes(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="rounded-[24px] border border-[#efe3c9] bg-[#fffaf1] p-5 text-sm text-[#6c532d]">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Walker & Dunlop Suite Workspace</p>
                        <p className="mt-1">
                          Use the embedded workspace below for quick access. If the provider blocks embedding, open the full suite in a new tab.
                          For security, login is handled by your browser/account session (no password is stored in this app).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border bg-white p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-primary">WDSuite Live Window</p>
                      <button
                        className="inline-flex items-center gap-2 rounded-full bg-[#c88b2a] px-4 py-2 text-xs font-semibold text-white"
                        onClick={() => window.open("https://suite.walkerdunlop.com/dashboard", "_blank", "noopener,noreferrer")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in New Tab
                      </button>
                    </div>
                    <iframe
                      title="Walker and Dunlop Suite"
                      src="https://suite.walkerdunlop.com/dashboard"
                      className="h-[560px] w-full rounded-[18px] border border-border bg-white"
                    />
                    <p className="mt-3 text-xs text-muted-foreground">
                      If this frame appears blank or shows a blocked message, the external site is preventing embedding. Use "Open in New Tab".
                    </p>
                  </div>
                </div>
              </Panel>
            )}

            {activeTab === "previously-sold" && (
              <Panel>
                <SectionHeading
                  title="Previously Sold Listings"
                  description="Historical record of properties sold by Sergio Armenta in 2025 and 2026."
                />

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {previouslySoldListings.map((listing) => (
                    <SoldListingCard
                      key={listing.id}
                      listing={listing}
                    />
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === "settings" && (
              <div className="grid gap-6 xl:grid-cols-2">
                <Panel>
                  <SectionHeading title="Supabase and Postgres" description="Apply the SQL schema, set env vars, then seed the app from the button below." />
                  <div className="mt-6 space-y-3">
                    <EnvRow label="NEXT_PUBLIC_SUPABASE_URL" ready={Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)} />
                    <EnvRow label="NEXT_PUBLIC_SUPABASE_ANON_KEY" ready={Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)} />
                    <EnvRow label="SUPABASE_SERVICE_ROLE_KEY" ready={false} helper="Server-side key is required in `.env.local`." />
                    <EnvRow label="Schema File" ready helper="Use `supabase/sergios_listings_schema.sql` in the Supabase SQL editor." />
                  </div>
                  <button
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c88b2a] px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => void handleSeedSupabase()}
                    disabled={busyAction === "seed"}
                  >
                    <Save className="h-4 w-4" />
                    {busyAction === "seed" ? "Seeding..." : "Seed Supabase Tables"}
                  </button>
                </Panel>

                <Panel>
                  <SectionHeading title="Google Maps and BillionMail" description="Both integrations are coded and become live when these variables are added." />
                  <div className="mt-6 space-y-3">
                    <EnvRow label="NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" ready={Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)} />
                    <EnvRow label="BILLIONMAIL_API_URL" ready={false} helper="Server-side only." />
                    <EnvRow label="BILLIONMAIL_API_KEY" ready={false} helper="Server-side only." />
                    <EnvRow label="BILLIONMAIL_SEND_ENDPOINT" ready={false} helper="Defaults to `/api/batch_mail/api/send`." />
                  </div>
                  <div className="mt-6 rounded-[24px] bg-[#fffaf1] p-5 text-sm leading-7 text-[#6c532d]">
                    BillionMail is wired to the official documented send endpoint using the `X-API-Key` header. Google Maps is wired with the JavaScript API for live map rendering and markers.
                  </div>
                </Panel>
              </div>
            )}
          </motion.div>
        </section>
      </div>

      {listingModalOpen && (
        <ModalShell title={editingListingId ? "Edit Listing" : "New Listing"} onClose={() => setListingModalOpen(false)}>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Type"
                value={listingDraft.type}
                onChange={(value) => setListingDraft((current) => ({ ...current, type: value as "sale" | "rent" }))}
                options={[
                  { label: "For Sale", value: "sale" },
                  { label: "Rent", value: "rent" }
                ]}
              />
              <TextField label="Title" value={listingDraft.title} onChange={(value) => setListingDraft((current) => ({ ...current, title: value }))} />
              <TextField label="Address" value={listingDraft.address} onChange={(value) => setListingDraft((current) => ({ ...current, address: value }))} />
              <TextField label="City" value={listingDraft.city} onChange={(value) => setListingDraft((current) => ({ ...current, city: value }))} />
              <TextField label="State" value={listingDraft.state ?? "UT"} onChange={(value) => setListingDraft((current) => ({ ...current, state: value }))} />
              <TextField label="ZIP Code" value={listingDraft.zipCode ?? ""} onChange={(value) => setListingDraft((current) => ({ ...current, zipCode: value }))} />
              <TextField label="Neighborhood" value={listingDraft.neighborhood} onChange={(value) => setListingDraft((current) => ({ ...current, neighborhood: value }))} />
              <TextField label="Status" value={listingDraft.status} onChange={(value) => setListingDraft((current) => ({ ...current, status: value }))} />
              <TextField label="Property Type" value={listingDraft.propertyType} onChange={(value) => setListingDraft((current) => ({ ...current, propertyType: value }))} placeholder="Single Family, Condo, Townhome..." />
              <FormattedNumberField label={listingDraft.type === "sale" ? "List Price" : "Monthly Rent"} value={listingDraft.price} onChange={(value) => setListingDraft((current) => ({ ...current, price: value }))} />

              <div>
                <label className="block text-sm font-medium text-primary">
                  Bedrooms
                  <select
                    className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                    value={listingDraft.bedrooms}
                    onChange={(e) => setListingDraft((current) => ({ ...current, bedrooms: Number(e.target.value) }))}
                  >
                    {bedBathOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {bedBathCustomMin !== null && bedBathCustomMin > 6 && <option value={bedBathCustomMin}>{bedBathCustomMin}+</option>}
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary">
                  Bathrooms
                  <select
                    className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                    value={listingDraft.bathrooms}
                    onChange={(e) => setListingDraft((current) => ({ ...current, bathrooms: Number(e.target.value) }))}
                  >
                    {bedBathOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {bedBathCustomMax !== null && bedBathCustomMax > 6 && <option value={bedBathCustomMax}>{bedBathCustomMax}+</option>}
                  </select>
                </label>
              </div>

              <FormattedNumberField label="Square Feet" value={listingDraft.squareFeet} onChange={(value) => setListingDraft((current) => ({ ...current, squareFeet: value }))} />
              <FormattedNumberField label="Lot Size (sq ft)" value={listingDraft.lotSize ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, lotSize: value }))} />
              <FormattedNumberField label="Year Built" value={listingDraft.yearBuilt ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, yearBuilt: value }))} />
              <FormattedNumberField label="Stories" value={listingDraft.stories ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, stories: value }))} />
              <FormattedNumberField label="Parking Spaces" value={listingDraft.parkingSpaces ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, parkingSpaces: value }))} />
              <TextField label="Parking Details" value={listingDraft.parkingFeatures ?? ""} onChange={(value) => setListingDraft((current) => ({ ...current, parkingFeatures: value }))} />
              <FormattedNumberField label="HOA Dues" value={listingDraft.hoaDues ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, hoaDues: value }))} />
              <TextField label="Tags" value={listingTagsText} onChange={setListingTagsText} placeholder="comma, separated, tags" />
              
              <div>
                <label className="block text-sm font-medium text-primary">
                  Photo URLs
                  <input
                    className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
                    type="text"
                    placeholder="https://..., https://..."
                    value={(listingDraft.photoUrls ?? []).join(", ")}
                    onChange={(e) => setListingDraft((current) => ({ ...current, photoUrls: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))}
                  />
                </label>
              </div>

              {listingDraft.type === "sale" ? (
                <>
                  <TextField label="MLS Number" value={listingDraft.mlsNumber ?? ""} onChange={(value) => setListingDraft((current) => ({ ...current, mlsNumber: value }))} />
                  <TextField label="Listing Terms" value={listingTermsText} onChange={setListingTermsText} placeholder="Cash, Conventional, FHA" />
                </>
              ) : (
                <>
                  <TextField label="Available Date" value={listingDraft.availableDate ?? ""} onChange={(value) => setListingDraft((current) => ({ ...current, availableDate: value }))} placeholder="2026-05-01" />
                  <FormattedNumberField label="Security Deposit" value={listingDraft.securityDeposit ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, securityDeposit: value }))} />
                  <FormattedNumberField label="Application Fee" value={listingDraft.applicationFee ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, applicationFee: value }))} />
                  <FormattedNumberField label="Pet Fee" value={listingDraft.petFee ?? 0} onChange={(value) => setListingDraft((current) => ({ ...current, petFee: value }))} />
                  <FormattedNumberField label="Lease Term Months" value={listingDraft.leaseTermMonths ?? 12} onChange={(value) => setListingDraft((current) => ({ ...current, leaseTermMonths: value }))} />
                  <TextField label="Pet Policy" value={listingDraft.petPolicy ?? ""} onChange={(value) => setListingDraft((current) => ({ ...current, petPolicy: value }))} />
                  <TextField label="Utilities Included" value={listingUtilitiesText} onChange={setListingUtilitiesText} placeholder="Water, Trash, Sewer" />
                </>
              )}
            </div>

            {listingDraft.type === "rent" && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-primary">Rental Amenities</label>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {rentalAmenityOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rentalAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRentalAmenities([...rentalAmenities, amenity]);
                          } else {
                            setRentalAmenities(rentalAmenities.filter((a) => a !== amenity));
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-primary">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <TextAreaField label="Description" value={listingDraft.description} onChange={(value) => setListingDraft((current) => ({ ...current, description: value }))} />
            <TextAreaField label="Highlight" value={listingDraft.highlight} onChange={(value) => setListingDraft((current) => ({ ...current, highlight: value }))} />
            <ModalActions onCancel={() => setListingModalOpen(false)} onSave={() => void handleListingSubmit()} busy={busyAction === "listing"} />
          </div>
        </ModalShell>
      )}

      {clientModalOpen && (
        <ModalShell title={editingClientId ? "Edit Client" : "New Client"} onClose={() => setClientModalOpen(false)}>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Type" value={clientDraft.type} onChange={(value) => setClientDraft((current) => ({ ...current, type: value as "buyer" | "renter" }))} options={["buyer", "renter"]} />
              <TextField label="Name" value={clientDraft.name} onChange={(value) => setClientDraft((current) => ({ ...current, name: value }))} />
              <TextField label="Email" value={clientDraft.email} onChange={(value) => setClientDraft((current) => ({ ...current, email: value }))} />
              <TextField label="Phone" value={clientDraft.phone} onChange={(value) => setClientDraft((current) => ({ ...current, phone: value }))} />
              <TextField label="Address" value={clientDraft.address ?? ""} onChange={(value) => setClientDraft((current) => ({ ...current, address: value }))} />
              <TextField label="Status" value={clientDraft.status} onChange={(value) => setClientDraft((current) => ({ ...current, status: value }))} />
              <FormattedNumberField label="Budget" value={clientDraft.budget} onChange={(value) => setClientDraft((current) => ({ ...current, budget: value }))} />
              <TextField label="Timeline" value={clientDraft.timeline} onChange={(value) => setClientDraft((current) => ({ ...current, timeline: value }))} />
              <TextField label="Priority" value={clientDraft.priority} onChange={(value) => setClientDraft((current) => ({ ...current, priority: value }))} />
              <TextField label="Preferred Areas" value={clientAreasText} onChange={setClientAreasText} placeholder="Salt Lake City, Murray, Draper" />
              <TextField label="Required Property Types" value={clientPropertyTypesText} onChange={setClientPropertyTypesText} placeholder="Single Family, Condo, Custom..." />
              <FormattedNumberField label="Minimum Bedrooms" value={clientDraft.minimumBedrooms ?? 0} onChange={(value) => setClientDraft((current) => ({ ...current, minimumBedrooms: value }))} />
              <FormattedNumberField label="Minimum Bathrooms" value={clientDraft.minimumBathrooms ?? 0} onChange={(value) => setClientDraft((current) => ({ ...current, minimumBathrooms: value }))} allowDecimal />
            </div>
            <TextAreaField label="Preference Summary" value={clientDraft.preferenceSummary} onChange={(value) => setClientDraft((current) => ({ ...current, preferenceSummary: value }))} />
            <TextAreaField label="Notes" value={clientDraft.notes} onChange={(value) => setClientDraft((current) => ({ ...current, notes: value }))} />
            <TextAreaField label="Next Action" value={clientDraft.nextAction} onChange={(value) => setClientDraft((current) => ({ ...current, nextAction: value }))} />
            <ModalActions onCancel={() => setClientModalOpen(false)} onSave={() => void handleClientSubmit()} busy={busyAction === "client"} />
          </div>
        </ModalShell>
      )}

      {investorModalOpen && (
        <ModalShell title={editingInvestorId ? "Edit Investor" : "New Investor"} onClose={() => setInvestorModalOpen(false)}>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Name" value={investorDraft.name} onChange={(value) => setInvestorDraft((current) => ({ ...current, name: value }))} />
              <TextField label="Company" value={investorDraft.company} onChange={(value) => setInvestorDraft((current) => ({ ...current, company: value }))} />
              <TextField label="Email" value={investorDraft.email} onChange={(value) => setInvestorDraft((current) => ({ ...current, email: value }))} />
              <TextField label="Phone" value={investorDraft.phone} onChange={(value) => setInvestorDraft((current) => ({ ...current, phone: value }))} />
              <FormattedNumberField label="Committed Amount" value={investorDraft.investmentRange} onChange={(value) => setInvestorDraft((current) => ({ ...current, investmentRange: value }))} />
              <TextField label="Preferred Areas" value={investorAreasText} onChange={setInvestorAreasText} placeholder="Salt Lake City, Draper" />
              <TextField label="Asset Types" value={investorAssetTypesText} onChange={setInvestorAssetTypesText} placeholder="Fix and Flip, Multifamily, Custom..." />
              <SelectField label="Committed" value={investorDraft.committed ? "Yes" : "No"} onChange={(value) => setInvestorDraft((current) => ({ ...current, committed: value === "Yes" }))} options={["Yes", "No"]} />
            </div>
            <TextAreaField label="Notes" value={investorDraft.notes} onChange={(value) => setInvestorDraft((current) => ({ ...current, notes: value }))} />
            <ModalActions onCancel={() => setInvestorModalOpen(false)} onSave={() => void handleInvestorSubmit()} busy={busyAction === "investor"} />
          </div>
        </ModalShell>
      )}

      {vendorModalOpen && (
        <ModalShell title={editingVendorId ? "Edit Vendor" : "New Vendor"} onClose={() => setVendorModalOpen(false)}>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Name" value={vendorDraft.name} onChange={(value) => setVendorDraft((current) => ({ ...current, name: value }))} />
              <TextField label="Company" value={vendorDraft.company} onChange={(value) => setVendorDraft((current) => ({ ...current, company: value }))} />
              <TextField label="Email" value={vendorDraft.email} onChange={(value) => setVendorDraft((current) => ({ ...current, email: value }))} />
              <TextField label="Phone" value={vendorDraft.phone} onChange={(value) => setVendorDraft((current) => ({ ...current, phone: value }))} />
              <SelectField
                label="Category"
                value={vendorDraft.category}
                onChange={(value) => setVendorDraft((current) => ({ ...current, category: value }))}
                options={vendorCategoryOptions}
              />
              <TextField label="Service Areas" value={vendorAreasText} onChange={setVendorAreasText} placeholder="Salt Lake City, Murray, Sandy" />
              <TextField label="Address" value={vendorDraft.address} onChange={(value) => setVendorDraft((current) => ({ ...current, address: value }))} />
            </div>
            <TextAreaField label="Notes" value={vendorDraft.notes} onChange={(value) => setVendorDraft((current) => ({ ...current, notes: value }))} />
            <ModalActions onCancel={() => setVendorModalOpen(false)} onSave={() => void handleVendorSubmit()} busy={busyAction === "vendor"} />
          </div>
        </ModalShell>
      )}
    </main>
  );
}

function QuickStat({ icon: Icon, label, value }: { icon: typeof House; label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border bg-[#fcfcfd] px-4 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-[#84581c]" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="rounded-[32px] border border-border bg-white p-5 shadow-soft sm:p-6">{children}</section>;
}

function ListingCard({
  listing,
  onEdit,
  onDelete
}: {
  listing: Listing;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-[26px] border border-border bg-[#fcfcfd] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#84581c]">{listing.neighborhood}</p>
          <h4 className="mt-2 text-2xl font-semibold text-primary">{listing.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            {listing.address}, {listing.city}
          </p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", listingStatusTone[listing.status] ?? "bg-[#eef1f7] text-primary")}>
          {listing.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile label={listing.type === "sale" ? "List Price" : "Monthly Rent"} value={currency(listing.price)} />
        <InfoTile label="Beds / Baths" value={`${listing.bedrooms} / ${listing.bathrooms}`} />
        <InfoTile label="Square Feet" value={listing.squareFeet.toLocaleString()} />
        <InfoTile label={listing.type === "sale" ? "MLS" : "Lease"} value={listing.type === "sale" ? listing.mlsNumber ?? "None" : `${listing.leaseTermMonths ?? 12} mo`} />
      </div>

      <p className="mt-5 text-sm leading-6 text-[#4f5c6d]">{listing.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {listing.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#dde2ec] px-3 py-1 text-xs font-medium text-[#526273]">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoTile label="Year Built" value={listing.yearBuilt ? listing.yearBuilt.toString() : "—"} />
        <InfoTile label="Lot Size" value={listing.lotSize ? `${listing.lotSize.toLocaleString()} sq ft` : "—"} />
        <InfoTile label="Parking" value={listing.parkingFeatures ?? "—"} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#f0d5d5] px-4 py-2 text-sm font-medium text-[#9d3030]" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}

function SoldListingCard({
  listing
}: {
  listing: Listing;
}) {
  return (
    <article className="rounded-[26px] border border-border bg-[#fcfcfd] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#84581c]">{listing.neighborhood}</p>
          <h4 className="mt-2 text-2xl font-semibold text-primary">{listing.title}</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            {listing.address}, {listing.city}
          </p>
        </div>
        <span className="rounded-full bg-[#e7f4eb] px-3 py-1 text-xs font-semibold text-[#16603b]">
          {listing.soldRole}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile label="Sale Price" value={currency(listing.price)} />
        <InfoTile label="Beds / Baths" value={`${listing.bedrooms} / ${listing.bathrooms}`} />
        <InfoTile label="Square Feet" value={listing.squareFeet.toLocaleString()} />
        <InfoTile label="Sold Date" value={listing.soldDate ? new Date(listing.soldDate).toLocaleDateString() : "—"} />
      </div>

      <p className="mt-5 text-sm leading-6 text-[#4f5c6d]">{listing.description}</p>
    </article>
  );
}

function ClientCard({
  client,
  onEdit,
  onDelete,
  onEmailClick
}: {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onEmailClick: () => void;
}) {
  return (
    <article className="rounded-[26px] border border-border bg-[#fcfcfd] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#84581c]">{client.type === "buyer" ? "Buyer profile" : "Renter profile"}</p>
          <h4 className="mt-2 text-2xl font-semibold text-primary">{client.name}</h4>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{client.email}</p>
            <button
              className="inline-flex items-center justify-center rounded-full border border-border p-1.5 text-[#84581c] hover:bg-[#f5f6f9]"
              onClick={onEmailClick}
              title="Send email"
            >
              <Mail className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", clientStatusTone[client.status] ?? "bg-[#eef1f7] text-primary")}>
          {client.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoTile label={client.type === "buyer" ? "Budget" : "Monthly Budget"} value={currency(client.budget)} />
        <InfoTile label="Timeline" value={client.timeline} />
        <InfoTile label="Priority" value={client.priority} />
        <InfoTile label="Areas" value={client.preferredAreas[0] ?? "None"} />
      </div>

      <p className="mt-5 text-sm leading-6 text-[#4f5c6d]">{client.preferenceSummary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {client.preferredAreas.map((area) => (
          <span key={area} className="rounded-full border border-[#dde2ec] px-3 py-1 text-xs font-medium text-[#526273]">
            {area}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoTile label="Address" value={client.address ?? "—"} />
        <InfoTile label="Property Types" value={client.desiredPropertyTypes?.join(", ") || "Custom later"} />
        <InfoTile label="Requirements" value={`${client.minimumBedrooms ?? 0}+ bd / ${client.minimumBathrooms ?? 0}+ ba`} />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#f0d5d5] px-4 py-2 text-sm font-medium text-[#9d3030]" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}

function InvestorCard({
  investor,
  onEdit,
  onDelete,
  onEmailClick
}: {
  investor: Investor;
  onEdit: () => void;
  onDelete: () => void;
  onEmailClick: () => void;
}) {
  return (
    <article className="rounded-[26px] border border-border bg-[#fcfcfd] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#84581c]">Investor</p>
          <h4 className="mt-2 text-2xl font-semibold text-primary">{investor.name}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{investor.company}</p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", investor.committed ? "bg-[#e7f4eb] text-[#16603b]" : "bg-[#fff4f4] text-[#9d3030]")}>
          {investor.committed ? "Committed" : "Pipeline"}
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InfoTile label="Capital" value={currency(investor.investmentRange)} />
        <div className="flex items-center gap-2">
          <InfoTile label="Email" value={investor.email} />
          <button
            className="inline-flex items-center justify-center rounded-full border border-border p-1.5 text-[#84581c] hover:bg-[#f5f6f9]"
            onClick={onEmailClick}
            title="Send email"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
        </div>
        <InfoTile label="Phone" value={investor.phone} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {investor.assetTypes.map((item) => (
          <span key={item} className="rounded-full border border-[#dde2ec] px-3 py-1 text-xs font-medium text-[#526273]">
            {item}
          </span>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-[#4f5c6d]">{investor.notes}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#f0d5d5] px-4 py-2 text-sm font-medium text-[#9d3030]" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}

function VendorCard({
  vendor,
  onEdit,
  onDelete,
  onEmailClick
}: {
  vendor: Vendor;
  onEdit: () => void;
  onDelete: () => void;
  onEmailClick: () => void;
}) {
  return (
    <article className="rounded-[26px] border border-border bg-[#fcfcfd] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#84581c]">{vendor.category}</p>
          <h4 className="mt-2 text-2xl font-semibold text-primary">{vendor.name}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{vendor.company}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <InfoTile label="Email" value={vendor.email} />
          <button
            className="inline-flex items-center justify-center rounded-full border border-border p-1.5 text-[#84581c] hover:bg-[#f5f6f9]"
            onClick={onEmailClick}
            title="Send email"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
        </div>
        <InfoTile label="Phone" value={vendor.phone} />
        <InfoTile label="Address" value={vendor.address} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {vendor.serviceAreas.map((area) => (
          <span key={area} className="rounded-full border border-[#dde2ec] px-3 py-1 text-xs font-medium text-[#526273]">
            {area}
          </span>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-[#4f5c6d]">{vendor.notes}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#f0d5d5] px-4 py-2 text-sm font-medium text-[#9d3030]" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#f7f8fb] px-3 py-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a93a3]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-[#f7f8fb] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a93a3]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}

function EnvRow({ label, ready, helper }: { label: string; ready: boolean; helper?: string }) {
  return (
    <div className="rounded-[20px] bg-[#f7f8fb] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm text-primary">{label}</span>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", ready ? "bg-[#e7f4eb] text-[#16603b]" : "bg-[#fff4f4] text-[#9d3030]")}>
          {ready ? "Ready" : "Needed"}
        </span>
      </div>
      {helper && <p className="mt-2 text-sm text-muted-foreground">{helper}</p>}
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e1f3c]/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">{title}</h3>
          <button className="rounded-full border border-border px-4 py-2 text-sm text-primary" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onSave, busy }: { onCancel: () => void; onSave: () => void; busy: boolean }) {
  return (
    <div className="flex flex-wrap justify-end gap-3 pt-2">
      <button className="rounded-full border border-border px-5 py-3 text-sm font-medium text-primary" onClick={onCancel}>
        Cancel
      </button>
      <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white" onClick={onSave} disabled={busy}>
        {busy ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-primary">
      {label}
      <input
        className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-medium text-primary">
      {label}
      <input
        className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function FormattedNumberField({
  label,
  value,
  onChange,
  allowDecimal = false
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  allowDecimal?: boolean;
}) {
  const displayValue = Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: allowDecimal ? 1 : 0 }) : "";

  return (
    <label className="block text-sm font-medium text-primary">
      {label}
      <input
        className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
        inputMode="decimal"
        value={displayValue}
        onChange={(event) => {
          const raw = event.target.value.replace(/,/g, "");
          const parsed = allowDecimal ? Number(raw) : Number(raw.replace(/[^\d.-]/g, ""));
          onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-primary">
      {label}
      <textarea
        className="mt-2 min-h-28 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { label: string; value: string }>;
}) {
  return (
    <label className="block text-sm font-medium text-primary">
      {label}
      <select
        className="mt-2 w-full rounded-[18px] border border-border bg-[#fbfbfc] px-4 py-3 outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
