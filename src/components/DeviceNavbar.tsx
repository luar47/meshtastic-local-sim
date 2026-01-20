import { Menubar } from "primereact/menubar";



export function DeviceNavbar() {
    const items = [
        {
            label: "Gerät: LAHQ",
            icon: "pi pi-microchip",
            items: [
                { label: "LAHQ – SyncAbout Headquarter" }
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