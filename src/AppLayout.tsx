import { useEffect, useState } from "react";

import { DeviceNavbar } from "./components/DeviceNavbar";
import { MapPanel } from "./components/mapPanel/MapPanel.tsx";
import { NodeTable } from "./components/NodeTable";
import { AppFooter } from "./components/AppFooter";
import { ChatLayout } from "./components/chat/ChatLayout";
import { DeviceDetailsPanel } from "./components/DeviceDetailsPanel";
import { useNodeStore } from "./store/useNodeStore";

type MobileView = "main" | "device" | "chat";

export function AppLayout() {
    // 🌍 global ausgewähltes Gerät
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    const [mapFullscreen, setMapFullscreen] = useState(false);

    // 📱 Mobile Navigation
    const [mobileView, setMobileView] = useState<MobileView>("main");

    // 💬 Desktop Chat
    const [desktopChatOpen, setDesktopChatOpen] = useState(false);

    // 📐 Responsive Detection (reaktiv)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // 👉 Mobile: Gerät ausgewählt → Device-View
    useEffect(() => {
        if (isMobile && selectedNode) {
            setMobileView("device");
        }
    }, [selectedNode, isMobile]);

    return (
        <div className={`app-root ${mapFullscreen ? "map-fullscreen" : ""}`}>            {/* 🔝 NAVBAR */}
            <DeviceNavbar/>

            {/* 🧱 CONTENT */}
            <div className="app-content">

                {/* =====================
                   📱 MOBILE OVERLAYS
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
                        <ChatLayout onUndock={() => setMobileView("main")}/>
                    </aside>
                )}

                {/* =====================
                   🖥 DESKTOP DEVICE PANEL
                   ===================== */}
                {!isMobile && (
                    <aside className="device-panel">
                        {selectedNode ? (
                            <DeviceDetailsPanel device={selectedNode}/>
                        ) : (
                            <div className="device-panel-empty">
                                <i className="pi pi-info-circle"/>
                                <h4>Kein Gerät ausgewählt</h4>
                                <p>
                                    Wähle ein Gerät aus der Liste oder auf der
                                    Karte, um Details anzuzeigen.
                                </p>
                            </div>
                        )}
                    </aside>
                )}

                {/* =====================
                   🗺 MAP + 📋 LISTE
                   ===================== */}
                {(!isMobile || mobileView === "main") && (
                    <main className="main-panel">
                        <div className="map-pane">
                            <MapPanel fullscreen={mapFullscreen} onToggleFullscreen={() => setMapFullscreen(v => !v)}
                            />
                        </div>
                        <div className="list-pane">
                            <NodeTable/>
                        </div>
                    </main>
                )}

                {/* =====================
                   💬 DESKTOP CHAT (RECHTS)
                   ===================== */}
                {!isMobile && desktopChatOpen && (
                    <aside className="chat-dock">
                        <ChatLayout
                            onUndock={() => setDesktopChatOpen(false)}
                        />
                    </aside>
                )}
            </div>

            {/* 🔻 FOOTER */}
            <AppFooter/>

            {/* =====================
               💬 CHAT HANDLE (IMMER RECHTS)
               ===================== */}
            {!isMobile && !desktopChatOpen && (
                <div
                    className="chat-handle"
                    onClick={() => setDesktopChatOpen(true)}
                    title="Chat öffnen"
                >
                    💬
                </div>
            )}

            { !mapFullscreen.valueOf() && (
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