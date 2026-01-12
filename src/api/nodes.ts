import type { NodeInfo } from "../types/nodes";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchNodes(): Promise<NodeInfo[]> {
    const res = await fetch(`${API_BASE}/api/nodes`);
    if (!res.ok) {
        throw new Error("Failed to fetch nodes");
    }
    return res.json();
}