import Head from "next/head";
import dynamic from "next/dynamic";

import { ViewSelector } from "./ViewSelector";
// import { MapLayers } from "./MapLayers";

const MapLayersWithNoSSR = dynamic(() => import("./MapLayers"), { ssr: false });

interface MapViewerProps {
  preSelectedViewIds?: string[];
}

export const MapViewer: React.FC<MapViewerProps> = () => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        />
      </Head>


      <main>
        <ViewSelector />
        <MapLayersWithNoSSR />
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
