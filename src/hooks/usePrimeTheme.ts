// src/hooks/usePrimeTheme.ts
import { useContext, useEffect, useRef } from "react";
import { PrimeReactContext } from "primereact/api";

export type PrimeTheme =
    | "lara-light-indigo"
    | "lara-dark-indigo";

const LIGHT_THEME: PrimeTheme = "lara-light-indigo";
const DARK_THEME: PrimeTheme = "lara-dark-indigo";

export function usePrimeTheme() {
    const context = useContext(PrimeReactContext);

    if (!context) {
        throw new Error(
            "usePrimeTheme must be used inside <PrimeReactProvider>"
        );
    }

    const { changeTheme } = context;

    const currentThemeRef = useRef<PrimeTheme | null>(null);

    const getSystemTheme = (): PrimeTheme =>
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? DARK_THEME
            : LIGHT_THEME;

    const applyTheme = (next: PrimeTheme) => {
        const current = currentThemeRef.current;

        if (current === next) return;

        const from = current ?? next;

        if (changeTheme) {
            changeTheme(
                `/themes/${from}/theme.css`,
                `/themes/${next}/theme.css`,
                "theme-link",
                () => {
                    currentThemeRef.current = next;
                    console.log("🎨 PrimeReact theme applied:", next);
                }
            );
        }
    };

    // 🔁 Initial + System Theme Sync
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const syncWithSystem = () => {
            // ❗ Kein Override → System bestimmt
            if (localStorage.getItem("theme")) return;
            applyTheme(getSystemTheme());
        };

        // Initial anwenden
        syncWithSystem();

        // Listener
        try {
            media.addEventListener("change", syncWithSystem);
        } catch {
            media.addListener(syncWithSystem); // Safari
        }

        return () => {
            try {
                media.removeEventListener("change", syncWithSystem);
            } catch {
                media.removeListener(syncWithSystem);
            }
        };
    }, []);

    // 👤 Optionaler User-Override
    const setUserTheme = (theme: "light" | "dark" | null) => {
        if (theme === null) {
            localStorage.removeItem("theme");
            applyTheme(getSystemTheme());
            return;
        }

        const target = theme === "dark" ? DARK_THEME : LIGHT_THEME;
        localStorage.setItem("theme", theme);
        applyTheme(target);
    };

    return {
        setUserTheme,
        applyLight: () => setUserTheme("light"),
        applyDark: () => setUserTheme("dark"),
        resetToSystem: () => setUserTheme(null),
    };
}