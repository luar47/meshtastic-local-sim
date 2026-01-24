import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function CoverageLayerControl() {
    const map = useMap();

    useEffect(() => {
        const groups = (map as any)._coverageGroups;
        if (!groups) return;

        const control = L.control.layers(
            {},
            {
                "📡 Coverage": groups.polygon,
                "🔥 Heatmap": groups.heat,
            },
            { collapsed: false }
        );

        control.addTo(map);

        return () => {
            control.remove();
        };
    }, [map]);

    return null;
}