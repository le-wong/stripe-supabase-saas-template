"use server"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CourseCard } from '@/components/CourseCard'
import { getEnrollments, enroll, getEntitlements, withdraw, getUserInfo, launchCourse } from './actions'
import { Course, CourseStatus } from "@/utils/types";
import { Banner } from '@/components/ui/banner'
import Link from "next/link"

export default async function Dashboard() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    //console.log(data.user)
    const userId = data.user.id;
    const userName = (await getUserInfo(userId)).at(0)?.name

    const userCourses = (await getEntitlements(userId))
    //console.log(userCourses)
    const userProgress = (await getEnrollments(userId))

    //TODO: sort courses by progress somehow
    const courses = new Map<string, Course>;
    for (const course of userProgress) {
        if (course.courses?.id) {
            courses.set(course.courses.id, {
                courseId: course.courses.id,
                courseName: course.courses.name,
                stateTags: course.courses.stateTags ?? "",
                roleTags: course.courses.roleTags ?? "",
                userId: userId,
                status: course.enrollments.status as CourseStatus,
                description: course.courses.description as string,
                progress: {
                    questionsAnswered: course.enrollments.questionsAnswered ?? 0,
                    questionsCorrect: course.enrollments.correctAnswers ?? 0,
                    startedAt: course.enrollments.startedAt
                }
            })
        }
    }
    for (const course of userCourses) {
        if (course.courses?.id && !courses.has(course.courses.id)) {
            courses.set(course.courses.id, {
                courseId: course.courses.id,
                courseName: course.courses.name,
                stateTags: course.courses.stateTags ?? "",
                roleTags: course.courses.roleTags ?? "",
                userId: userId,
                status: CourseStatus.NotStarted,
                description: course.courses.description as string,
                progress: {
                    questionsAnswered: 0,
                    questionsCorrect: 0,
                    startedAt: new Date()
                }
            })
        }
    }
    //const userInfo = (await getUserInfo('41c31059-291a-490c-adaa-5d567316c358')).at(0)
    return (
        <main className="flex-1">
            {!data.user.phone &&
                <Banner id="add-phone-banner">
                    <span className="text-center">
                        <Link href="#">Add your phone number</Link> to enable SMS-based learning!
                    </span>
                </Banner>
            }
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
                                }
                                launchAction={launchCourse}
                            >
                            </CourseCard>
                        </li>
                    ))
                    }
                </ul>
            </div>
        </main >)

}
