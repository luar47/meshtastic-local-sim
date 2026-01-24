import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

import type { NodeInfo } from "../../types/nodes";

type Props = {
    nodes: NodeInfo[];
};

export function CoverageLayer({ nodes }: Props) {
    const map = useMap();

    const polygonGroup = useRef<L.LayerGroup>(L.layerGroup());
    const heatGroup = useRef<L.LayerGroup>(L.layerGroup());

    /* =========================
       Scale (einmalig)
       ========================= */
    useEffect(() => {
        L.control.scale({ metric: true, imperial: false }).addTo(map);
    }, [map]);

    /* =========================
       Coverage neu aufbauen
       ========================= */
    useEffect(() => {
        polygonGroup.current.clearLayers();
        heatGroup.current.clearLayers();

        nodes.forEach((node) => {
            if (!node.coverage?.features?.length) return;

            const features = node.coverage.features;

            /* ---------- 🟦 Polygon ---------- */
            const polygonFeatures = features.filter(
                (f): f is GeoJSON.Feature<GeoJSON.Polygon> =>
                    f.geometry.type === "Polygon"
            );

            if (polygonFeatures.length) {
                const poly = L.geoJSON(polygonFeatures,

                    {
                        style: (f) => ({
                            color:
                                (f?.properties as any)?.color ?? "#2196f3",
                            weight: 1,
                            fillOpacity: 0.15,
                        }),
                    }
                );

                polygonGroup.current.addLayer(poly);
            }

            /* ---------- 🔥 Heatmap ---------- */
            const heatPoints: [number, number, number][] = features
                .filter(
                    (f): f is GeoJSON.Feature<GeoJSON.Point> =>
                        f.geometry.type === "Point"
                )
                .map((f) => {
                    const [lon, lat] = f.geometry.coordinates;
                    const raw = (f.properties as any)?.weight ?? 0.4;
                    return [lat, lon, Math.max(0.03, Math.pow(raw, 2.2))];
                });

            if (heatPoints.length) {
                const heat = (L as any).heatLayer(heatPoints, {
                    radius: 20,
                    blur: 15,
                    minOpacity: 0.2,
                    maxZoom: 18,
                    gradient: {
                        1.0: "rgba(16,145,3,0.4)",
                        0.7: "#13ba00",
                        0.5: "#ffeb3b",
                        0.3: "#ff9800",
                        0.1: "#e53935",
                    },
                });

                heatGroup.current.addLayer(heat);
            }
        });

        heatGroup.current.addTo(map);

        /* 🔗 Für LayerControl verfügbar machen */
        (map as any)._coverageGroups = {

            polygon: polygonGroup.current,
            heat: heatGroup.current,
        };
    }, [nodes, map]);

    return null;
}