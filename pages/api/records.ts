import { base } from "../../lib/airtable";

export default async (req, res) => {
  const { tableName, viewName, primaryFieldName } = req.query;
  const records = await base(tableName)
    .select({ view: viewName, fields: [primaryFieldName, "Geocode cache"] })
    .all();

  res.statusCode = 200;
  res.json(records);
};
