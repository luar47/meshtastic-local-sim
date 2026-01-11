import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./styles.css";
import { ChatLayout } from "./chat/ChatLayout";

export default function App() {
    return (
        <div className="app-root">
            <ChatLayout />
        </div>
    );
}