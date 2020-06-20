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
export const toGeoJSONFeatureCollection = (
  records: Records<any>,
  airtableLocation: {
    tableId: string;
    viewId: string;
    primaryFieldName: string;
  }
) => {
  const features = records
    .map((record) => toGeoJSONFeature(record, airtableLocation))
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
const toGeoJSONFeature = (
  record: Record<any>,
  airtableLocation: {
    tableId: string;
    viewId: string;
    primaryFieldName: string;
  }
) => {
  try {
    // munge geodata
    const cachedGeocoderResult = record.fields["Geocode cache"];
    const geodata = decodeAirtableGeodata(cachedGeocoderResult);
    const {
      o: { lat, lng },
    } = geodata;

    // munge airtable metainfo for hyperlink building
    const { tableId, viewId, primaryFieldName } = airtableLocation;
    const recordId = record.id;

    const feature: Feature<Point> = {
      type: "Feature",
      id: record.fields[primaryFieldName],
      properties: {
        ...record.fields,
        tableId,
        viewId,
        recordId,
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };
    delete feature.properties["Geocode cache"];

    return feature;
  } catch (e) {
    console.error("Unable to convert to GeoJSON Feature:", e, record.fields);
    // swallow this error for now, to have less disruptive server responses
    // throw e
  }
};
