"use server"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CourseCard } from '@/components/CourseCard'
import { getEnrollments, enroll, getEntitlements, withdraw, getUserInfo } from './actions'
import { Course, CourseStatus } from "@/utils/types";

export default async function Dashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const userId = data.user.id;
    const userName = (await getUserInfo(userId)).at(0)?.name

    const userCourses = (await getEntitlements(userId))
    //console.log(userCourses)
    const userProgress = (await getEnrollments(userId))
    const courses = new Map<string, Course>;
    for (const course of userProgress) {
        if (course.products?.id) {
            courses.set(course.products.id, {
                courseId: course.products.id,
                courseName: course.products.name,
                userId: userId,
                status: course.enrollments.status as CourseStatus,
                description: course.products.description as string
            })
        }
    }
    for (const course of userCourses) {
        if (course.products?.id && !courses.has(course.products.id)) {
            courses.set(course.products.id, {
                courseId: course.products.id,
                courseName: course.products.name,
                userId: userId,
                status: CourseStatus.NotStarted,
                description: course.products.description as string
            })
        }
    }
    //const userInfo = (await getUserInfo('41c31059-291a-490c-adaa-5d567316c358')).at(0)
    return (
        <main className="flex-1">
            <div className="container">
                Hello {userName}
            </div>
            <div>
                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
                    {Array.from(courses.entries()).map(([key, course]) =>
                    (
                        <li key={key}>
                            <CourseCard
                                myCourse={course}
                                formAction={((course.status === CourseStatus.NotStarted || course.status === CourseStatus.Inactive) && enroll)
                                    || (course.status === CourseStatus.Active && withdraw)
                                }></CourseCard>
                        </li>
                    ))
                    }
                </ul>
            </div>
        </main >)

}
