import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // modernes, ruhiges Theme
import "primereact/resources/primereact.min.css";                 // Core CSS
import "primeicons/primeicons.css";                               // Icons
import "./leafletFix"; // 👈 einmalig, zentral

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
    <App />
);