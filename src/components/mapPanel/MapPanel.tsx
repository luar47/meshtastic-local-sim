import {useEffect} from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import type {LatLngExpression} from "leaflet";
import {CoverageLayer} from "./CoverageLayer.tsx";
import {useNodeStore} from "../../store/useNodeStore";
import type {NodeInfo} from "../../types/nodes";
import {CoverageLayerControl} from "./CoverageToggleControl.tsx";
import L from "leaflet";
import {MeasureControl} from "./MeasureControl";
import {NodeSelectionControl} from "./NodeSelectionControl.tsx";

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
function FlyToSelected({node}: { node: NodeInfo | null }) {
    const map = useMap();

    useEffect(() => {
        if (!node?.maps_marker) return;

        map.flyTo(
            [node.maps_marker.lat, node.maps_marker.lon],
            14,
            {duration: 0.8}
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
function MapResizeFix({trigger}: { trigger: unknown }) {
    const map = useMap();


    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 200);
        return () => clearTimeout(t);
    }, [trigger, map]);

    return null;
}

function createMeshtasticIcon(
    color: string,
    selected: boolean
) {
    const size = selected ? [32, 48] : [24, 36];
    const glow = selected
        ? `filter: drop-shadow(0 0 8px ${color});`
        : "";

    return L.divIcon({
        className: "meshtastic-marker",
        html: `
      <svg width="${size[0]}" height="${size[1]}" viewBox="0 0 36 48"
           style="${glow}"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 1
             C9 1 2 8 2 17
             c0 11 16 30 16 30
             s16-19 16-30
             C34 8 27 1 18 1z"
          fill="${color}"
          stroke="${selected ? "#fff" : "#111"}"
          stroke-width="${selected ? 3 : 2}"
        />
        <circle cx="18" cy="17" r="8" fill="#111"/>
        <path d="M14 17 a4 4 0 0 1 8 0"
          fill="none" stroke="#fff" stroke-width="1.5"/>
        <path d="M12 17 a6 6 0 0 1 12 0"
          fill="none" stroke="#fff" stroke-width="1.2" opacity="0.7"/>
      </svg>
    `,
        iconSize: size as [number, number],
        iconAnchor: [size[0] / 2, size[1]],
        popupAnchor: [0, -size[1] + 10],
    });
}
function getMarkerColor(node: NodeInfo): string {
    if (node.rssi === undefined || node.rssi === null) {
        return "#9e9e9e"; // unbekannt
    }

    if (node.rssi > -75) return "#2ecc71";   // gut
    if (node.rssi > -90) return "#f1c40f";   // mittel
    return "#e74c3c";                         // schlecht
}

function isNodeSelected(
    node: NodeInfo,
    selectedNodes: NodeInfo[]
): boolean {
    return selectedNodes.some((n) => n.node_id === node.node_id);
}


/* =========================
   Main Component
   ========================= */
type Props = {
    fullscreen: boolean;
    onToggleFullscreen: () => void;
};

export function MapPanel({fullscreen, onToggleFullscreen}: Props) {
    const nodes = useNodeStore((s) => s.nodes);
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    const selectedNodes = useNodeStore((s) => s.selectedNodes);



    const isMobile = window.matchMedia("(max-width: 900px)").matches;

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
                style={{height: "100%", width: "100%"}}
            >
                <TileLayer url={tileUrl}/>

                <MapResizeFix trigger={fullscreen}/>
                <FlyToSelected node={selectedNode}/>
                <CoverageLayer nodes={nodes}/>
                <CoverageLayerControl/>
                <MeasureControl/>
                <NodeSelectionControl nodes={nodes}/>


                {nodes
                    .filter((n) => n.maps_marker)
                    .map((n) => {
                        const m = n.maps_marker!;
                        const color = getMarkerColor(n);
                        const selected = isNodeSelected(n, selectedNodes);

                        return (
                            <Marker
                                key={n.node_id}
                                position={[m.lat, m.lon]}
                                icon={createMeshtasticIcon(color, selected)}
                                eventHandlers={{
                                    click: () => {
                                        if (!isMobile) {
                                            setSelectedNode(n);
                                        }
                                    },
                                }}
                            >
                                {!isMobile && (
                                    <Popup>
                                        <strong>{n.shortname}</strong>
                                        <br />
                                        {n.longname}
                                        <br />
                                        RSSI: {n.rssi ?? "–"} dBm
                                    </Popup>
                                )}
                        );

                                <Popup>
                                    <strong>{n.shortname}</strong>
                                    <br/>
                                    {n.longname}
                                    <br/>
                                    RSSI: {n.rssi ?? "–"} dBm
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
}