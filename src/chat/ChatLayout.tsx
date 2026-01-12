import {
    MainContainer,
    ChatContainer,
    ConversationHeader,
    MessageList,
    Message,
    MessageInput
} from "@chatscope/chat-ui-kit-react";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

import type {ChatMessage} from "../types/chat.ts";
import {mockChannels} from "./mockChannels";
import {useEffect, useState} from "react";
import {ChannelSidebar} from "./ChannelSidebar";
import {MobileChannelMenu} from "./MobileChannelMenu";
import {connectChatSse} from "./chatSse";


export function ChatLayout() {
    const [activeChannel, setActiveChannel] = useState("ch0");
    const [status] = useState<"connected" | "connecting" | "offline">(
        "connected"
    );


    const [messages, setMessages] = useState<ChatMessage[]>([]);

    function formatTime(ts: number) {
        return new Date(ts).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    useEffect(() => {
        async function loadMessages() {
            try {
                const res = await fetch(`${API_BASE}/api/chats`);
                const data = await res.json();

                // Erwartetes Format:
                // [{ id, text, sender, timestamp }, ...]

                setMessages(
                    data.map((m: any) => ({
                        id: String(m.id),
                        text: m.text,
                        sender: m.sender,
                        timestamp: m.timestamp,
                    }))
                );
            } catch (err) {
                console.error("Failed to load chat history", err);
            } finally {
                console.log("Load Messages from server");
            }
        }

        loadMessages();
    }, []);

    useEffect(() => {
        const disconnect = connectChatSse((event) => {
            if (!event.text || !event.timestamp) return;

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    text: event.text,
                    sender: event.sender ?? "Unbekannt",
                    timestamp: event.timestamp,
                },
            ]);
        });

        return disconnect;
    }, []);
    const activeChannelName =
        mockChannels.find(c => c.id === activeChannel)?.name ??
        "Channel";

    return (
        <div className="chat-shell">

            {/* 🖥 Desktop Sidebar */}
            {/*<ChannelSidebar*/}
            {/*    channels={mockChannels}*/}
            {/*    activeChannelId={activeChannel}*/}
            {/*    onSelect={setActiveChannel}*/}
            {/*/>*/}

            {/* 💬 Chat Area */}
            <MainContainer className="chat-main">
                <ChatContainer>

                    {/* 🔝 Header (Chatscope Slot) */}
                    <ConversationHeader>
                        <ConversationHeader.Content>
                            <div className="header-content">

                                {/* Titel links */}
                                <span className="header-title">
                                <span className={`status-dot ${status}`}/>
                                    {activeChannelName}
                                        </span>

                                {/* Button rechts (Mobile) */}
                                <div className="mobile-only">
                                    <MobileChannelMenu
                                        channels={mockChannels}
                                        activeChannelId={activeChannel}
                                        onSelect={setActiveChannel}
                                    />
                                </div>

                            </div>
                        </ConversationHeader.Content>
                    </ConversationHeader>
                    {/* 💬 Messages */}
                    <MessageList style={{ flex: 1 }}>
                        {messages.map((m) => (
                            <Message
                                key={m.id}
                                model={{
                                    message: m.text,
                                    direction: "incoming",
                                    position: "single",
                                }}
                            >
                                <Message.Footer>
        <span className="msg-meta">
          {m.sender} · {formatTime(m.timestamp)}
        </span>
                                </Message.Footer>
                            </Message>
                        ))}
                    </MessageList>
                    {/* ⌨️ Input */}
                    <MessageInput
                        placeholder="Nur Lesen – Senden deaktiviert"
                        disabled
                    />

                </ChatContainer>
            </MainContainer>
        </div>
    );
}