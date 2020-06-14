import { ViewSelector } from "./ViewSelector";
import { useStoreState } from "../store";

interface MapViewerProps {
  preSelectedViewIds?: string[];
}

export const MapViewer: React.FC<MapViewerProps> = () => {
  const displayableViews = useStoreState((state) => state.views.displayable);

  return (
    <>
      <main>
        <ViewSelector />
        <div className="map">
          <ul>
            {displayableViews.map((v) => (
              <li>
                {v.data.length}× {v.metadata["View name"]}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <style jsx>
        {`
          main {
            display: flex;
            flex-direction: row;
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
          }

          .list {
            flex: 1 200px;
            min-width: 200px;
          }

          .map {
            flex: 5;
          }
        `}
      </style>
    </>
  );
};
