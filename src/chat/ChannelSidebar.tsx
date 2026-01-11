interface Props {
    channels: { id: string; name: string }[];
    activeChannelId: string;
    onSelect: (id: string) => void;
}

export function ChannelSidebar({
                                   channels,
                                   activeChannelId,
                                   onSelect
                               }: Props) {
    return (
        <aside className="channel-sidebar">
            {channels.map(ch => (
                <button
                    key={ch.id}
                    className={
                        "channel-item" +
                        (ch.id === activeChannelId ? " active" : "")
                    }
                    onClick={() => onSelect(ch.id)}
                >
                    {ch.name}
                </button>
            ))}
        </aside>
    );
}