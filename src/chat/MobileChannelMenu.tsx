import { useState } from "react";

interface Props {
    channels: { id: string; name: string }[];
    activeChannelId: string;
    onSelect: (id: string) => void;
}

export function MobileChannelMenu({
                                      channels,
                                      activeChannelId,
                                      onSelect
                                  }: Props) {
    const [open, setOpen] = useState(false);

    const activeName =
        channels.find(c => c.id === activeChannelId)?.name;

    return (
        <div className="mobile-channel-menu">
            {/* Header Button */}
            <button
                className="mobile-channel-button"
                onClick={() => setOpen(o => !o)}
            >
                {activeName}
                <span className={`arrow ${open ? "open" : ""}`}>▾</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="mobile-channel-dropdown">
                    {channels.map(ch => (
                        <button
                            key={ch.id}
                            className={
                                "mobile-channel-item" +
                                (ch.id === activeChannelId ? " active" : "")
                            }
                            onClick={() => {
                                onSelect(ch.id);
                                setOpen(false);
                            }}
                        >
                            {ch.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}