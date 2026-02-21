"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type AuthValue = {
    session: Session | null;
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({
    initialSession,
    children,
}: {
    initialSession: Session | null;
    children: React.ReactNode;
}) {
    const supabase = useMemo(() => createClient(), []);

    const [session, setSession] = useState<Session | null>(initialSession);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Confirm session once on mount (helps when initialSession is null)
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session ?? null);
            setLoading(false);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setLoading(false);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, [supabase]);

    const value = useMemo<AuthValue>(
        () => ({
            session,
            user: session?.user ?? null,
            loading,
        }),
        [session, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
    return ctx;
}
