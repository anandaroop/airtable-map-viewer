import { useStoreState } from "./store";
import { DriverList } from "./DriverList";
import { UnassignedRecipients } from "./UnassignedRecipients";
import { Warnings } from "./Warnings";

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
        <div className="summary">
          <span>
            Stops: {recipientCounts.assigned} assigned /{" "}
            {recipientCounts.unassigned} unassigned
          </span>
          <span>Drivers: {Object.keys(driverItems).length}</span>
        </div>
        <DriverList
          driverItems={driverItems}
          colorMap={colorMap}
          itineraryMap={itineraryMap}
          markerMap={markerMap}
        />
        <Warnings />
        <UnassignedRecipients
          recipients={unassignedRecipients}
          markerMap={markerMap}
        />
      </div>
      <style jsx>{`
        .info {
          width: 100%;
          overflow: scroll;
          padding: 1em;
        }

        .summary {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};
