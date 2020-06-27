import Head from "next/head";
import { GeoJSON, Map as ReactLeafletMap, TileLayer } from "react-leaflet";
import { CircleMarker } from "leaflet";
import { Feature, Point } from "geojson";

import { useStoreState, useStoreActions } from "./store";
import { RecipientFields } from "./store/recipients";

const Map = () => {
  const recipients = useStoreState((state) => state.recipients);
  const drivers = useStoreState((state) => state.drivers);
  const recipientActions = useStoreActions((actions) => actions.recipients);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        />
      </Head>

      {recipients.isColorCoded && (
        <ReactLeafletMap
          center={{ lat: 40.7, lng: -73.85 }}
          zoom={11}
          boxZoom={true}
        >
          <TileLayer
            attribution=' &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <GeoJSON
            data={recipients.geojson}
            pointToLayer={(
              point: Feature<Point, RecipientFields & { recordId: string }>,
              latLng
            ) => {
              const fillColor = point.properties["marker-color"] || "gray";

              const marker = new CircleMarker(latLng, {
                radius: 8,
                weight: 1,
                color: "white",
                fillColor,
                fillOpacity: 0.5,
              }).bindPopup(airtableHyperlinkFor(point));

              recipientActions.setMarker({
                recordId: point.properties.recordId,
                marker: marker,
              });

              return marker;
            }}
          />

          <GeoJSON
            data={drivers.geojson}
            pointToLayer={(point: Feature<Point>, latLng) => {
              const color =
                recipients.colorMap[point.properties.recordId] || "gray";

              return new CircleMarker(latLng, {
                color,
                radius: 8,
                weight: 4,
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
  const linkText = primaryFieldValue;

  return `<a href="${recordUrl}" target="airtable">${linkText}…</a>`;
};

export default Map; // default bc of dynamic import
