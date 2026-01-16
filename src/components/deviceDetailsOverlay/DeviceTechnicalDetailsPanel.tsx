import { Panel } from "primereact/panel";
import type { NodeInfo } from "../../types/nodes";

type Props = {
    node: NodeInfo;
};

export function DeviceTechnicalDetailsPanel({ node }: Props) {
    return (
        <Panel
            header="Technische Details"
            toggleable

            className="tech-details-panel"
            expandIcon="pi pi-chevron-down"
            collapseIcon="pi pi-chevron-up"
        >
            <div className="tech-details-grid">

                <DetailRow
                    icon="pi pi-id-card"
                    label="Node ID"
                    value={node.node_id}
                />


                <DetailRow
                    icon="pi pi-wifi"
                    label="RSSI"
                    value={`${node.rssi} dBm`}
                />

                <DetailRow
                    icon="pi pi-wave-pulse"
                    label="SNR"
                    value={`${node.snr} dB`}
                />

                <DetailRow
                    icon="pi pi-directions"
                    label="Hops"
                    value={`${node.hops_away} / ${node.hop_start}`}
                />

                <DetailRow
                    icon="pi pi-microchip"
                    label="Hardware"
                    value={String(node.hardware)}
                />

            </div>
        </Panel>
    );
}

function DetailRow({
                       icon,
                       label,
                       value,
                   }: {
    icon: string;
    label: string;
    value: string;
}) {
    return (
        <div className="tech-detail-row">
            <div className="tech-detail-label">
                <i className={icon} />
                <span>{label}</span>
            </div>
            <div className="tech-detail-value">{value}</div>
        </div>
    );
}