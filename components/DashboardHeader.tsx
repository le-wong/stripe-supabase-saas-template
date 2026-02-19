import { Bell, Menu, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import DashboardHeaderProfileDropdown from "./DashboardHeaderProfileDropdown"
import { Badge } from "@/components/ui/badge"
import { getStripePlan } from "@/utils/stripe/api"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCartIcon } from "lucide-react"
import { useCartStore } from "@/app/store/cart-store"

export default async function DashboardHeader() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    const { items } = useCartStore()

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)
    // Get the user's plan from Stripe
    //const stripePlan = getStripePlan(user!.email!)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-2 flex items-center space-x-2" href="">
                        <Image src="/logo.png" alt="logo" width={25} height={25} />
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link className="transition-colors hover:text-foreground/80 text-foreground" href="/dashboard">
                            Home
                        </Link>
                        <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">
                            Projects
                        </Link>
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
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>
                    </div>
                    <DashboardHeaderProfileDropdown />
                    {/* Cart */}
                    <Link href="/checkout" className="relative">
                        <ShoppingCartIcon className="h-6 w-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    )
}