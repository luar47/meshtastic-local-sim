import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { MapMarker } from "../types/maps";
import { fetchMarkers } from "../api/map";

export function MapPanel() {
    const [markers, setMarkers] = useState<MapMarker[]>([]);

    useEffect(() => {
        fetchMarkers()
            .then(setMarkers)
            .catch((err) => console.error(err));
    }, []);

    return (
        <MapContainer
            center={[49.75, 6.64]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
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