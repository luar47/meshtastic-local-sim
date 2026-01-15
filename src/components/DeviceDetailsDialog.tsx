import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import type { NodeInfo } from "../types/nodes";
import {DistanceCell} from "./nodetable/lastDistanceToUser.tsx";
import {LastSeenCell} from "./nodetable/lastSeenCell.tsx";
import { useEffect, useState } from "react";
import { fetchNodeMetrics } from "../api/nodeMetrics";
import { NodeMetricsChart } from "./NodeMetricsChart";
import type {NodeMetricsResponse} from "../api/nodeMetrics";



type Props = {
    visible: boolean;
    device: NodeInfo | null;
    onHide: () => void;
};


export function DeviceDetailsDialog({ visible, device, onHide }: Props) {

    const [metrics, setMetrics] = useState<NodeMetricsResponse | null>(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);


    useEffect(() => {
        if (!visible || !device) return;

        setLoadingMetrics(true);

        fetchNodeMetrics(device.node_from)
            .then(setMetrics)
            .catch(console.error)
            .finally(() => setLoadingMetrics(false));

        }, [visible, device?.node_id]);



    if (!device) return null;
    const online = device.rssi > -80;





    return (
        <Dialog
            header={`Gerät: ${device.shortname}`}
            visible={visible}
            style={{ width: "420px", height: "80vh" }}
            onHide={onHide}
            modal
            appendTo={document.body}
        >
            <div className="device-dialog">
                <div>
                    <strong>Name:</strong> {device.longname}
                </div>
                <div>
                    <strong>Distanz:</strong> <DistanceCell node={device}></DistanceCell>

                </div>

                <div>
                    <strong>ID:</strong> <code>{device.node_id}</code>
                </div>

                <div>
                    <strong>Status:</strong>{" "}
                    <Tag
                        severity={online ? "success" : "danger"}
                        value={online ? "Online" : "Schwach"}
                    />
                </div>

                <div>
                    <strong>RSSI:</strong> {device.rssi} dBm
                </div>

                <div>
                    <strong>SNR:</strong> {device.snr} dB
                </div>

                <div>
                    <strong>Last seen:</strong>{" "}
                    {new Date(device.last_seen).toLocaleString("de-DE")}
                    {" "}
                    <LastSeenCell ts={device.last_seen}></LastSeenCell>
                </div>
                <div>

                    <h4>Signalverlauf</h4>
                    {loadingMetrics && <div>Lade Messdaten…</div>}
                    <div className="device-dialog-root">
                        <div className="device-dialog-chart" style={{position: "relative", height: "240vh"}}>

                            {metrics && <NodeMetricsChart metrics={metrics}/>}
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}