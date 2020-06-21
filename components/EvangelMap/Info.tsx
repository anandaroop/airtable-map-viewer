import { useStoreState } from "./store";
import { DriversModel } from "./store/drivers";
import { RecipientsModel } from "./store/recipients";
import { decodeAirtableGeodata } from "../../lib/geojson";

export const Info = () => {
  const recipients = useStoreState((state) => state.recipients);
  const drivers = useStoreState((state) => state.drivers);

  return (
    <>
      <div className="info">
        <h1>Airtable Summary</h1>
        <RecipientsList recipients={recipients} />
        <DriverList drivers={drivers} recipients={recipients} />
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

const RecipientsList: React.FC<{
  recipients: Pick<RecipientsModel, any>;
}> = ({ recipients }) => {
  return (
    <>
      <h2>
        Recipients{" "}
        <span style={{ color: "#ccc" }}>
          ({Object.values(recipients.items).length})
        </span>
      </h2>
      <ul>
        <li>{recipients.counts.assigned} assigned</li>
        <li>{recipients.counts.unassigned} unassigned</li>
      </ul>
    </>
  );
};

const DriverList: React.FC<{
  drivers: Pick<DriversModel, "items" | "itineraries">;
  recipients: Pick<RecipientsModel, "colorMap">;
}> = ({ drivers, recipients }) => {
  return (
    <>
      <h2 style={{ marginTop: "2em" }}>
        Drivers{" "}
        <span style={{ color: "#ccc" }}>
          ({Object.values(drivers.items).length})
        </span>
      </h2>
      <div>
        {Object.values(drivers.items).map((driver) => {
          return (
            <div key={driver.id}>
              <p>
                <strong>{driver.fields.Name}</strong>
              </p>
              <ul>
                {drivers.itineraries[driver.id]?.map((recipient) => {
                  const geodata = decodeAirtableGeodata(
                    recipient.fields["Geocode cache"]
                  );
                  return (
                    <li key={recipient.id}>
                      <div
                        className="recipientName"
                        style={{ color: recipients.colorMap[driver.id] }}
                      >
                        {recipient.fields.NameLookup[0]}
                        {recipient.fields["Confirmed?"] ? " ✓ " : " ﹖ "}
                      </div>
                      <dl>
                        {/* <dt>Address</dt> */}
                        <dd>{geodata.o.formattedAddress}</dd>
                        {/* <dt>Phone</dt> */}
                        <dd>
                          {recipient.fields.Phone?.[0]}{" "}
                          {recipient.fields["Whatsapp Only"]?.[0] &&
                            " (⚠️ WhatsApp only)"}
                        </dd>
                        <dd></dd>
                        <dt>Notes</dt>
                        <dd>{recipient.fields.Notes}</dd>
                      </dl>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        ul {
          list-style: none;
        }

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
      `}</style>
    </>
  );
};
