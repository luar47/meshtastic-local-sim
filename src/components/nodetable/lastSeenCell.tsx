import { useNow } from "../../hooks/useNow.ts";
import { timeAgo } from "../../utils/time.ts";

export function LastSeenCell({ ts }: { ts: number }) {
    const now = useNow(1000);
    return <span className="last-seen">{timeAgo(ts, now)}</span>;
}