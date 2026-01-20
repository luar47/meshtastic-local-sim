import { useEffect } from "react";
import { applyPrimeTheme } from "../theme/applyPrimeTheme";

export function useSystemTheme() {
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");

        const apply = () => {
            applyPrimeTheme(mq.matches ? "dark" : "light");
        };

        apply();
        mq.addEventListener("change", apply);

        return () => mq.removeEventListener("change", apply);
    }, []);
}