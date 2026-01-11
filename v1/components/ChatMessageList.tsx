import {
    MessageList,
    Message
} from "@chatscope/chat-ui-kit-react";

import type { ChatMessage } from "../types/chat";

interface Props {
    messages: ChatMessage[];
}

export function ChatMessageList({ messages }: Props) {
    console.log("ChatMessageList messages:", messages);

    return (
        <MessageList style={{ flex: 1 }}>
            {messages.map((m) => (
                <Message
                    key={m.id}
                    model={{
                        message: m.text,
                        direction: m.sender === "local" ? "outgoing" : "incoming",
                        position: "single"
                    }}
                />
            ))}
        </MessageList>
    );
}