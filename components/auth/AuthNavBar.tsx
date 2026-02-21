"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "../ui/button";
import NavbarProfileDropdown from "../NavbarProfileDropdown";

export function AuthNav() {
    const { user, loading } = useAuth();

    if (loading) return null;

    return (
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {user && <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">
                My Courses
            </Link>}
            {user ? <NavbarProfileDropdown /> :
                <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Login
                    </Link>
                </Button>
            }
        </div >
    )
}
