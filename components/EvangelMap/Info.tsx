import { useStoreState } from "./store";
import { decodeAirtableGeodata } from "../../lib/geojson";
import { RecipientsModel, RecipientRecord } from "./store/recipients";
import { DriversModel, DriverRecord } from "./store/drivers";

export const Info = () => {
  // const recipientItems = useStoreState((state) => state.recipients.items);
  const recipientCounts = useStoreState((state) => state.recipients.counts);
  const colorMap = useStoreState((state) => state.recipients.colorMap);
  const markerMap = useStoreState((state) => state.recipients.markerMap);

  const driverItems = useStoreState((state) => state.drivers.items);
  const itineraryMap = useStoreState((state) => state.drivers.itineraryMap);

  return (
    <>
      <div className="info">
        <p>
          Recipients: {recipientCounts.assigned} assigned /{" "}
          {recipientCounts.unassigned} unassigned
        </p>
        <p>Drivers: {Object.keys(driverItems).length}</p>
        <DriverList
          driverItems={driverItems}
          colorMap={colorMap}
          itineraryMap={itineraryMap}
          markerMap={markerMap}
        />
      </div>
      <style jsx>{`
        div.info {
          width: calc(100% - 1em);
          padding: 0 1em;
          overflow: scroll;
        }
      `}</style>
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
    <div className="driver-list">
      {drivers.map((driver) => {
        const recipientItinerary = itineraryMap[driver.id];
        return (
          <Driver
            key={driver.id}
            driver={driver}
            colorMap={colorMap}
            markerMap={markerMap}
            itineraryMap={itineraryMap}
          >
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
      <style jsx>{`
        .driver-list {
        }
      `}</style>
    </div>
  );
};

const Driver: React.FC<{
  driver: DriverRecord;
  colorMap: RecipientsModel["colorMap"];
  itineraryMap: DriversModel["itineraryMap"];
  markerMap: RecipientsModel["markerMap"];
}> = ({ driver, children, markerMap, itineraryMap, colorMap }) => {
  const recipientIds = itineraryMap[driver.id]?.map((r) => r.id);
  const theseMarkers = Object.entries(markerMap).reduce(
    (acc, [recipientId, marker]) => {
      if (recipientIds?.includes(recipientId)) acc.push(marker);
      return acc;
    },
    []
  );
  const allOtherMarkers = Object.entries(markerMap).reduce(
    (acc, [recipientId, marker]) => {
      if (!recipientIds?.includes(recipientId)) acc.push(marker);
      return acc;
    },
    []
  );
  const color = colorMap[driver.id];

  return (
    <div
      className="driver"
      key={driver.id}
      onMouseEnter={() => {
        theseMarkers.map((m) => m.setRadius(16));
        allOtherMarkers.map((m) => m.setRadius(4));
      }}
      onMouseLeave={() => {
        theseMarkers.map((m) => m.setRadius(8));
        allOtherMarkers.map((m) => m.setRadius(8));
      }}
    >
      <div className="driverName">{driver.fields.Name}</div>
      <ul>{children}</ul>
      <style jsx>{`
        .driver {
          padding-top: 1em;
        }
        .driverName {
          font-weight: bold;
          background: ${color}cc;
          color: white;
          padding: 0.25em 0.5em;
        }

        ul {
          list-style: none;
          border-left: solid 1px ${color};
          color: #333;
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
        marker.setRadius(24);
      }}
      onMouseLeave={(e) => {
        marker.setRadius(16);
      }}
    >
      <div className="recipientName" style={{ color: colorMap[driver.id] }}>
        {recipient.fields.NameLookup[0]}
        {recipient.fields["Confirmed?"] ? " ✓ " : " ﹖ "}
      </div>
      <div>
        <div className="address">
          <strong>
            <a
              target="gmap"
              href={encodeURI(
                `https://www.google.com/maps/dir/${geodata.o.formattedAddress}`
              )}
            >
              {recipient.fields["Address (computed)"]}
            </a>
          </strong>
        </div>

        <div className="phone">
          {recipient.fields.Phone?.[0]}{" "}
          {recipient.fields["Whatsapp Only"]?.[0] && (
            <span className="whatsapp-warning">⚠️ WhatsApp only</span>
          )}
        </div>

        {recipient.fields.Notes && (
          <div className="notes">
            <span className="header">NOTES</span>{" "}
            <span className="body">{recipient.fields.Notes}</span>
          </div>
        )}
      </div>

      <style jsx>
        {`
          .recipientName {
            font-weight: bold;
            padding-bottom: 0.5em;
          }

          .address {
            padding: 0.25em 0;
          }

          .address a {
            color: blue;
          }

          .phone {
            padding: 0.25em 0;
          }

          .whatsapp-warning {
            opacity: 0.6;
            padding-left: 0.25em;
          }

          .notes {
            padding: 0.5em 0;
          }

          .notes .header {
            font-weight: bold;
            font-size: 80%;
            color: #999;
          }

          .notes .body {
            font-style: italic;
            color: #666;
          }

          .notes::content
        `}
      </style>
    </li>
  );
};
