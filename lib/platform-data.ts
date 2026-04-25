import {
  buyerClients,
  campaignTemplates,
  dashboardGoals,
  investors,
  renterClients,
  rentalListings,
  saleListings,
  vendors
} from "@/lib/data";
import { Client, Investor, Listing, Vendor } from "@/lib/types";

export const defaultListings: Listing[] = [...saleListings, ...rentalListings];
export const defaultClients: Client[] = [...buyerClients, ...renterClients];
export const defaultInvestors: Investor[] = investors;
export const defaultVendors: Vendor[] = vendors;
export const defaultCampaigns = campaignTemplates;
export const defaultGoals = dashboardGoals;
