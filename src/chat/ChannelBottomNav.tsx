interface Props {
    channels: { id: string; name: string }[];
    activeChannelId: string;
    onSelect: (id: string) => void;
}

export function ChannelBottomNav({
                                     channels,
                                     activeChannelId,
                                     onSelect
                                 }: Props) {
    return (
        <nav className="channel-bottom-nav">
            {channels.map(ch => (
                <button
                    key={ch.id}
                    className={
                        "channel-tab" +
                        (ch.id === activeChannelId ? " active" : "")
                    }
                    onClick={() => onSelect(ch.id)}
                >
                    {ch.name}
                </button>
            ))}
        </nav>
    );
}