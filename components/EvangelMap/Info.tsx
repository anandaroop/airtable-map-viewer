import { useStoreState } from "./store";

export const Info = () => {
  const recipients = useStoreState((state) => state.recipients.items);
  const drivers = useStoreState((state) => state.drivers.items);

  return (
    <>
      <div>
        <p>{Object.keys(recipients).length} recipients</p>
        <p>{Object.keys(drivers).length} drivers</p>
      </div>
      <style jsx>{`
        div {
          padding: 0 1em;
        }
      `}</style>
    </>
  );
};
