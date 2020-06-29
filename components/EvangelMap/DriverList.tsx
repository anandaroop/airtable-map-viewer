import { decodeAirtableGeodata } from "../../lib/geojson";
import { RecipientsModel, RecipientRecord } from "./store/recipients";
import { DriversModel, DriverRecord } from "./store/drivers";
import { useStoreState } from "./store";

export const MARKER_SIZE = {
  TINY: 4,
  REGULAR: 8,
  LARGE: 12,
  HUGE: 16,
};

interface DriverListProps {
  driverItems: DriversModel["items"];
  colorMap: RecipientsModel["colorMap"];
  itineraryMap: DriversModel["itineraryMap"];
  markerMap: RecipientsModel["markerMap"];
}

export const DriverList: React.FC<DriverListProps> = (props) => {
  const { driverItems, colorMap, itineraryMap, markerMap } = props;

  const isMinimized = useStoreState((state) => state.app.isDriverListMinimized);

  const drivers = Object.values(driverItems);

  return (
    <div className="driver-list">
      {drivers.map((driver) => {
        const recipientItinerary = itineraryMap[driver.id];
        const color = colorMap[driver.id];

        return (
          <Driver
            key={driver.id}
            driver={driver}
            color={color}
            markerMap={markerMap}
            itineraryMap={itineraryMap}
          >
            {isMinimized && (
              <div style={{ padding: "0.5em 0" }}>
                {recipientItinerary?.map((_, i) => (
                  <div key={i} className="tick" style={{ background: color }}>
                    {" "}
                  </div>
                ))}
              </div>
            )}
            {!isMinimized &&
              recipientItinerary?.map((recipient) => (
                <Recipient
                  key={recipient.id}
                  recipient={recipient}
                  color={color}
                  markerMap={markerMap}
                />
              ))}
          </Driver>
        );
      })}
      <style jsx>{`
        .tick {
          display: inline-block;
          border: solid 1px white;
          height: 1em;
          width: 1em;
        }
      `}</style>
    </div>
  );
};

interface DriverProps {
  driver: DriverRecord;
  color: string;
  itineraryMap: DriversModel["itineraryMap"];
  markerMap: RecipientsModel["markerMap"];
}

const Driver: React.FC<DriverProps> = (props) => {
  const { driver, children, markerMap, itineraryMap, color } = props;

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

  return (
    <div
      className="driver"
      key={driver.id}
      onMouseEnter={() => {
        theseMarkers.map((m) => m.setRadius(MARKER_SIZE.LARGE));
        allOtherMarkers.map((m) => m.setRadius(MARKER_SIZE.TINY));
      }}
      onMouseLeave={() => {
        theseMarkers.map((m) => m.setRadius(MARKER_SIZE.REGULAR));
        allOtherMarkers.map((m) => m.setRadius(MARKER_SIZE.REGULAR));
      }}
    >
      <div className="driverName">
        {driver.fields.Name} ({recipientIds?.length || 0})
      </div>
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

interface RecipientProps {
  recipient: RecipientRecord;
  color: string;
  markerMap: RecipientsModel["markerMap"];
}

const Recipient: React.FC<RecipientProps> = (props) => {
  const { recipient, color, markerMap } = props;

  const geodata = decodeAirtableGeodata(recipient.fields["Geocode cache"]);
  const marker = markerMap[recipient.id];
  return (
    <li
      key={recipient.id}
      onMouseEnter={(e) => {
        marker.setRadius(MARKER_SIZE.HUGE);
      }}
      onMouseLeave={(e) => {
        marker.setRadius(MARKER_SIZE.LARGE);
      }}
    >
      <div className="recipientName" style={{ color }}>
        {recipient.fields.NameLookup[0]}
        {recipient.fields["Confirmed?"] ? " ✓" : ""}
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
