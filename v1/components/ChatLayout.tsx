import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput
} from "@chatscope/chat-ui-kit-react";

import {mockMessages} from "../mock/messages";

export function ChatLayout() {
    return (
        <MainContainer style={{height: "100%"}}>
            <ChatContainer>
                {/* 🔑 MessageList MUSS hier direkt stehen */}
                <MessageList
                    style={{
                        flex: 1,
                        paddingBottom: "calc(var(--mobile-nav-height) + 56px)"
                    }}
                >
                    {mockMessages.map((m) => (
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

                <MessageInput
                    placeholder="Nachricht schreiben…"
                    style={{
                        position: "sticky",
                        bottom: "var(--mobile-nav-height)"
                    }}
                /> </ChatContainer>
        </MainContainer>
    );
}