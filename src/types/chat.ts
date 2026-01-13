export type ChatMessage = {
    id: string;
    text: string;
    sender: string
    short_name: string
    timestamp: number;
    status?: "sending" | "sent" | "failed";
};


