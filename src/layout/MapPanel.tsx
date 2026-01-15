import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

import { useNodeStore } from "../store/useNodeStore";
import type { NodeInfo } from "../types/nodes";

// Karten-Zentrum (Fallback)
const center: LatLngExpression = [49.75, 6.64];

// Helfer-Komponente: Map folgt selektiertem Gerät
function FlyToSelected({ node }: { node: NodeInfo | null }) {
    const map = useMap();

    useEffect(() => {
        if (!node?.maps_marker) return;

        map.flyTo(
            [node.maps_marker.lat, node.maps_marker.lon],
            14,
            { duration: 0.8 }
        );
    }, [node, map]);

    return null;
}

export function MapPanel() {
    const nodes = useNodeStore((s) => s.nodes);
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    return (
        <MapContainer
            center={center}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Fokus auf selektierten Node */}
            <FlyToSelected node={selectedNode} />

            {/* Marker aus NodeInfo */}
            {nodes
                .filter((n) => n.maps_marker)
                .map((n) => {
                    const m = n.maps_marker!;
                    return (
                        <Marker
                            key={n.node_id}
                            position={[m.lat, m.lon]}
                            eventHandlers={{
                                click: () => setSelectedNode(n),
                            }}
                        >
                            <Popup>
                                <strong>{n.shortname}</strong>
                                <br />
                                {n.longname}
                                <br />
                                Status: {m.status}
                                <br />
                                Letzte Aktivität:
                                <br />
                                {new Date(m.last_seen).toLocaleString("de-DE")}
                            </Popup>
                        </Marker>
                    );
                })}
        </MapContainer>
    );
}