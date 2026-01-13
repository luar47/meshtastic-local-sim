import { Toolbar } from "primereact/toolbar";
import { Tag } from "primereact/tag";

export function AppFooter() {
    const left = (
        <span style={{ fontWeight: 600 }}>
      Meshtastic Local Client
    </span>
    );

    const center = (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Tag severity="success" value="SSE verbunden" />
        </div>
    );

    const right = (
        <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
      v0.1.0
    </span>
    );

    return (
        <Toolbar
            start={left}
            center={center}
            end={right}
            className="app-footer"
        />
    );
}