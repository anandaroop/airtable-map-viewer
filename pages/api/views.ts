import { base } from "../../lib/airtable";

export default async (req, res) => {
  const { tableName, viewName } = req.query;
  const records = await base(tableName).select({ view: viewName }).all();

  res.statusCode = 200;
  res.json(records);
};
