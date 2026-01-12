export type ChatMessage = {
    id: string;
    text: string;
    sender: string
    timestamp: number;
    status?: "sending" | "sent" | "failed";
};


export interface ChatChannel {
    id: string;
    name: string;
}

