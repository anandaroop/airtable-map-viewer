import { GeoJSON, Map, Marker, Popup, TileLayer } from "react-leaflet";
import { CircleMarker } from "leaflet";
import { Feature, Point } from "geojson";

import { useStoreState } from "./store";
import { clusterPalette } from "../../lib/palette";

const MapLayers = () => {
  const DEBUG = useStoreState((state) => state.views.debug);
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
                radius: 8,
                weight: 1,
                color: "white",
                fillColor: fillColor(point, v.defaultColor),
                fillOpacity: 0.5,
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

const fillColor = (feature, defaultColor) => {
  let markerColor, clusterId;

  if ((markerColor = feature.properties["marker-color"])) {
    return markerColor;
  }

  if ((clusterId = feature.properties["cluster"])) {
    return clusterPalette[clusterId];
  }

  return defaultColor;
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

export default MapLayers;
