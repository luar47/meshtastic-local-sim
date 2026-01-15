import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import type { NodeInfo } from "../types/nodes";
import {useNow} from "../hooks/useNow.ts";
import {timeAgo} from "../utils/time.ts";
import {DistanceCell} from "./nodetable/lastDistanceToUser.tsx";


type Props = {
    visible: boolean;
    device: NodeInfo | null;
    onHide: () => void;
};

export function DeviceDetailsDialog({ visible, device, onHide }: Props) {
    const now = useNow(1000)

    if (!device) return null;
    const online = device.rssi > -80;



    return (
        <Dialog
            header={`Gerät: ${device.shortname}`}
            visible={visible}
            style={{ width: "420px" }}
            onHide={onHide}
            modal
        >
            <div className="device-dialog">
                <div>
                    <strong>Name:</strong> {device.longname}
                </div>
                <div>
                    <strong>Distanz:</strong> <DistanceCell node={device} ></DistanceCell>

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
                    <a>({timeAgo(device.last_seen, now)})</a>
                </div>
            </div>
        </Dialog>
    );
}