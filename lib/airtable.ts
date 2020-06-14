import Airtable from "airtable";

/*
 * Import this library only on the server side, since it relies on ENV variables
 * which are not and should not be passed to the client side by NextJS
 */


const { AIRTABLE_API_KEY: apiKey, AIRTABLE_BASE_ID: baseId } = process.env;

const airtable: Airtable = new Airtable({ apiKey });

export const base: Airtable.Base = airtable.base(baseId);

/**
 * Represents the the structure of the "Meta" table within the Airtable base.
 * That table is automatically generate via a Scripting Block automation.
 */
export interface MetaFields {
  "Full name": string;
  Type: string;
  "View ID": string;
  "View name": string;
  "Table ID": string;
  "Table name": string;
  "Primary field name": string;
  Mappable: boolean;
}

/**
 * Represents the result of an Airtable Map block's cached geocoding value.
 * This is base64 encoded and stored in a designated column on the table, configured
 * via the Map block's settings. That column name corresponds to the `geocodedFieldName`
 * required by this application.
 */
export interface AirtableCachedGeocode {
  /** geocoder query string */
  i: string

  /** geocoder cached result */
  o: {
    /** status */
    status: string

    /** canonical address string */
    formattedAddress: string

    /** geocoded latitude */
    lat: number

    /** geocoded latitude */
    lng: number
  }

  /** cache expiry, in epoch milliseconds */
  e: number
}

