import { useStoreState } from "./store";

export const Info = () => {
  const recipients = useStoreState((state) => state.recipients.items);
  const counts = useStoreState((state) => state.recipients.counts);

  const drivers = useStoreState((state) => state.drivers.items);
  const itineraries = useStoreState((state) => state.drivers.itineraries);

  return (
    <>
      <div className="info">
        <h2>
          Drivers{" "}
          <span style={{ color: "#ccc" }}>
            ({Object.values(drivers).length})
          </span>
        </h2>
        <div>
          {Object.values(drivers).map((driver) => (
            <div key={driver.id}>
              <p>
                <strong>{driver.fields.Name}</strong>
              </p>
              <ul>
                {itineraries[driver.id]?.map((recipient) => (
                  <li key={recipient.id}>{recipient.fields.NameLookup[0]}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: "2em" }}>
          Recipients{" "}
          <span style={{ color: "#ccc" }}>
            ({Object.values(recipients).length})
          </span>
        </h2>
        <ul>
          <li>{counts.assigned} assigned</li>
          <li>{counts.unassigned} unassigned</li>
        </ul>
      </div>
      <style jsx>{`
        div.info {
          padding: 0 1em;
        }
      `}</style>
    </>
  );
};
