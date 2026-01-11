const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function sendMessageApi(
    channel: string,
    text: string
) {
    await fetch(`${API_BASE}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, text })
    });
}