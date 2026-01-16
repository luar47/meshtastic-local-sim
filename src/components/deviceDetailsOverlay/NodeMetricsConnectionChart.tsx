import { useMemo } from "react";
import { Chart } from "primereact/chart";
import type { NodeMetricsResponse } from "../../api/nodeMetrics.ts";

/**
 * Erwartetes Datenformat:
 * {
 *   timestamps: number[]; // UNIX Sekunden
 *   rssi: number[];
 *   snr: number[];
 * }
 */

type Props = {
    metrics: NodeMetricsResponse;
};

export function NodeMetricsConnectionChart({ metrics }: Props) {
    /**
     * Chart.js DATA
     * → echte Time-Scale (x/y Objekte)
     * → pointRadius = 0 für viele Datenpunkte
     */
    const data = useMemo(() => ({
        datasets: [
            {
                label: "RSSI (dBm)",
                data: metrics.timestamps.map((ts, i) => ({
                    x: ts * 1000,
                    y: metrics.rssi[i],
                })),
                borderColor: "#42A5F5",
                borderWidth: 2,
                tension: 0.25,
                pointRadius: 0,
            },
            {
                label: "SNR",
                data: metrics.timestamps.map((ts, i) => ({
                    x: ts * 1000,
                    y: metrics.snr[i],
                })),
                borderColor: "#66BB6A",
                borderWidth: 2,
                tension: 0.25,
                pointRadius: 0,
            },
        ],
    }), [metrics]);

    /**
     * Chart.js OPTIONS
     */
    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        parsing: false,

        plugins: {
            legend: {
                position: "top" as const,
            },

            // 🔥 wichtig bei vielen Punkten
            decimation: {
                enabled: true,
                algorithm: "lttb",
                samples: 150,
            },

            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },

        scales: {
            x: {
                type: "time" as const,
                time: {
                    unit: "minute",
                    tooltipFormat: "HH:mm:ss",
                },
                ticks: {
                    maxTicksLimit: 8,
                },
            },
            y: {
                beginAtZero: false,
            },
        },
    }), []);

    return (
        <div className="metrics-chart">
            <Chart
                key={metrics.timestamps.length} // 🔥 verhindert Canvas-Reuse-Fehler
                type="line"
                data={data}
                options={options}
            />
        </div>
    );
}