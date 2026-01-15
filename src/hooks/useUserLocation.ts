import { useEffect, useState } from "react";

type UserLocation = {
    lat: number;
    lon: number;
} | null;

export function useUserLocation() {
    const [location, setLocation] = useState<UserLocation>(null);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
            },
            (err) => {
                console.warn("Geolocation error", err);
                setLocation(null);
            }
        );
    }, []);
    return location;
}