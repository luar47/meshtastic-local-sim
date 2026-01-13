export type NodeInfo = {
    node_id: string;
    shortname: string;
    longname: string;
    hardware: number;
    role: number;
    hops_away: number;
    hops_start: number;
    sender: string;
    rssi: number;
    snr: number;

    last_seen: number;
};