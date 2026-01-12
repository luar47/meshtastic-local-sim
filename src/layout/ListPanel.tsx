import { useEffect, useState } from "react";
import { NodeTable } from "../components/NodeTable.tsx";
import { fetchNodes } from "../api/nodes";
import type { NodeInfo } from "../types/nodes";

export function ListPanel() {
    const [nodes, setNodes] = useState<NodeInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNodes()
            .then(setNodes)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ padding: 12 }}>Lade Nodes…</div>;
    }

    return <NodeTable nodes={nodes} />;
}