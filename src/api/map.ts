import type { MapMarker } from "../types/maps";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchMarkers(): Promise<MapMarker[]> {
    const res = await fetch(`${API_BASE}/api/markers`);
    if (!res.ok) {
        throw new Error("Failed to fetch markers");
    }
    return res.json();
}