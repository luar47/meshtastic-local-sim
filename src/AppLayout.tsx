import { ChatLayout } from "./chat/ChatLayout.tsx";
import { MapPanel } from "./layout/MapPanel";
import {ListPanel} from "./layout/ListPanel.tsx";
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
                    <ListPanel />
                </div>
            </div>
        </div>
            <AppFooter/>
        </div>

    );
}