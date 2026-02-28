"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import NavbarProfileDropdown from "../NavbarProfileDropdown";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function AuthNav() {

    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            // Handle auth state changes
            console.log(session);
            setUser(session && session.user);
            router.refresh();
        });

        // Unsubscribe when component unmounts
        return () => {
            authListener.subscription.unsubscribe();
        };

    }, []);


    return (
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {user && <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">
                My Courses
            </Link>}
            {user ? <NavbarProfileDropdown /> :

                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                    <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
                        Login
                    </Button>
                </Link>

            }
        </div >
    )
}
