import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useNodeStore } from "../../store/useNodeStore";
import type { NodeInfo } from "../../types/nodes";

type Props = {
    nodes: NodeInfo[];
};

export function NodeSelectionControl({ nodes }: Props) {
    const map = useMap();
    const setSelectedNodes = useNodeStore((s) => s.setSelectedNodes);

    // ⬅️ neutral initialisieren!
    const zoomBefore = useRef<number | null>(null);

    useEffect(() => {
        map.boxZoom.enable();

        const onBoxZoomStart = () => {
            zoomBefore.current = map.getZoom();
        };

        const onBoxZoomEnd = (e: any) => {
            const bounds: L.LatLngBounds = e.boxZoomBounds;

            // 🛡 Sicherheitscheck
            if (zoomBefore.current !== null) {
                map.setZoom(zoomBefore.current, { animate: false });
            }

            const selected = nodes.filter((node) => {
                if (!node.maps_marker) return false;
                const { lat, lon } = node.maps_marker;
                return bounds.contains(L.latLng(lat, lon));
            });

            setSelectedNodes(selected);
            console.log("selected", selected);
        };

        map.on("boxzoomstart", onBoxZoomStart);
        map.on("boxzoomend", onBoxZoomEnd);

        return () => {
            map.off("boxzoomstart", onBoxZoomStart);
            map.off("boxzoomend", onBoxZoomEnd);
        };
    }, [map, nodes, setSelectedNodes]);

    return null;
}