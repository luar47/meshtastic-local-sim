import { DeviceNavbar } from "./components/DeviceNavbar";
import { MapPanel } from "./components/MapPanel";
import { NodeTable } from "./components/NodeTable";
import { AppFooter } from "./components/AppFooter";
import { ChatLayout } from "./chat/ChatLayout";
import { DeviceDetailsPanel } from "./components/DeviceDetailsPanel";
import { useNodeStore } from "./store/useNodeStore";
import {useState} from "react";

export function AppLayout() {
    const selectedNode = useNodeStore((s) => s.selectedNode);
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <div className="app-root">
            <DeviceNavbar />

            <div className="app-content">
                <aside className="device-panel">
                    {selectedNode ? (
                        <DeviceDetailsPanel device={selectedNode} />
                    ) : (
                        <div className="device-panel-empty">
                            Gerät auswählen
                        </div>
                    )}
                </aside>

                <main className="main-panel">
                    <div className="map-pane">
                        <MapPanel />
                    </div>
                    <div className="list-pane">
                        <NodeTable />
                    </div>
                </main>
            </div>

            <AppFooter />

            {/* 🟦 CHAT DRAWER */}
            <div className={`chat-drawer ${chatOpen ? "open" : ""}`}>
                <ChatLayout />
            </div>

            {/* 🟦 CHAT HANDLE */}
            {!chatOpen && (
                <div className="chat-handle" onClick={() => setChatOpen(true)}>
                    💬
                </div>
            )}

            {/* 🟦 OVERLAY */}
            {chatOpen && (
                <div className="chat-overlay" onClick={() => setChatOpen(false)} />
            )}
        </div>
    );
}