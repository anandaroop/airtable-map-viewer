import Head from "next/head";
import { GeoJSON, Map as ReactLeafletMap, TileLayer } from "react-leaflet";
import { CircleMarker } from "leaflet";
import { Feature, Point } from "geojson";

import { useStoreState } from "./store";
import { RecipientFields } from "./store/recipients";

const Map = () => {
  const recipients = useStoreState((state) => state.recipients);
  const drivers = useStoreState((state) => state.drivers);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        />
      </Head>

      {recipients.isColorCoded && (
        <ReactLeafletMap center={{ lat: 40.7, lng: -73.85 }} zoom={11}>
          <TileLayer
            attribution=' &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <GeoJSON
            data={recipients.geojson}
            pointToLayer={(point: Feature<Point, RecipientFields>, latLng) => {
              const fillColor = point.properties["marker-color"] || "gray";

              return new CircleMarker(latLng, {
                radius: 8,
                weight: 1,
                color: "white",
                fillColor,
                fillOpacity: 0.5,
              }).bindPopup(airtableHyperlinkFor(point));
            }}
          />

          <GeoJSON
            data={drivers.geojson}
            pointToLayer={(point, latLng) => {
              return new CircleMarker(latLng, {
                radius: 8,
                weight: 2,
                color: "blue",
                opacity: 0.75,
                fillColor: "transparent",
              }).bindPopup(airtableHyperlinkFor(point));
            }}
          />
        </ReactLeafletMap>
      )}

      <style jsx global>
        {`
          .leaflet-container {
            width: 100%;
            height: 100vh;
          }
        `}
      </style>
    </>
  );
};

const airtableHyperlinkFor = (point: Feature<Point>) => {
  const recId = point.properties.recordId;
  const viwId = point.properties.viewId;
  const tblId = point.properties.tableId;

  delete point.properties.viewId;
  delete point.properties.tableId;
  const primaryFieldValue = point.id as string;

  const recordUrl = `https://airtable.com/${tblId}/${viwId}/${recId}`;
  const abbreviatedLinkText = primaryFieldValue.substr(0, 5);

  return `<a href="${recordUrl}" target="airtable">${abbreviatedLinkText}…</a>`;
};

export default Map; // default bc of dynamic import
