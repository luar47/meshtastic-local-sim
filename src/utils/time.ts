export function timeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 5) return "gerade eben";
    if (diff < 60) return `vor ${diff} Sekunden`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `vor ${minutes} Minuten`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `vor ${hours} Stunden`;

    const days = Math.floor(hours / 24);
    return `vor ${days} Tagen`;
}