import {Dialog} from "primereact/dialog";
import {Card} from 'primereact/card';
import {Tag} from "primereact/tag";
import {DeviceTechnicalDetailsPanel} from "./deviceDetailsOverlay/DeviceTechnicalDetailsPanel.tsx";
import {SignalStrengthPanel} from "./deviceDetailsOverlay/SignalStrengthPanel.tsx";
import type {NodeInfo} from "../types/nodes";
import {DistanceCell} from "./nodetable/lastDistanceToUser.tsx";
import {LastSeenCell} from "./nodetable/lastSeenCell.tsx";
import {useEffect, useState} from "react";
import {fetchNodeMetrics} from "../api/nodeMetrics";
import {NodeMetricsConnectionChart} from "./deviceDetailsOverlay/NodeMetricsConnectionChart.tsx";
import type {NodeMetricsResponse} from "../api/nodeMetrics";
import {NodeMetricsEnergyChart} from "./deviceDetailsOverlay/NodeMetricsEnergyChart.tsx";


type Props = {
    visible: boolean;
    device: NodeInfo | null;
    onHide: () => void;
};


export function DeviceDetailsDialog({visible, device, onHide}: Props) {

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
            style={{width: "80vh", height: "300vh"}}
            onHide={onHide}
            modal
            appendTo={document.body}
        >
            <div className="device-dialog">
                <Card className="device-card" title={device.longname}>
                    <div className="device-header">

                        <div className="device-status-row">
                            <Tag
                                severity={online ? "success" : "danger"}
                                value={online ? "Online" : "Schwach"}
                            />
                            <a>Letztes Signal:</a>
                            <LastSeenCell ts={device.last_seen} />
                        </div>

                        <div className="device-distance-row">
                            <i className="pi pi-map-marker" />
                            <a>Distanz:</a>
                            <DistanceCell node={device} />
                        </div>

                    </div>

                    <SignalStrengthPanel
                        rssi={device.rssi}
                        snr={device.snr}
                    />
                </Card>

                <DeviceTechnicalDetailsPanel node={device}/>


                <Card className="device-card" title="Batterie und Verbindung">
                    <div>
                        <h3>Signalverlauf</h3>
                        {loadingMetrics && <div>Lade Messdaten…</div>}
                        <div className="device-dialog-root">
                            <div className="device-dialog-chart" style={{position: "relative"}}>
                                {metrics && <NodeMetricsConnectionChart metrics={metrics}/>}
                            </div>

                        </div>
                        <div>
                            <h3>Batteriezustand</h3>
                            <div className="device-dialog-root">
                                <div className="device-dialog-chart" style={{position: "relative"}}>
                                    {metrics && <NodeMetricsEnergyChart metrics={metrics}/>}
                                </div>
                            </div>

                            </div>
                        </div>

                </Card>




            </div>
        </Dialog>
);
}