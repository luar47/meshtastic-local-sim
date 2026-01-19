import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";

import { useNodeStore } from "../store/useNodeStore";
import type { NodeInfo } from "../types/nodes";

// Karten-Zentrum
const center: LatLngExpression = [49.75, 6.64];

// Tile-URLs
const LIGHT_TILE =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const DARK_TILE =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// 🌍 Helfer: folgt selektiertem Node
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

    // 🌗 Dark Mode Status (lokal für Map)
    const getDarkMode = () =>
        document.documentElement.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [isDark, setIsDark] = useState(getDarkMode);

    // 🔁 Reagiere auf Theme-Wechsel
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const sync = () => setIsDark(getDarkMode());

        // initial
        sync();

        try {
            media.addEventListener("change", sync);
        } catch {
            media.addListener(sync); // Safari
        }

        // Fallback: DOM beobachten (PrimeReact Theme Switch)
        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => {
            try {
                media.removeEventListener("change", sync);
            } catch {
                media.removeListener(sync);
            }
            observer.disconnect();
        };
    }, []);

    const tileUrl = isDark ? DARK_TILE : LIGHT_TILE;

    return (
        <MapContainer
            center={center}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
        >
            {/* 🌗 Theme-abhängige Tiles */}
            <TileLayer
                key={tileUrl} // 🔥 zwingt Leaflet zum Neuladen
                attribution="© OpenStreetMap contributors"
                url={tileUrl}
            />

            <FlyToSelected node={selectedNode} />

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