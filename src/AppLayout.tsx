import { ChatLayout } from "./chat/ChatLayout.tsx";
import { MapPanel } from "./components/MapPanel.tsx";
import {NodeTable} from "./components/NodeTable.tsx";
import {AppFooter} from "./components/AppFooter.tsx";
import {DeviceNavbar} from "./components/DeviceNavbar.tsx";
export function AppLayout() {

    return (
        <div className="app-root">
            <DeviceNavbar/>
            <div className="app-content">

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
                    <NodeTable />
                </div>
            </div>
        </div>
            <AppFooter/>
        </div>

    );
}