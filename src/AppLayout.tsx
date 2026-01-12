import { ChatLayout } from "./chat/ChatLayout.tsx";
import { MapPanel } from "./layout/MapPanel";
import {ListPanel} from "./layout/ListPanel.tsx";

export function AppLayout() {
    return (
        <div className="app-root">
            {/* LINKER BEREICH: CHAT */}
            <div className="left-pane">
                <ChatLayout />
            </div>

            {/* RECHTER BEREICH */}
            <div className="right-pane">
                <div className="map-pane">
                    <MapPanel />
                </div>
                <div className="list-pane">
                    <ListPanel />
                </div>
            </div>
        </div>
    );
}