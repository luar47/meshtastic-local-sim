const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function connectChatSse(onEvent: (event: any) => void) {
    const source = new EventSource(`${API_BASE}/stream/chat`);

    source.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            onEvent(data);
        } catch {
            console.warn("Invalid SSE payload (not JSON):", e.data);
        }
    };

    source.onerror = () => {
        console.warn("SSE disconnected");
        source.close();
    };

    return () => source.close();
}