import { useEffect } from "react";
import dynamic from "next/dynamic";

import { useStoreActions, useStoreState } from "./store";
import { Main } from "./Main";
import { Box } from "./Box";
import { Info } from "./Info";
import { API } from "../../lib/api";

const MapWithNoSSR = dynamic(() => import("./Map"), { ssr: false });

export const EvangelMap = () => {
  const setAllRecipientItems = useStoreActions(
    (actions) => actions.recipients.setAll
  );
  const setRecipientMetadata = useStoreActions(
    (actions) => actions.recipients.setMetadata
  );
  const setAllDriverItems = useStoreActions(
    (actions) => actions.drivers.setAll
  );
  const setDriverMetadata = useStoreActions(
    (actions) => actions.drivers.setMetadata
  );
  const touch = useStoreActions((actions) => actions.app.touch);

  useEffect(() => {
    async function initialize() {
      const views = await API.fetchMetaRecords();

      // fetch drivers' metadata
      const driversView = views.filter(
        (r) => r.fields["View ID"] == "viwI5p69OfCsAjEE6" // aka Current Delivery Drivers Map
      )[0];
      setDriverMetadata({ data: driversView.fields });

      // fetch driver records
      const driverRecords = await API.fetchRecordsFromView({
        tableName: driversView.fields["Table name"],
        viewName: driversView.fields["View name"],
        additionalFieldNames: ["Name"],
        primaryFieldName: driversView.fields["Primary field name"],
      });
      setAllDriverItems({ data: driverRecords });

      // fetch recipients' metadata
      const recipientsView = views.filter(
        (r) => r.fields["View ID"] == "viwJGcKgSrTDNX6DP" // aka Delivery Recipients: Map
      )[0];
      setRecipientMetadata({ data: recipientsView.fields });

      // fetch recipient records
      let recipientRecords = await API.fetchRecordsFromView({
        tableName: recipientsView.fields["Table name"],
        viewName: recipientsView.fields["View name"],
        primaryFieldName: recipientsView.fields["Primary field name"],
        additionalFieldNames: [
          "Address (computed)",
          "Confirmed?",
          "Driver",
          "NameLookup",
          "Neighborhood",
          "Notes",
          "Phone",
          "Whatsapp Only",
        ],
      });
      setAllRecipientItems({ data: recipientRecords });

      touch();
    }

    initialize();
  }, []);

  return (
    <>
      <Main direction="row">
        <Box flex="1">
          <Info />
        </Box>
        <Box flex="3">
          <MapWithNoSSR />
        </Box>
      </Main>

      <style jsx global>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          h1,
          h2,
          h3,
          p,
          li {
            padding-top: 0.5em;
            padding-bottom: 0.5em;
          }

          li {
            margin-left: 1em;
          }

          ul {
          }

          body {
            font-family: sans-serif;
          }
        `}
      </style>
    </>
  );
};
