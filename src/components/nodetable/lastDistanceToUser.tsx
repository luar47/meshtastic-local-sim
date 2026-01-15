import type {NodeInfo} from "../../types/nodes.ts";
import {useUserLocation} from "../../hooks/useUserLocation.ts";
import {distanceMeters} from "../../utils/distance.ts";



export function DistanceCell({ node }: { node: NodeInfo }) {
    const loc = useUserLocation();
    if (!loc || !node.maps_marker) return <>—</>;

    const d = distanceMeters(
        loc.lat,
        loc.lon,
        node.maps_marker.lat,
        node.maps_marker.lon
    );

    return <>{d < 1000 ? `${Math.round(d)} m` : `${(d / 1000).toFixed(1)} km`}</>;
}