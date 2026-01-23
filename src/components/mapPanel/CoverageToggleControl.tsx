import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function CoverageToggleControl() {
    const map = useMap();

    useEffect(() => {
        // ✅ KORREKT: Klasse statt Factory
        const layerControl = new L.Control({ position: "bottomleft" });

        layerControl.onAdd = () => {
            const div = L.DomUtil.create(
                "div",
                "leaflet-control leaflet-bar coverage-toggle map-toolbar"
            );

            div.innerHTML = `
                <label>
                    <input type="checkbox" id="cov-poly" checked />
                    Coverage
                </label><br/>
                <label>
                    <input type="checkbox" id="cov-heat" checked />
                    Heatmap
                </label>
            `;

            L.DomEvent.disableClickPropagation(div);
            return div;
        };

        layerControl.addTo(map);

        const update = () => {
            const groups = (map as any)._coverageGroups;
            if (!groups) return;

            const poly = document.getElementById("cov-poly") as HTMLInputElement;
            const heat = document.getElementById("cov-heat") as HTMLInputElement;

            if (groups.polygon) {
                poly.checked
                    ? groups.polygon.addTo(map)
                    : groups.polygon.removeFrom(map);
            }

            if (groups.heat) {
                heat.checked
                    ? groups.heat.addTo(map)
                    : groups.heat.removeFrom(map);
            }
        };

        // DOM erst nach Render verfügbar
        setTimeout(() => {
            document
                .getElementById("cov-poly")
                ?.addEventListener("change", update);
            document
                .getElementById("cov-heat")
                ?.addEventListener("change", update);
        }, 0);

        return () => {
            layerControl.remove();
        };
    }, [map]);

    return null;
}