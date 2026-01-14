import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import type { NodeInfo } from "../types/nodes";

type Props = {
    visible: boolean;
    device: NodeInfo | null;
    onHide: () => void;
};

export function DeviceDetailsDialog({ visible, device, onHide }: Props) {
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
                </div>
            </div>
        </Dialog>
    );
}