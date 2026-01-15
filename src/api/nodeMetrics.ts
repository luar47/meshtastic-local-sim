const API_BASE = import.meta.env.VITE_API_BASE_URL;

export type NodeMetricsResponse = {
    timestamps: number[];
    rssi: number[];
    snr: number[];
    air_util_tx: number[]
    battery_level: number[]
    channel_utilization: number[]
    uptime_seconds: number[]
    voltage: number[]

};

export async function fetchNodeMetrics(nodeId: number): Promise<NodeMetricsResponse> {
    const res = await fetch(`${API_BASE}/api/nodes/${nodeId.toString()}/metrics`);
    if (!res.ok) {
        throw new Error("Failed to load metrics");
    }
    return res.json();
}