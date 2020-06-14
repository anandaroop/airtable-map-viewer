import Airtable from "airtable";

const { AIRTABLE_API_KEY: apiKey, AIRTABLE_BASE_ID: baseId } = process.env;

const airtable: Airtable = new Airtable({ apiKey });

export const base: Airtable.Base = airtable.base(baseId);

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
