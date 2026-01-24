import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-measure";

export function MeasureControl() {
    const map = useMap();

    useEffect(() => {
        const control = (L as any).control.measure({
            position: "bottomleft",
            primaryLengthUnit: "meters",
            secondaryLengthUnit: "kilometers",
            primaryAreaUnit: "sqmeters",
            secondaryAreaUnit: "hectares",
            activeColor: "#ff9800",
            completedColor: "#2196f3",
        });

        control.addTo(map);

        /* =========================
           🧠 Pan/Zoom HARD BLOCK
           ========================= */

        let panToBackup: any;
        let setViewBackup: any;
        let flyToBackup: any;

        map.on("measurestart", () => {
            panToBackup = map.panTo;
            setViewBackup = map.setView;
            flyToBackup = map.flyTo;

            map.panTo = () => map;
            map.setView = () => map;
            map.flyTo = () => map;
        });

        map.on("measurefinish", () => {
            if (panToBackup) map.panTo = panToBackup;
            if (setViewBackup) map.setView = setViewBackup;
            if (flyToBackup) map.flyTo = flyToBackup;
        });

        return () => {
            control.remove();
            if (panToBackup) map.panTo = panToBackup;
            if (setViewBackup) map.setView = setViewBackup;
            if (flyToBackup) map.flyTo = flyToBackup;
        };
    }, [map]);

    return null;
}