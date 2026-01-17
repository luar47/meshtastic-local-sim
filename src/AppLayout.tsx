import { useState } from "react";

import { DeviceNavbar } from "./components/DeviceNavbar";
import { MapPanel } from "./components/MapPanel";
import { NodeTable } from "./components/NodeTable";
import { AppFooter } from "./components/AppFooter";
import { ChatLayout } from "./chat/ChatLayout";
import { DeviceDetailsPanel } from "./components/DeviceDetailsPanel";

import { useNodeStore } from "./store/useNodeStore";

export function AppLayout() {
    // 📌 global ausgewähltes Gerät
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const setSelectedNode = useNodeStore((s) => s.setSelectedNode);

    // 💬 Chat-Zustand (rechts andockbar)
    const [chatMode, setChatMode] = useState<"closed" | "docked">("closed");

    // 📱 einfache Mobile-Erkennung (reicht hier)
    const isMobile = window.innerWidth < 900;

    return (
        <div className="app-root">
            {/* 🔝 TOP NAVBAR */}
            <DeviceNavbar />

            {/* 🧱 HAUPTINHALT */}
            <div
                className={`app-content ${
                    chatMode === "docked" ? "chat-docked" : ""
                }`}
            >
                {/* 🔍 DEVICE DETAILS PANEL (links / mobile fullscreen) */}
                <aside className="device-panel">
                    {selectedNode ? (
                        <DeviceDetailsPanel
                            device={selectedNode}
                            onCloseMobile={
                                isMobile
                                    ? () => setSelectedNode(null)
                                    : undefined
                            }
                        />
                    ) : (
                        <div className="device-panel-empty">
                            <i className="pi pi-info-circle"/>
                            <h4>Kein Gerät ausgewählt</h4>
                            <p>
                                Wähle ein Gerät aus der Liste oder auf der Karte,
                                um Details anzuzeigen.
                            </p>
                        </div>
                    )}
                </aside>

                {/* 🗺 MAP + 📋 LISTE */}
                <main className="main-panel">
                    <div className="map-pane">
                        <MapPanel/>
                    </div>

                    <div className="list-pane">
                        <NodeTable />
                    </div>
                </main>

                {/* 💬 GEDOCKTER CHAT (rechts) */}
                {chatMode === "docked" && (
                    <aside className="chat-dock">
                        <ChatLayout
                            onUndock={() => setChatMode("closed")}
                        />
                    </aside>
                )}
            </div>

            {/* 🔻 FOOTER */}
            <AppFooter />

            {/* 💬 CHAT HANDLE (nur wenn Chat geschlossen) */}
            {chatMode === "closed" && (
                <div
                    className="chat-handle"
                    onClick={() => setChatMode("docked")}
                    title="Chat öffnen"
                >
                    💬
                </div>
            )}
        </div>
    );
}