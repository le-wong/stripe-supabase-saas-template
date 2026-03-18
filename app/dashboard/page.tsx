import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getUserInfo } from '@/utils/db/users'
import { getUserEntitlements } from '@/utils/db/entitlements'
import { getUserEnrollments } from '@/utils/db/enrollments'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const userInfo = (await getUserInfo(data.user.id)).at(0)
    const userCourses = (await getUserEntitlements(data.user.id))
    console.log(userCourses)
    const userProgress = (await getUserEnrollments(data.user.id))
    //const userInfo = (await getUserInfo('41c31059-291a-490c-adaa-5d567316c358')).at(0)
    return (
        <main className="flex-1">
            <div className="container">
                Hello {userInfo?.name}
                <p> Your email is {userInfo?.email}</p>
                <p>{userCourses.length > 0 ? "You have access to at least one course." : "You do not have access to any courses"}</p>
            </div>
        </main>)

}