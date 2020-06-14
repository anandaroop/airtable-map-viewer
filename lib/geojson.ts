import { Record, Records } from "airtable";
import { Feature, FeatureCollection, Point } from "geojson";

import { AirtableCachedGeocode } from "./airtable";
/**
 * Pull the lat/lng out of the base64-encoded geocoder result cached by Airtable
 */
export const decodeAirtableGeodata = (value: string): AirtableCachedGeocode => {
  const geocode = value.substring(3); // lop off leading status indicator emoji
  const buffer = Buffer.from(geocode, "base64");
  const text = buffer.toString("ascii").replace(/\\"/g, "");
  return JSON.parse(text);
};

/**
 * Take a set of Airtable records and transform it into a
 * GeoJSON FeatureCollection, one Feature for each record.
 */
export const toGeoJSONFeatureCollection = (records: Records<any>) => {
  const features = records
    .map((record) => toGeoJSONFeature(record))
    .filter(Boolean) as Feature<Point>[];

  const featureCollection: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: features,
  };
  return featureCollection;
};

/**
 * Transform an Airtable record into a GeoJSON Feature,
 * with geometry coming from the geocoded & cached Airtable column.
 */
const toGeoJSONFeature = (record: Record<any>) => {
  try {
    const cachedGeocoderResult = record.fields["Geocode cache"];
    delete record.fields["Geocode cache"];

    const geodata = decodeAirtableGeodata(cachedGeocoderResult);
    const {
      o: { lat, lng },
    } = geodata;

    const feature: Feature<Point> = {
      type: "Feature",
      properties: record.fields,
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    return feature;
  } catch (e) {
    console.error("Unable to convert to GeoJSON Feature:", record.fields);
    // swallow this error for now, to have less disruptive server responses
    // throw e
  }
};
