import auth0 from "../../lib/auth0";
import { base } from "../../lib/airtable";

const records = async (req, res) => {
  const { tableName, viewName, primaryFieldName } = req.query;

  let additionalFieldNames: string = req.query.additionalFieldNames;
  let additionalFieldNameList: string[] = [];

  if (additionalFieldNames.length > 0) {
    additionalFieldNameList = additionalFieldNames.split("|");
  }

  const records = await base(tableName)
    .select({
      view: viewName,
      fields: [primaryFieldName, "Geocode cache", ...additionalFieldNameList],
    })
    .all();

  res.statusCode = 200;
  res.json(records);
};

export default auth0.requireAuthentication(records);
