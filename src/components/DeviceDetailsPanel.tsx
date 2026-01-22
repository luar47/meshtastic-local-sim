import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";

import type { NodeInfo } from "../types/nodes";
import { DeviceTechnicalDetailsPanel } from "./deviceDetailsOverlay/DeviceTechnicalDetailsPanel";
import { SignalStrengthPanel } from "./deviceDetailsOverlay/SignalStrengthPanel";
import { DistanceCell } from "./nodetable/lastDistanceToUser";
import { LastSeenCell } from "./nodetable/lastSeenCell";
import { Skeleton } from "primereact/skeleton";

import { fetchNodeMetrics } from "../api/nodeMetrics";
import type { NodeMetricsResponse } from "../api/nodeMetrics";
import { NodeMetricsConnectionChart } from "./deviceDetailsOverlay/NodeMetricsConnectionChart";
import { NodeMetricsEnergyChart } from "./deviceDetailsOverlay/NodeMetricsEnergyChart";

type Props = {
    device: NodeInfo;
    onCloseMobile?: () => void;
};

export function DeviceDetailsPanel({ device, onCloseMobile }: Props) {
    const [metrics, setMetrics] = useState<NodeMetricsResponse | null>(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);




    useEffect(() => {
        if (!device) return;

        setLoadingMetrics(true);

        fetchNodeMetrics(device.node_from)
            .then(setMetrics)
            .catch(console.error)
            .finally(() => setLoadingMetrics(false));
    }, [device.node_id]);

    const online = device.rssi > -80;



    return (
        <div className="device-panel-content device-fade">

            {/* 📱 MOBILE HEADER */}
            {onCloseMobile && (
                <div className="device-mobile-header">
                    <span className="device-mobile-title">
                        {device.shortname}
                    </span>
                    <button
                        className="device-mobile-close"
                        onClick={onCloseMobile}
                        aria-label="Schließen"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* 📦 BASISDATEN */}
            <Card
                className="device-card"
                title={`${device.longname}`}
            >
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

            {/* 🧩 TECHNISCHE DETAILS */}
            <DeviceTechnicalDetailsPanel node={device} />

            {/* 📈 METRIKEN */}
            <Card className="device-card" title="Batterie und Verbindung">
                <h3>Signalverlauf</h3>
                {loadingMetrics && (
                    <>
                        <Skeleton height="1.5rem" width="60%" className="mb-2" />
                        <Skeleton height="150px" className="mb-3" />
                        <Skeleton height="150px" />
                    </>
                )}

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