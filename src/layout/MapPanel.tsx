import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import type { MapMarker } from "../types/maps";
import { fetchMarkers } from "../api/map";

const center: LatLngExpression = [49.75, 6.64];

export function MapPanel() {
    const [markers, setMarkers] = useState<MapMarker[]>([]);

    useEffect(() => {
        fetchMarkers()
            .then(setMarkers)
            .catch(console.error);
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((m) => (
                <Marker key={m.id} position={[m.lat, m.lon]}>
                    <Popup>
                        <strong>{m.label}</strong>
                        <br />
                        Status: {m.status}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}