import { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { LatLngExpression } from "leaflet";
import type * as GeoJSON from "geojson";

import { useNodeStore } from "../../store/useNodeStore";
import type { NodeInfo } from "../../types/nodes";

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
   Fly to selected
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
   Layer Toggle Control
   ========================= */
function LayerToggleControl() {
    const map = useMap();

    useEffect(() => {
        let control: L.Control | null = null;

        map.whenReady(() => {
            control = new L.Control({ position: "bottomleft" });

            control.onAdd = () => {
                const div = L.DomUtil.create("div", "map-toolbar");
                L.DomEvent.disableClickPropagation(div);

                div.innerHTML = `
                    <label><input id="toggle-poly" type="checkbox" checked /> Coverage</label><br/>
                    <label><input id="toggle-heat" type="checkbox" checked /> Heatmap</label>
                `;
                return div;
            };

            control.addTo(map);

            const toggle = () => {
                const layers = (map as any)._coverageLayers;
                if (!layers) return;

                const poly = document.getElementById("toggle-poly") as HTMLInputElement | null;
                const heat = document.getElementById("toggle-heat") as HTMLInputElement | null;

                if (!poly || !heat) return;

                if (layers.polygon.current) {
                    poly.checked
                        ? layers.polygon.current.addTo(map)
                        : map.removeLayer(layers.polygon.current);
                }

                if (layers.heat.current) {
                    heat.checked
                        ? layers.heat.current.addTo(map)
                        : map.removeLayer(layers.heat.current);
                }
            };

            document
                .getElementById("toggle-poly")
                ?.addEventListener("change", toggle);

            document
                .getElementById("toggle-heat")
                ?.addEventListener("change", toggle);
        });

        return () => {
            if (control) {
                control.remove();
            }
        };
    }, [map]);

    return null;
}

/* =========================
   Coverage Overlay
   ========================= */
function CoverageOverlay({ node }: { node: NodeInfo | null }) {
    const map = useMap();

    const polygonRef = useRef<L.GeoJSON | null>(null);
    const heatRef = useRef<L.Layer | null>(null);

    useEffect(() => {
        if (!node?.maps_marker) return;

        fetch(`${API_BASE}/api/coverage/${node.node_from}`)
            .then((r) => r.json())
            .then((geojson: GeoJSON.FeatureCollection) => {

                // 🔵 Polygon
                const polygonFC: GeoJSON.FeatureCollection = {
                    type: "FeatureCollection",
                    features: geojson.features.filter(
                        (f) => f.geometry.type === "Polygon"
                    ),
                };

                polygonRef.current = L.geoJSON(polygonFC, {
                    style: (f) => ({
                        color: (f?.properties as any)?.color ?? "#2196f3",
                        weight: 1,
                        fillOpacity: 0.15,
                    }),
                }).addTo(map);

                // 🔥 Heatmap (nur Points!)
                const heatPoints: [number, number, number][] = geojson.features
                    .filter(
                        (f): f is GeoJSON.Feature<GeoJSON.Point> =>
                            f.geometry.type === "Point"
                    )
                    .map((f) => {
                        const [lon, lat] = f.geometry.coordinates;
                        const weight = (f.properties as any)?.weight ?? 0.5;
                        return [lat, lon, weight];
                    });

                heatRef.current = (L as any).heatLayer(heatPoints, {
                    radius: 25,
                    blur: 20,
                    minOpacity: 0.1,
                    gradient: {
                        1.0: "rgba(16,145,3,0.4)",
                        0.7: "#13ba00",
                        0.5: "#ffeb3b",
                        0.3: "#ff9800",
                        0.0: "#e53935",
                    },
                }).addTo(map);

                map.fitBounds(polygonRef.current.getBounds(), {
                    padding: [30, 30],
                });
            });

        return () => {
            polygonRef.current?.remove();
            heatRef.current?.remove();
            polygonRef.current = null;
            heatRef.current = null;
        };
    }, [node, map]);

    // Expose for toggle
    (map as any)._coverageLayers = {
        polygon: polygonRef,
        heat: heatRef,
    };

    return null;
}

/* =========================
   Resize Fix
   ========================= */
function MapResizeFix({ trigger }: { trigger: unknown }) {
    const map = useMap();

    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 200);
        return () => clearTimeout(t);
    }, [trigger, map]);

    return null;
}

/* =========================
   Main Component
   ========================= */
type Props = {
    fullscreen: boolean;
    onToggleFullscreen: () => void;
};

export function MapPanel({ fullscreen, onToggleFullscreen }: Props) {
    const nodes = useNodeStore((s) => s.nodes);
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    const tileUrl =
        document.documentElement.getAttribute("data-theme") === "dark"
            ? DARK_TILE
            : LIGHT_TILE;

    return (
        <div className={`map-wrapper ${fullscreen ? "fullscreen" : ""}`}>
            <button
                className="map-fullscreen-btn"
                onClick={onToggleFullscreen}
            >
                ⤢
            </button>

            <MapContainer
                center={center}
                zoom={11}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url={tileUrl} />

                <MapResizeFix trigger={fullscreen} />
                <FlyToSelected node={selectedNode} />
                <CoverageOverlay node={selectedNode} />
                <LayerToggleControl />

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
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
}