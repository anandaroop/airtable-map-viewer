import { useStoreState } from "./store";
import { decodeAirtableGeodata } from "../../lib/geojson";
import { RecipientsModel, RecipientRecord } from "./store/recipients";
import { DriversModel, DriverRecord } from "./store/drivers";

export const Info = () => {
  const recipientItems = useStoreState((state) => state.recipients.items);
  const recipientCounts = useStoreState((state) => state.recipients.counts);
  const colorMap = useStoreState((state) => state.recipients.colorMap);
  const markerMap = useStoreState((state) => state.recipients.markerMap);

  const driverItems = useStoreState((state) => state.drivers.items);
  const itineraryMap = useStoreState((state) => state.drivers.itineraryMap);

  return (
    <>
      <div className="info">
        <RecipientSummary
          recipientItems={recipientItems}
          counts={recipientCounts}
        />
        <DriverList
          driverItems={driverItems}
          colorMap={colorMap}
          itineraryMap={itineraryMap}
          markerMap={markerMap}
        />
      </div>
      <style jsx>{`
        div.info {
          width: 100%;
          padding: 0 1em;
          overflow: scroll;
        }
      `}</style>
    </>
  );
};

const RecipientSummary: React.FC<{
  recipientItems: RecipientsModel["items"];
  counts: {
    assigned: number;
    unassigned: number;
  };
}> = ({ recipientItems, counts }) => {
  const recipients = Object.values(recipientItems);
  return (
    <>
      <h2>
        Recipients <span style={{ color: "#ccc" }}>({recipients.length})</span>
      </h2>
      <ul>
        <li>{counts.assigned} assigned</li>
        <li>{counts.unassigned} unassigned</li>
      </ul>
    </>
  );
};

const DriverList: React.FC<{
  driverItems: DriversModel["items"];
  colorMap: RecipientsModel["colorMap"];
  itineraryMap: DriversModel["itineraryMap"];
  markerMap: RecipientsModel["markerMap"];
}> = ({ driverItems, colorMap, itineraryMap, markerMap }) => {
  const drivers = Object.values(driverItems);

  return (
    <>
      <h2 style={{ marginTop: "2em" }}>
        Drivers <span style={{ color: "#ccc" }}>({drivers.length})</span>
      </h2>
      <div>
        {drivers.map((driver) => {
          const recipientItinerary = itineraryMap[driver.id];
          return (
            <Driver key={driver.id} driver={driver}>
              {recipientItinerary?.map((recipient) => (
                <Recipient
                  key={recipient.id}
                  recipient={recipient}
                  driver={driver}
                  colorMap={colorMap}
                  markerMap={markerMap}
                />
              ))}
            </Driver>
          );
        })}
      </div>
    </>
  );
};

const Driver: React.FC<{ driver: DriverRecord }> = ({ driver, children }) => {
  return (
    <div key={driver.id}>
      <p>
        <strong>{driver.fields.Name}</strong>
      </p>
      <ul>{children}</ul>
      <style jsx>{`
        ul {
          list-style: none;
        }
      `}</style>
    </div>
  );
};

const Recipient: React.FC<{
  recipient: RecipientRecord;
  driver: DriverRecord;
  colorMap: RecipientsModel["colorMap"];
  markerMap: RecipientsModel["markerMap"];
}> = ({ recipient, driver, colorMap, markerMap }) => {
  const geodata = decodeAirtableGeodata(recipient.fields["Geocode cache"]);
  const marker = markerMap[recipient.id];
  return (
    <li
      key={recipient.id}
      onMouseEnter={(e) => {
        marker.setRadius(16);
      }}
      onMouseLeave={(e) => {
        marker.setRadius(8);
      }}
    >
      <div className="recipientName" style={{ color: colorMap[driver.id] }}>
        {recipient.fields.NameLookup[0]}
        {recipient.fields["Confirmed?"] ? " ✓ " : " ﹖ "}
      </div>
      <dl>
        {/* <dt>Address</dt> */}
        <dd>{geodata.o.formattedAddress}</dd>
        {/* <dt>Phone</dt> */}
        <dd>
          {recipient.fields.Phone?.[0]}{" "}
          {recipient.fields["Whatsapp Only"]?.[0] && " (⚠️ WhatsApp only)"}
        </dd>
        <dd></dd>
        <dt>Notes</dt>
        <dd>{recipient.fields.Notes}</dd>
      </dl>

      <style jsx>
        {`
          .recipientName {
            font-weight: bold;
            margin: 0 0 1em 0;
          }

          dl {
          }

          dt {
            opacity: 0.5;
            font-size: 0.75em;
            font-weight: bold;
          }
          dd {
            padding: 0.25em 0 0.25em 1em;
          }
        `}
      </style>
    </li>
  );
};
