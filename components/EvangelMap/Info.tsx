import { useStoreState } from "./store";
import { DriverList } from "./DriverList";
import { RecipientsModel, RecipientRecord } from "./store/recipients";

export const Info = () => {
  const recipientItems = useStoreState((state) => state.recipients.items);
  const recipientCounts = useStoreState((state) => state.recipients.counts);
  const colorMap = useStoreState((state) => state.recipients.colorMap);
  const markerMap = useStoreState((state) => state.recipients.markerMap);

  const driverItems = useStoreState((state) => state.drivers.items);
  const itineraryMap = useStoreState((state) => state.drivers.itineraryMap);

  const unassignedRecipients = Object.values(recipientItems).filter(
    (r) => !r.fields?.Driver?.length
  );

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
        <UnassignedRecipients
          recipients={unassignedRecipients}
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

const UnassignedRecipients: React.FC<{
  recipients: RecipientRecord[];
  markerMap: RecipientsModel["markerMap"];
}> = ({ recipients, markerMap }) => {
  const alphabetizedRecipients = recipients.sort((a, b) => {
    if (a.fields.NameLookup < b.fields.NameLookup) return -1;
    if (a.fields.NameLookup > b.fields.NameLookup) return 1;
    return 0;
  });
  return (
    <>
      <div className="unassigned-recipients">
        <h2>Unassigned</h2>
        {alphabetizedRecipients.map((recipient) => {
          const marker = markerMap[recipient.id];

          return (
            <div
              key={recipient.id}
              className="recipient"
              onMouseEnter={(e) => {
                marker.setRadius(12);
                marker.setStyle({ color: "red", fillColor: "none", weight: 4 });
                marker.bringToFront();
              }}
              onMouseLeave={(e) => {
                marker.setRadius(8);
                marker.setStyle({ color: "none", fillColor: "gray" });
                marker.bringToBack();
              }}
            >
              <div className="name">{recipient.fields.NameLookup}</div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .unassigned-recipients {
          padding-top: 1em;
        }
        .recipient {
          padding: 0.25em 0;
        }
      `}</style>
    </>
  );
};
