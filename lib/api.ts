import { MetaFields } from "./airtable";

export const API = {
  getMetaRecords: async (): Promise<Airtable.Record<MetaFields>[]> => {
    const response = await fetch("/api/meta");
    const json = await response.json();
    return json;
  },
};
