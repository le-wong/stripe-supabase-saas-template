"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import NavbarProfileDropdown from "../NavbarProfileDropdown";

interface AuthNavProps {
    user: User | null,
}
export function AuthNav(props: AuthNavProps) {
    const userId = props.user && props.user.id
    return (
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {userId && <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/dashboard">
                My Courses
            </Link>}
            {userId ? <NavbarProfileDropdown /> :
                <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Login
                    </Link>
                </Button>
            }
        </div >
    )
}
