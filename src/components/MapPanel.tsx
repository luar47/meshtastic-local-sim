import { useEffect, useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

import { useNodeStore } from "../store/useNodeStore";
import type { NodeInfo } from "../types/nodes";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* =========================
   Konfiguration
   ========================= */
const center: LatLngExpression = [49.75, 6.64];

const LIGHT_TILE =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const DARK_TILE =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

/* =========================
   Helfer: Fly to selected
   ========================= */
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

/* =========================
   Helfer: Coverage Overlay
   ========================= */
function CoverageOverlay({ node }: { node: NodeInfo | null }) {
    const map = useMap();
    const layerRef = useRef<L.GeoJSON | null>(null);

    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.remove();
            layerRef.current = null;
        }

        if (!node?.maps_marker) return;

        fetch(`${API_BASE}/api/coverage/${node.node_from}`)
            .then((r) => r.json())
            .then((geojson) => {
                const layer = L.geoJSON(geojson, {
                    style: () => ({
                        color: "#3a62dd",
                        weight: 1,
                        fillOpacity: 0.25,
                    }),
                });

                layer.addTo(map);
                layerRef.current = layer;

                map.fitBounds(layer.getBounds(), { padding: [30, 30] });
            })
            .catch(console.error);

        return () => {
            if (layerRef.current) {
                layerRef.current.remove();
                layerRef.current = null;
            }
        };
    }, [node, map]);

    return null;
}


/* =========================
   Hauptkomponente
   ========================= */

function MapResizeFix({ trigger }: { trigger: any }) {
    const map = useMap();

    useEffect(() => {
        // ⏱️ kleiner Delay, damit CSS zuerst greift
        const t = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => clearTimeout(t);
    }, [trigger, map]);

    return null;
}

type Props = {
    fullscreen: boolean;
    onToggleFullscreen: () => void;
};



export function MapPanel({ fullscreen, onToggleFullscreen }: Props) {
    const nodes = useNodeStore((s) => s.nodes);
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    const mapWrapperRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    /* 🌗 Dark-Mode Erkennung */
    const getDarkMode = () =>
        document.documentElement.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [isDark, setIsDark] = useState(getDarkMode);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const sync = () => setIsDark(getDarkMode());

        sync();

        try {
            media.addEventListener("change", sync);
        } catch {
            media.addListener(sync);
        }

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

    /* 🔳 Fullscreen Toggle */

    useEffect(() => {
        const handler = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handler);
        return () =>
            document.removeEventListener("fullscreenchange", handler);
    }, []);

    const tileUrl = isDark ? DARK_TILE : LIGHT_TILE;

    return (
        <div
            ref={mapWrapperRef}
            className={`map-wrapper ${isFullscreen ? "fullscreen" : ""}`}
        >
            {/* 🔘 Fullscreen Button */}
            <button
                className="map-fullscreen-btn"
                onClick={onToggleFullscreen}
                title="Fullscreen"
            >
                {fullscreen ? "⤢" : "⤢"}
            </button>

            <MapContainer
                center={center}
                zoom={11}
                style={{height: "100%", width: "100%"}}
            >
                <TileLayer
                    key={tileUrl}
                    attribution="© OpenStreetMap contributors"
                    url={tileUrl}
                />

                <MapResizeFix trigger={fullscreen} />

                <FlyToSelected node={selectedNode}/>
                <CoverageOverlay node={selectedNode}/>

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
                                    <br/>
                                    {n.longname}
                                    <br/>
                                    Status: {m.status}
                                    <br/>
                                    Letzte Aktivität:
                                    <br/>
                                    {new Date(m.last_seen).toLocaleString("de-DE")}
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
}