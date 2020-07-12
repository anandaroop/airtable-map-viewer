import { Record, Records } from "airtable";
import { Feature, FeatureCollection, Point } from "geojson";

import { AirtableCachedGeocode } from "./airtable";
/**
 * Pull the lat/lng out of the base64-encoded geocoder result cached by Airtable
 */
export const decodeAirtableGeodata = (value: string): AirtableCachedGeocode => {
  if (!value?.length) {
    throw new Error("Missing geocode value");
  }
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
  options: {
    tableId: string;
    viewId: string;
    primaryFieldName: string;
    colorizer?: (record: Record<any>) => string;
  }
) => {
  const features = records
    .map((record) => toGeoJSONFeature(record, options))
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
  options: {
    tableId: string;
    viewId: string;
    primaryFieldName: string;
    colorizer?: (record: Record<any>) => string;
  }
) => {
  const colorizer = options.colorizer || ((_record) => "green");
  try {
    // munge geodata
    const cachedGeocoderResult = record.fields["Geocode cache"];
    const geodata = decodeAirtableGeodata(cachedGeocoderResult);
    const {
      o: { lat, lng },
    } = geodata;

    if (lat === undefined || lng === undefined) {
      console.error(
        "LatLng appears to be undefined. Showing geodata and record:",
        geodata,
        record
      );
    }

    // munge airtable metainfo for hyperlink building
    const { tableId, viewId, primaryFieldName } = options;
    const recordId = record.id;

    const feature: Feature<Point> = {
      type: "Feature",
      id: record.fields[primaryFieldName],
      properties: {
        ...record.fields,
        tableId,
        viewId,
        recordId,
        "marker-color": colorizer(record),
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };
    delete feature.properties["Geocode cache"];

    return feature;
  } catch (e) {
    console.error("Unable to convert to GeoJSON Feature:", record.fields);
    return null;
  }
};
