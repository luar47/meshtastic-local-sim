import { useEffect, useState } from "react";

import { DeviceNavbar } from "./components/DeviceNavbar";
import { MapPanel } from "./components/MapPanel";
import { NodeTable } from "./components/NodeTable";
import { AppFooter } from "./components/AppFooter";
import { ChatLayout } from "./chat/ChatLayout";
import { DeviceDetailsPanel } from "./components/DeviceDetailsPanel";

import { useNodeStore } from "./store/useNodeStore";

type MobileView = "main" | "device" | "chat";

export function AppLayout() {
    // 🌍 global ausgewähltes Gerät
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    // 📱 Mobile-View-State
    const [mobileView, setMobileView] = useState<MobileView>("main");

    // 📱 Responsive Detection (reaktiv!)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // 👉 Wenn Gerät gewählt wird → auf Mobile in Device-View wechseln
    useEffect(() => {
        if (isMobile && selectedNode) {
            setMobileView("device");
        }
    }, [selectedNode, isMobile]);

    return (
        <div className="app-root">
            <DeviceNavbar />

            <div className="app-content">

                {/* =====================
                   MOBILE OVERLAYS
                   ===================== */}
                {isMobile && mobileView === "device" && selectedNode && (
                    <aside className="device-panel mobile-overlay">
                        <DeviceDetailsPanel
                            device={selectedNode}
                            onCloseMobile={() => {
                                setSelectedNode(null);
                                setMobileView("main");
                            }}
                        />
                    </aside>
                )}

                {isMobile && mobileView === "chat" && (
                    <aside className="chat-dock mobile-overlay">
                        <ChatLayout onUndock={() => setMobileView("main")} />
                    </aside>
                )}

                {/* =====================
                   DESKTOP DEVICE PANEL
                   ===================== */}
                {!isMobile && (
                    <aside className="device-panel">
                        {selectedNode ? (
                            <DeviceDetailsPanel device={selectedNode} />
                        ) : (
                            <div className="device-panel-empty">
                                <i className="pi pi-info-circle" />
                                <h4>Kein Gerät ausgewählt</h4>
                                <p>Wähle ein Gerät aus der Liste oder Karte.</p>
                            </div>
                        )}
                    </aside>
                )}

                {/* =====================
                   MAIN (MAP + LIST)
                   ===================== */}
                {(!isMobile || mobileView === "main") && (
                    <main className="main-panel">
                        <div className="map-pane">
                            <MapPanel />
                        </div>

                        <div className="list-pane">
                            <NodeTable />
                        </div>
                    </main>
                )}
            </div>

            <AppFooter />

            {/* =====================
               MOBILE CHAT HANDLE
               ===================== */}
            { mobileView === "main" && (
                <div
                    className="chat-handle"
                    onClick={() => setMobileView("chat")}
                    title="Chat öffnen"
                >
                    💬
                </div>
            )}
        </div>
    );
}