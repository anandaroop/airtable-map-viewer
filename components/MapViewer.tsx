import { ViewSelector } from "./ViewSelector";
import { MapLayers } from "./MapLayers";

interface MapViewerProps {
  preSelectedViewIds?: string[];
}

export const MapViewer: React.FC<MapViewerProps> = () => {
  return (
    <>
      <main>
        <ViewSelector />
        <MapLayers />
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
        `}
      </style>
    </>
  );
};
