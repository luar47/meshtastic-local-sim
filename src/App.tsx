import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./styles.css";
import {AppLayout} from "./AppLayout.tsx";
import {useNodeStore,} from "./store/useNodeStore";
import {useEffect} from "react";
import {PrimeReactProvider} from "primereact/api";
import { useSystemTheme } from "./hooks/useSystemTheme";





const API_BASE = import.meta.env.VITE_API_BASE_URL;



export default function App() {
    const setNodes = useNodeStore((s) => s.setNodes);
    const setLoading = useNodeStore(s => s.setLoading);

    useSystemTheme();

    useEffect(() => {
        setLoading(true)
        fetch(`${API_BASE}/api/nodes`)
            .then((r) => r.json())
            .then(setNodes)
            .finally(() => setLoading(false));

    }, []);


    return (

        <div className="app-root">
            <PrimeReactProvider>
                <AppLayout/>
            </PrimeReactProvider>
        </div>
    );
}