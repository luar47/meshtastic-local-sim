import { Menubar } from "primereact/menubar";



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
            Meshtastic SaarMosel.social
        </strong>
    );





    return (
        <Menubar
            model={items}
            start={start}
            className="device-navbar"
        />
    );
}