import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import type { NodeInfo } from "../types/nodes";
import { useNodeStore } from "../store/useNodeStore";
import { LastSeenCell } from "./nodetable/lastSeenCell.tsx";import { timeAgo } from "../utils/time";
import { DeviceDetailsDialog } from "./DeviceDetailsDialog";
import {DistanceCell} from "./nodetable/lastDistanceToUser.tsx";

export function NodeTable() {
    const [dialogVisible, setDialogVisible] = useState(false);

    // Zustand Store
    const nodes = useNodeStore((s) => s.nodes);
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);


    return (
        <>
            <DataTable
                value={nodes}
                size="small"
                stripedRows
                rowHover
                scrollable
                scrollHeight="flex"
                className="node-table clickable"
                dataKey="node_id"
                selectionMode="single"
                selection={selectedNode}
                onSelectionChange={(e) => {
                    const node = e.value as NodeInfo | null;
                    if (node) {
                        setSelectedNode(node);
                        setDialogVisible(true);
                    }
                }}
                emptyMessage="Keine Geräte gefunden"
                header={`Nodes (${nodes.length})`}
            >
                {/* Basisinfos */}
                <Column field="shortname" header="Node" style={{ width: "90px" }} />
                <Column field="longname" header="Name" style={{ minWidth: "160px" }} />
                <Column field="hardware" header="HW" style={{ width: "90px" }} />

                {/* Funk */}
                <Column
                    header="RSSI"
                    body={(n: NodeInfo) => {
                        const cls =
                            n.rssi > -70
                                ? "rssi-ok"
                                : n.rssi > -85
                                    ? "rssi-mid"
                                    : "rssi-warn";

                        return (
                            <span className={cls}>
                                {n.rssi} dBm
                            </span>
                        );
                    }}
                    style={{ width: "90px" }}
                />

                <Column field="snr" header="SNR" style={{ width: "70px" }} />

                <Column
                    header="Distanz"
                    body={(n: NodeInfo) => (
                        <DistanceCell node={n} />
                    )}
                    style={{ width: "110px" }}
                />

                <Column field="hops_away" header="Hops" style={{ width: "70px" }} />
                <Column field="hop_start" header="Start" style={{ width: "70px" }} />


                {/* Zeit */}
                <Column
                    header="Aktivität"
                    body={(n: NodeInfo) => <LastSeenCell ts={n.last_seen} />}
                />
            </DataTable>

            {/* Details Dialog */}
            <DeviceDetailsDialog
                visible={dialogVisible}
                device={selectedNode}
                onHide={() => setDialogVisible(false)}
            />
        </>
    );
}