import ReactDOM from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "primereact/resources/primereact.min.css";                 // Core CSS
import "primeicons/primeicons.css";                               // Icons
import "./leafletFix"; // 👈 einmalig, zentral
import "chartjs-adapter-date-fns";
import "./styles.css";


const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
        <App/>
)
;