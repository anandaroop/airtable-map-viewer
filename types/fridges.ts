export interface FridgeFields {
  /** Full name of community fridge */
  "Fridge Name": string;

  /** Street address */
  Location: string;

  /** Locality (could be city or neighborhood) */
  City: string;

  /** Instagram handle */
  Instagram: string;

  /** Geocoded address, encoded */
  "Geocode cache": string;

  // Website: string;
  // Zipcode: string;
  // "Any Special Instructions?": string;
  // "Borough": string;
  // "Comments": string;
  // "Freezer Y/N": string;
  // "Geocode query": string;
  // "Hours: Other": string;
  // "Hours": string[];
  // "How to Donate $": string;
  // "Status": string;
}

export type FridgeRecord = Airtable.Record<FridgeFields>;

export type FridgeFieldName = keyof FridgeFields;
