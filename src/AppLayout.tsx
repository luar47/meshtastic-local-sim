import { useState, useEffect } from "react";

import { DeviceNavbar } from "./components/DeviceNavbar";
import { MapPanel } from "./components/MapPanel";
import { NodeTable } from "./components/NodeTable";
import { AppFooter } from "./components/AppFooter";
import { ChatLayout } from "./chat/ChatLayout";
import { DeviceDetailsPanel } from "./components/DeviceDetailsPanel";
import { useNodeStore } from "./store/useNodeStore";

/* Mobile View Modi */
type MobileView = "default" | "chat" | "details";

export function AppLayout() {
    // Global ausgewähltes Device
    const selectedNode = useNodeStore((s) => s.selectedNode);

    // Chat-Zustand (Desktop)
    const [chatMode, setChatMode] = useState<"closed" | "docked">("closed");

    // Mobile UI Fokus
    const [mobileView, setMobileView] = useState<MobileView>("default");

    /* Wenn auf Mobile ein Node ausgewählt wird → Details öffnen */
    useEffect(() => {
        if (selectedNode && window.innerWidth < 900) {
            setMobileView("details");
        }
    }, [selectedNode]);

    return (
        <div className={`app-root mobile-${mobileView}`}>
            {/* 🔝 Navbar */}
            <DeviceNavbar />

            {/* 🧱 Hauptinhalt */}
            <div className="app-content">

                {/* 🔍 DEVICE DETAILS (Desktop links / Mobile fullscreen) */}
                <aside className="device-panel">
                    {selectedNode ? (
                        <DeviceDetailsPanel
                            device={selectedNode}
                            onCloseMobile={() => setMobileView("default")}
                        />
                    ) : (
                        <div className="device-panel-empty">
                            Gerät auswählen
                        </div>
                    )}
                </aside>

                {/* 🗺 MAP + 📋 LISTE */}
                <main className="main-panel">
                    <div className="map-pane">
                        <MapPanel />
                    </div>
                    <div className="list-pane">
                        <NodeTable />
                    </div>
                </main>

                {/* 💬 CHAT (Desktop gedockt / Mobile fullscreen) */}
                {chatMode === "docked" && (
                    <aside className="chat-dock">
                        <ChatLayout
                            onUndock={() => setChatMode("closed")}
                            onOpenMobile={() => setMobileView("chat")}
                            onCloseMobile={() => setMobileView("default")}
                        />
                    </aside>
                )}
            </div>

            {/* 🔻 Footer */}
            <AppFooter />

            {/* 💬 CHAT HANDLE (Desktop + Mobile Default) */}
            {chatMode === "closed" && mobileView === "default" && (
                <div
                    className="chat-handle"
                    onClick={() => {
                        if (window.innerWidth < 900) {
                            setMobileView("chat");
                        } else {
                            setChatMode("docked");
                        }
                    }}
                    title="Chat öffnen"
                >
                    💬
                </div>
            )}
        </div>
    );
}