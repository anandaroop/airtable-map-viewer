import { airtable } from "../../lib/airtable";
import { toGeoJSONFeatureCollection } from "../../lib/geojson";
import { FridgeRecord, FridgeFieldName } from "../../types";

const {
  FRIDGES_BASE_ID,
  NEXT_PUBLIC_FRIDGES_TABLE_ID,
  NEXT_PUBLIC_FRIDGES_VIEW_ID,
} = process.env;

const fridges = async (req, res) => {
  const fields: FridgeFieldName[] = [
    "Fridge Name",
    "Geocode cache",
    "Location",
    "Instagram",
  ];

  const fridges = (await airtable
    .base(FRIDGES_BASE_ID)("Fridges")
    .select({
      view: "Map",
      fields,
    })
    .all()) as FridgeRecord[];

  res.statusCode = 200;
  res.json(
    toGeoJSONFeatureCollection(fridges, {
      primaryFieldName: "Fridge Name",
      tableId: NEXT_PUBLIC_FRIDGES_TABLE_ID,
      viewId: NEXT_PUBLIC_FRIDGES_VIEW_ID,
    })
  );
  // res.json(fridges);
};

export default fridges;
