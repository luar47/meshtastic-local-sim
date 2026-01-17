import { Menubar } from "primereact/menubar";
import { Tag } from "primereact/tag";

export function DeviceNavbar() {
    const items = [
        {
            label: "Gerät: LAP1",
            icon: "pi pi-microchip",
            items: [
                { label: "LAP1 – SyncAbout Pocket" },
                { label: "LAP2 – Test Node" },
                { label: "LAP3 – Mobile Node" },
            ],
        },
    ];

    const start = (
        <strong style={{ paddingLeft: 8 }}>
            SaarMosel.social Mesh
        </strong>
    );

    const end = (
        <Tag severity="success" value="Online" />
    );

    return (
        <Menubar
            model={items}
            start={start}
            end={end}
            className="device-navbar"
        />
    );
}