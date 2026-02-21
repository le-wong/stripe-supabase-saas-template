import { generateStripeBillingPortalLink } from "@/utils/stripe/api"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    const billingPortalURL = await generateStripeBillingPortalLink(user!.email!)

    if (error || !user) {
        redirect('/login')
    }

    return (
        redirect(billingPortalURL)
    )

}