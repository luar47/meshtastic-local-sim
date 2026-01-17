import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";

import type { NodeInfo } from "../types/nodes";
import { DeviceTechnicalDetailsPanel } from "./deviceDetailsOverlay/DeviceTechnicalDetailsPanel";
import { SignalStrengthPanel } from "./deviceDetailsOverlay/SignalStrengthPanel";
import { DistanceCell } from "./nodetable/lastDistanceToUser";
import { LastSeenCell } from "./nodetable/lastSeenCell";

import { fetchNodeMetrics } from "../api/nodeMetrics";
import type { NodeMetricsResponse } from "../api/nodeMetrics";
import { NodeMetricsConnectionChart } from "./deviceDetailsOverlay/NodeMetricsConnectionChart";
import { NodeMetricsEnergyChart } from "./deviceDetailsOverlay/NodeMetricsEnergyChart";

type Props = {
    device: NodeInfo | null;
};

export function DeviceDetailsPanel({ device }: Props) {
    const [metrics, setMetrics] = useState<NodeMetricsResponse | null>(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);

    useEffect(() => {
        if (!device) return;

        setLoadingMetrics(true);

        fetchNodeMetrics(device.node_from)
            .then(setMetrics)
            .catch(console.error)
            .finally(() => setLoadingMetrics(false));
    }, [device?.node_id]);

    if (!device) {
        return (
            <div className="device-placeholder">
                Gerät auswählen
            </div>
        );
    }

    const online = device.rssi > -80;

    return (
        <div className="device-panel-content">

            <Card className="device-card" title={device.longname + " [" + device.shortname + "]"}>
                <div className="device-header">

                    <div className="device-status-row">
                        <Tag
                            severity={online ? "success" : "danger"}
                            value={online ? "Online" : "Schwach"}
                        />
                        <span>Letztes Signal:</span>
                        <LastSeenCell ts={device.last_seen} />
                    </div>

                    <div className="device-distance-row">
                        <i className="pi pi-map-marker" />
                        <span>Distanz:</span>
                        <DistanceCell node={device} />
                    </div>

                </div>

                <SignalStrengthPanel
                    rssi={device.rssi}
                    snr={device.snr}
                />
            </Card>

            <DeviceTechnicalDetailsPanel node={device} />

            <Card className="device-card" title="Batterie und Verbindung">
                <h3>Signalverlauf</h3>
                {loadingMetrics && <div>Lade Messdaten…</div>}

                <div className="device-dialog-chart">
                    {metrics && <NodeMetricsConnectionChart metrics={metrics} />}
                </div>

                <h3>Batteriezustand</h3>
                <div className="device-dialog-chart">
                    {metrics && <NodeMetricsEnergyChart metrics={metrics} />}
                </div>
            </Card>

        </div>
    );
}