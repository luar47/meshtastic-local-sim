export type ChatMessage = {
    id: string;
    text: string;
    sender: "local" | "remote";
    timestamp: number;
};

export interface ChatChannel {
    id: string;
    name: string;
}