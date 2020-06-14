import { useStoreState } from "../store";

export const MapLayers = () => {
  const displayableViews = useStoreState((state) => state.views.displayable);

  return (
    <>
      <div className="map">
        <div>
          {displayableViews.map((v) => (
            <div key={v.metadata["View ID"]}>
              <h2>{v.metadata["View name"]}</h2>
              <pre>{JSON.stringify(v.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

      <style jsx>
        {`
          .map {
            flex: 5;
          }
        `}
      </style>
    </>
  );
};
