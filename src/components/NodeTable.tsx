import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { NodeInfo } from "../types/nodes.ts";

function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function NodeTable({ nodes }: { nodes: NodeInfo[] }) {
    return (
        <DataTable
            value={nodes}
            size="small"
            stripedRows
            scrollable
            scrollHeight="flex"
            className="node-table"
        >
            <Column field="shortname" header="Node" />
            <Column field="node_id" header="ID" />
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
            <Column
                field="last_seen"
                header="Last seen"
                body={(n: NodeInfo) => formatTime(n.last_seen)}
            />
        </DataTable>
    );
}