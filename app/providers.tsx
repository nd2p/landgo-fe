'use client';

import { useEffect } from "react";
import { refreshAccessTokenIfNeeded } from "@/lib/auth-bootstrap";

export default function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const runRefresh = () => {
            void refreshAccessTokenIfNeeded();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                runRefresh();
            }
        };

        runRefresh();
        window.addEventListener("focus", runRefresh);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const intervalId = window.setInterval(runRefresh, 30_000);

        return () => {
            window.removeEventListener("focus", runRefresh);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.clearInterval(intervalId);
        };
    }, []);

    return <>{children}</>;
}