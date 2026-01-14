import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { NodeInfo } from "../types/nodes";
import { DeviceDetailsDialog } from "./DeviceDetailsDialog";

import { timeAgo } from "../utils/time";
import { useNow } from "../hooks/useNow";



export function NodeTable({ nodes }: { nodes: NodeInfo[] }) {
    const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const now = useNow(1000)

    return (
        <>
            <DataTable
                key={now}
                value={nodes}
                size="small"
                stripedRows
                scrollable
                scrollHeight="flex"
                className="node-table"
                selectionMode="single"
                selection={selectedNode}
                onSelectionChange={(e) => {
                const node = e.value as NodeInfo | null;
                setSelectedNode(node);
                setDialogVisible(true);
            }}
                dataKey="node_id"
            >
                <Column field="shortname" header="Node" />
                <Column field="longname" header="Name" />
                <Column field="hardware" header="Hardware" />

                <Column
                    field="rssi"
                    header="RSSI"
                    body={(n: NodeInfo) => (
                        <span className={n.rssi > -80 ? "rssi-ok" : "rssi-warn"}>
                            {n.rssi} dBm
                        </span>
                    )}
                />

                <Column field="snr" header="SNR" />
                <Column field="hops_away" header="Hops Away" />
                <Column field="hop_start" header="Hops Start" />

                <Column
                    field="last_seen"
                    header="Last seen"
                    body={(n: NodeInfo) =>
                        timeAgo(n.last_seen, now)}
                />
            </DataTable>

            <DeviceDetailsDialog
                visible={dialogVisible}
                device={selectedNode}
                onHide={() => setDialogVisible(false)}
            />
        </>
    );
}