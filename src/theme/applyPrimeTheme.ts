export function applyPrimeTheme(theme: "light" | "dark") {
    const id = "primereact-theme";
    let link = document.getElementById(id) as HTMLLinkElement | null;

    if (!link) {
        link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }

    link.href =
        theme === "dark"
            ? "/themes/lara-dark-indigo/theme.css"
            : "/themes/lara-light-indigo/theme.css";
}