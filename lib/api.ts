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
    primaryFieldName,
  }: {
    tableName: string;
    viewName: string;
    primaryFieldName: string;
  }): Promise<Airtable.Record<any>[]> => {
    const params = new URLSearchParams([
      ["tableName", tableName],
      ["viewName", viewName],
      ["primaryFieldName", primaryFieldName],
    ]);
    const response = await fetch(`/api/records?${params.toString()}`);
    const json = await response.json();
    return json;
  },
};
