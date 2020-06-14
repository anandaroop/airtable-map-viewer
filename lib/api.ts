import { MetaFields } from "./airtable";

export const API = {
  fetchMetaRecords: async (): Promise<Airtable.Record<MetaFields>[]> => {
    const response = await fetch("/api/meta");
    const json = await response.json();
    return json;
  },

  fetchRecordsFromView: async ({
    tableName,
    viewName,
  }: {
    tableName: string;
    viewName: string;
  }): Promise<Airtable.Record<any>[]> => {
    const params = new URLSearchParams([
      ["tableName", tableName],
      ["viewName", viewName],
    ]);
    const response = await fetch(`/api/views?${params.toString()}`);
    const json = await response.json();
    return json;
  },
};
