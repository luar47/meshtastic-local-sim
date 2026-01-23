export type MapMarker = {
    id: string;          // node number / numeric id als string
    label: string;
    lat: number;
    lon: number;
    altitude: number;
    last_seen: number;
    status: "online" | "idle" | "offline";
};

export type NodeCoverage = {
    type: "FeatureCollection";
    features: GeoJSON.Feature[];
    properties: {
        node_id: string;
        radius_m: number;
        height_m: number;
        frequency_mhz: number;
        model: string;
        layers: string[];
    };}


export type NodeInfo = {
    // Identität
    node_id: string;     // "!b9dad0a9"
    node_from: number;
    shortname: string;
    longname: string;
    sender: string;

    // Hardware / Rolle
    hardware: number;
    role: number;

    // Funk
    rssi: number;
    snr: number;
    hops_away: number;
    hop_start: number;

    // Zeit
    last_seen: number;   // ms!

    // 🔥 Map (optional!)
    maps_marker?: MapMarker;
    coverage?: NodeCoverage;
};