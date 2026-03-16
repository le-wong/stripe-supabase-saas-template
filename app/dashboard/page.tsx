import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getUserInfo } from '@/utils/db/users'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const userInfo = (await getUserInfo(data.user.id)).at(0)
    //const userInfo = (await getUserInfo('41c31059-291a-490c-adaa-5d567316c358')).at(0)
    return (
        <main className="flex-1">
            <div className="container">
                Hello {userInfo?.name}
                <p> Your email is {userInfo?.email}</p>
                <p>You have been h@@xxed</p>
            </div>
        </main>)

}