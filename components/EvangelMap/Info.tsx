import { useStoreState } from "./store";
import { DriverList } from "./DriverList";
import { UnassignedRecipients } from "./UnassignedRecipients";

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

