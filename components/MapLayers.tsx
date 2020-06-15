import { Map, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";

import { useStoreState } from "../store";

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
          <GeoJSON data={v.data} />
        ))}

        {/* <Marker position={position}>
          <Popup>
            A pretty CSS3 popup.
            <br />
            Easily customizable.
          </Popup>
        </Marker> */}
      </Map>

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

export default MapLayers;
