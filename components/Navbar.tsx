import { Menu } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CartButton } from "./Cart"
import { createClient } from "@/utils/supabase/server"
import { AuthNav } from "./auth/AuthNavBar"
import MyIcon from "./ui/app-icon"

export default async function Navbar() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-2 flex items-center space-x-2" href="/">
                        {//<Image src="/logo.png" alt="logo" width={25} height={25} />
                        }
                        <MyIcon size="icon"></MyIcon>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link className="transition-colors hover:text-foreground/80 text-foreground" href="/">
                            Home
                        </Link>
                        <Link className="transition-colors hover:text-foreground/80 text-foreground" href="/products">
                            Course Catalog
                        </Link>
                    </nav>
                </div>
                <Button variant="outline" size="icon" className="mr-2 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                <AuthNav user={data.user}></AuthNav>
                <CartButton />
            </div>
        </header >
    )
}