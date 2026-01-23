import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import {CoverageLayer} from "./CoverageLayer.tsx";
import { useNodeStore } from "../../store/useNodeStore";
import type { NodeInfo } from "../../types/nodes";
import {CoverageToggleControl} from "./CoverageToggleControl.tsx";


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

/* =========================
   Coverage Overlay
   ========================= */

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
                <CoverageLayer nodes={nodes}/>
                <CoverageToggleControl/>

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