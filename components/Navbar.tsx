import { Bell, Menu, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import NavbarProfileDropdown from "./NavbarProfileDropdown"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CartButton } from "./Cart"

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-2 flex items-center space-x-2" href="">
                        <Image src="/logo.png" alt="logo" width={25} height={25} />
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link className="transition-colors hover:text-foreground/80 text-foreground" href={user ? "/dashboard" : "/"}>
                            Home
                        </Link>
                        {user && <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">
                            My Courses
                        </Link>}
                        <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">
                            Tasks
                        </Link>
                        <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">
                            Reports
                        </Link>
                        <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/products">
                            All Courses
                        </Link>
                    </nav>
                </div>
                <Button variant="outline" size="icon" className="mr-2 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {user ? <NavbarProfileDropdown /> :
                        <Button className="mx-2 md:mx-4 lg:mx-6 xl:mx-10" >
                            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                                Login
                            </Link>
                        </Button>
                    }

                    <CartButton />
                </div>
            </div>
        </header>
    )
}