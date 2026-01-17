import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { NodeInfo } from "../types/nodes";
import { useNodeStore } from "../store/useNodeStore";
import { LastSeenCell } from "./nodetable/lastSeenCell";
import { DistanceCell } from "./nodetable/lastDistanceToUser";

export function NodeTable() {
    const nodes = useNodeStore((s) => s.nodes);
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    return (
        <DataTable
            value={nodes}
            dataKey="node_id"
            size="small"
            stripedRows
            rowHover
            scrollable
            scrollHeight="flex"
            className="node-table"
            selectionMode="single"
            selection={selectedNode}
            onSelectionChange={(e) => {
                const node = e.value as NodeInfo | null;
                if (node) setSelectedNode(node);
            }}
            emptyMessage="Keine Geräte gefunden"
            header={`Nodes (${nodes.length})`}
            sortField="last_seen"
            sortOrder={-1}
            resizableColumns
            columnResizeMode="fit"
        >
            {/* Node */}
            <Column
                field="shortname"
                header="Node"
                style={{ width: "90px" }}
            />

            {/* Name */}
            <Column
                field="longname"
                header="Name"
                style={{ minWidth: "180px" }}
            />

            {/* Distanz */}
            <Column
                header="Distanz"
                body={(n: NodeInfo) => <DistanceCell node={n} />}
                style={{ width: "110px", textAlign: "right" }}
            />

            {/* Höhe */}
            <Column
                field="maps_marker.altitude"
                header="Höhe"
                style={{ width: "90px", textAlign: "right" }}
            />

            {/* RSSI */}
            <Column
                header="RSSI"
                body={(n: NodeInfo) => {
                    const cls =
                        n.rssi > -70
                            ? "rssi-ok"
                            : n.rssi > -85
                                ? "rssi-mid"
                                : "rssi-warn";

                    return <span className={cls}>{n.rssi} dBm</span>;
                }}
                style={{ width: "90px", textAlign: "right" }}
            />

            {/* SNR */}
            <Column
                field="snr"
                header="SNR"
                style={{ width: "70px", textAlign: "right" }}
            />

            {/* Hops */}
            <Column
                field="hops_away"
                header="Hops"
                style={{ width: "70px", textAlign: "center" }}
            />

            {/* Aktivität */}
            <Column
                header="Aktivität"
                body={(n: NodeInfo) => <LastSeenCell ts={n.last_seen} />}
                style={{ width: "130px" }}
            />
        </DataTable>
    );
}