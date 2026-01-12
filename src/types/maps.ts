export type MapMarker = {
    id: string;
    lat: number;
    lon: number;
    label: string;
    status: "online" | "offline" | "alert";
    last_seen: number;
};