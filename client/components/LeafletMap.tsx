"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Red Google-Maps-style drop pin built from inline SVG
const redPinIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="45">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 8.25 12 24 12 24S24 20.25 24 12C24 5.373 18.627 0 12 0z"
      fill="#EA4335" stroke="#B31412" stroke-width="1"/>
    <circle cx="12" cy="12" r="4.5" fill="white"/>
  </svg>`,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -46],
});

interface LeafletMapProps {
  lat: number;
  lng: number;
  title?: string;
}

export default function LeafletMap({ lat, lng, title }: LeafletMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      {/* CartoDB Voyager – closest free equivalent to Google Maps style */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank" rel="noopener noreferrer">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lng]} icon={redPinIcon}>
        {title && <Popup>{title}</Popup>}
      </Marker>
    </MapContainer>
  );
}
