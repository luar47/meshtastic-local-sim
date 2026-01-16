import { ProgressBar } from "primereact/progressbar";

type Props = {
    rssi: number; // z. B. -36
    snr: number;  // z. B. 5.8
};

export function SignalStrengthPanel({ rssi, snr }: Props) {

    function SignalRow({
                           label,
                           value,
                           percent,
                           severity,
                       }: {
        label: string;
        value: string;
        percent: number;
        severity: "success" | "warning" | "danger";
    }) {
        return (
            <div className="signal-row">
                <div className="signal-header">
                    <span>{label}</span>
                    <span className="signal-value">{value}</span>
                </div>

                <ProgressBar
                    value={percent}
                    showValue={false}
                    className={`signal-bar ${severity}`}
                />
            </div>
        );
    }

    function rssiToPercent(rssi: number): number {
        // -120 dBm (schlecht) → 0 %
        // -30 dBm (sehr gut) → 100 %
        return Math.min(100, Math.max(0, ((rssi + 120) / 90) * 100));
    }

    function snrToPercent(snr: number): number {
        // 0 dB → 0 %
        // 10 dB → 100 %
        return Math.min(100, Math.max(0, (snr / 10) * 100));
    }

    function rssiSeverity(rssi: number) {
        if (rssi > -60) return "success";
        if (rssi > -90) return "warning";
        return "danger";
    }

    function snrSeverity(snr: number) {
        if (snr > 7) return "success";
        if (snr > 3) return "warning";
        return "danger";
    }

    function signalSummary(rssi: number, snr: number) {
        if (rssi > -60 && snr > 7) return "✅ Sehr gutes Signal";
        if (rssi > -90 && snr > 3) return "🟡 Stabile Verbindung";
        return "⚠️ Schwaches Signal";
    }


    return (
        <div className="signal-panel">
            <h4>Signalqualität</h4>

            <SignalRow
                label="RSSI"
                value={`${rssi} dBm`}
                percent={rssiToPercent(rssi)}
                severity={rssiSeverity(rssi)}
            />

            <SignalRow
                label="SNR"
                value={`${snr.toFixed(1)} dB`}
                percent={snrToPercent(snr)}
                severity={snrSeverity(snr)}
            />

            <div className="signal-summary">
                {signalSummary(rssi, snr)}
            </div>
        </div>
    );
}