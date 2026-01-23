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

    useEffect(() => {
        polygonGroup.current.addTo(map);
        heatGroup.current.addTo(map);

        polygonGroup.current.clearLayers();
        heatGroup.current.clearLayers();

        nodes.forEach((node) => {
            if (!node.coverage?.features?.length) return;

            const features = node.coverage.features;

            /* 🟦 POLYGON */
            const polygonFeatures = features.filter(
                (f): f is GeoJSON.Feature<GeoJSON.Polygon> =>
                    f.geometry.type === "Polygon"
            );

            if (polygonFeatures.length) {
                const polygonFC = {
                    type: "FeatureCollection",
                    features: polygonFeatures,
                } as GeoJSON.FeatureCollection;

                const poly = L.geoJSON(polygonFC, {
                    style: (f) => ({
                        color:
                            (f?.properties as any)?.color ?? "#2196f3",
                        weight: 1,
                        fillOpacity: 0.15,
                    }),
                });

                polygonGroup.current.addLayer(poly);
            }

            /* 🔥 HEATMAP */
            const heatPoints: [number, number, number][] = features
                .filter(
                    (f): f is GeoJSON.Feature<GeoJSON.Point> =>
                        f.geometry.type === "Point"
                )
                .map((f) => {
                    const [lon, lat] = f.geometry.coordinates;
                    const raw = (f.properties as any)?.weight ?? 0.4;
                    const weight = Math.max(0.03, Math.pow(raw, 2.2));
                    return [lat, lon, weight];
                });

            if (heatPoints.length) {
                const heat = (L as any).heatLayer(heatPoints, {
                    radius: 25,
                    blur: 20,
                    minOpacity: 0.1,
                    maxZoom: 18,
                    gradient: {
                        1.0: "rgba(16,145,3,0.4)",
                        0.3: "#ffeb3b",
                        0.0: "#e53935",
                    },
                });

                heatGroup.current.addLayer(heat);
            }
        });

        (map as any)._coverageGroups = {
            polygon: polygonGroup.current,
            heat: heatGroup.current,
        };

        return () => {
            polygonGroup.current.remove();
            heatGroup.current.remove();
        };
    }, [nodes, map]);

    return null;
}