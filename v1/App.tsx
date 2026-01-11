import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ChatLayout } from "./components/ChatLayout";

export default function App() {
    console.log("App.tsx render");

    return (
        <div style={{
            height: "100vh",
        }}>
            <ChatLayout />
        </div>
    );
}