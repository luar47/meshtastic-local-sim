import type { ChatMessage } from "../types/chat";

export const mockMessages: ChatMessage[] = [
    {
        id: "1",
        text: "Hallo 👋",
        sender: "remote",
        timestamp: Date.now()
    },
    {
        id: "2",
        text: "Empfang klar",
        sender: "local",
        timestamp: Date.now()
    }
];