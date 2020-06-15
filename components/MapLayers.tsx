import { GeoJSON, Map, Marker, Popup, TileLayer } from "react-leaflet";
import { CircleMarker } from "leaflet";

import { useStoreState } from "../store";

// show GeoJSON in sidebar?
const DEBUG = true

const MapLayers = () => {
  const displayableViews = useStoreState((state) => state.views.displayable);

  const position = { lat: 40.7, lng: -73.85 };

  return (
    <div className="map">
      <Map center={position} zoom={11}>
        <TileLayer
          attribution=' &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {displayableViews.map((v) => (
          <GeoJSON
            key={v.metadata["View ID"]}
            data={v.data}
            pointToLayer={(point, latLng) => {
              return new CircleMarker(latLng, {
                radius: 10,
                weight: 0.5,
                color: point.properties["marker-color"] || "blue",
                fillOpacity: 0.4,
              }).bindPopup(airtableHyperlinkFor(point));
            }}
          />
        ))}
      </Map>

      {DEBUG && (
        <div className="geojson">
          <div>
            {displayableViews.map((v) => (
              <div key={v.metadata["View ID"]}>
                <h2>{v.metadata["View name"]}</h2>
                <pre>{JSON.stringify(v.data, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx global>
        {`
          .leaflet-container {
            width: 100%;
            flex: 1 0 66%;
          }
        `}
      </style>

      <style jsx>
        {`
          .map {
            flex: 5;

            display: flex;
            flex-direction: row;
          }

          .geojson {
            border: solid 1px gray;
            flex: 1 0 33%;
            overflow: auto;
            padding: 1em;
          }
        `}
      </style>
    </div>
  );
};

const airtableHyperlinkFor = (point: Feature<Point>) => {
  const recId = point.id;
  const viwId = point.properties.viewId;
  const tblId = point.properties.tableId;

  delete point.properties.viewId;
  delete point.properties.tableId;
  const primaryFieldValue = Object.values(point.properties)[0] as string;

  const recordUrl = `https://airtable.com/${tblId}/${viwId}/${recId}`;
  const abbreviatedLinkText = primaryFieldValue.substr(0, 5);

  return `<a href="${recordUrl}" target="airtable">${abbreviatedLinkText}…</a>`;
};

export default MapLayers;
