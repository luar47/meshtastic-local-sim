import { useState } from "react";

import { DeviceNavbar } from "./components/DeviceNavbar";
import { MapPanel } from "./components/MapPanel";
import { NodeTable } from "./components/NodeTable";
import { AppFooter } from "./components/AppFooter";
import { ChatLayout } from "./chat/ChatLayout";
import { DeviceDetailsPanel } from "./components/DeviceDetailsPanel";
import { useNodeStore } from "./store/useNodeStore";

export function AppLayout() {
    // 📌 globaler Gerätezustand
    const selectedNode = useNodeStore((s) => s.selectedNode);

    // 💬 Chat-Zustand
    const [chatMode, setChatMode] = useState<"closed" | "docked">("closed");

    return (
        <div className="app-root">
            {/* 🔝 Top Navbar */}
            <DeviceNavbar />

            {/* 🧱 Hauptinhalt */}
            <div className={`app-content ${chatMode === "docked" ? "chat-docked" : ""}`}>

                {/* 🔍 DEVICE DETAILS (links) */}
                <aside className="device-panel">
                    {selectedNode ? (
                        <DeviceDetailsPanel device={selectedNode} />
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

                {/* 💬 GEDOCKTER CHAT (rechts) */}
                {chatMode === "docked" && (
                    <aside className="chat-dock">
                        <ChatLayout onUndock={() => setChatMode("closed")} />
                    </aside>
                )}
            </div>

            {/* 🔻 Footer */}
            <AppFooter />

            {/* 💬 CHAT HANDLE (nur wenn geschlossen) */}
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