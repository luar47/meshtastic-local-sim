import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./styles.css";
import {AppLayout} from "./AppLayout.tsx";
import { useEffect } from "react";
import { useNodeStore,  } from "./store/useNodeStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL;



export default function App() {
    const setNodes = useNodeStore((s) => s.setNodes);

    useEffect(() => {
        fetch(`${API_BASE}/api/nodes`)
            .then((r) => r.json())
            .then(setNodes)
            .catch(console.error);
    }, []);


    return (
        <div className="app-root">
                <AppLayout/>
        </div>
    );
}