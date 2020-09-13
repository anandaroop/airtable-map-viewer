import Head from "next/head";
import { useEffect, useState } from "react";
import { GeoJSON, Map as ReactLeafletMap, TileLayer } from "react-leaflet";
import { CircleMarker, LatLng, LatLngBounds } from "leaflet";
import { Feature, Point, FeatureCollection } from "geojson";
import { bbox } from "@turf/turf";

const deriveBounds = (data: FeatureCollection<Point>) => {
  const [lng1, lat1, lng2, lat2] = bbox(data);
  const bounds = new LatLngBounds(
    new LatLng(lat1, lng1),
    new LatLng(lat2, lng2)
  );
  return bounds;
};

const Map = () => {
  const [fridgeData, setFridgeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/fridges.geojson");
      const json = await response.json();
      setFridgeData(json);
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        />
      </Head>

      {fridgeData && (
        <>
          <ReactLeafletMap bounds={deriveBounds(fridgeData)} boxZoom={true}>
            <TileLayer
              attribution=' &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <GeoJSON
              data={fridgeData}
              pointToLayer={(point: Feature<Point>, latLng) => {
                const marker = new CircleMarker(latLng, {
                  weight: 0,
                  radius: 8,
                  fillOpacity: 0.5,
                  fillColor: "#e7212f",
                })
                  .bindPopup(point.id as string)
                  .on("mouseover", () => marker.openPopup());

                return marker;
              }}
            />
          </ReactLeafletMap>
          <style jsx global>
            {`
              .leaflet-container {
                width: 100%;
                height: 100vh;
              }
            `}
          </style>
        </>
      )}
    </>
  );
};

export default Map; // default bc of dynamic import
