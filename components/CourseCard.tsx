"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { useActionState } from "react";
import { Course, CourseStatus, CourseStatusFrom } from "@/utils/types";


interface CourseProps {
    myCourse: Course,
    formAction: any,
    launchAction: any
}
export const CourseCard = (props: CourseProps) => {
    const initialState = {
        message: ''
    }

    const [formState, formAction] = useActionState(props.formAction, initialState)
    const [launchState, launchAction] = useActionState(props.launchAction, initialState)
    const course = props.myCourse;
    const courseProgress = course.status === CourseStatus.NotStarted ? "Progress: Not Started" :
        course.status === CourseStatus.Active ? `Progress: ${course.progress.questionsAnswered}/${course.progress.questionsTotal} attempted\n\
                                                                    Course Started: ${course.progress.startedAt.toDateString()}` :
            course.status === CourseStatus.Completed ? `Course Completed: ${course.progress.completedAt?.toDateString() ?? ""} \n ${course.progress.questionsCorrect}/${course.progress.questionsTotal} correct` : "";
    return (

        <Card className="max-w-md mx-auto mb-8">
            <CardHeader className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <CardTitle className="text-xl font-bold">
                    <Button className="rounded-full border px-3 py-1 mr-4 text-sm font-bold bg-rose-400 text-white border-white"
                    >
                        {CourseStatusFrom(course.status).toString()}
                    </Button>
                    {course.courseName}
                </CardTitle>
                <span className="justify-end grid grid-flow-col gap-2 align-top ">
                    {course.stateTags.length > 0 &&
                        <Button
                            className="rounded-full border px-3 py-1 text-sm bg-sky-600 text-white border-sky-600 -my-3"
                        >
                            {course.stateTags.toUpperCase()}
                        </Button>
                    }
                    {course.roleTags.length > 0 &&
                        <Button
                            className="rounded-full border px-3 py-1 text-sm transition bg-lime-600 text-white border-lime-600 -my-3"
                        >
                            {course.roleTags.charAt(0).toUpperCase() + course.roleTags.slice(1)}
                        </Button>
                    }
                </span>
            </CardHeader>
            <CardContent>
                <CardDescription className="whitespace-pre-line">
                    {course.description}
                    <br />
                </CardDescription>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    <form action={formAction}>
                        <input type="hidden" name="user" value={course.userId} />
                        <input type="hidden" name="course" value={course.courseId} />
                        {(course.status === CourseStatus.Inactive || course.status === CourseStatus.NotStarted) && <Button type="submit" variant="default" className="w-full">
                            Start Course
                        </Button>}
                        {course.status === CourseStatus.Active && <Button type="submit" variant="default" className="w-full">
                            Withdraw From Course
                        </Button>}
                        {course.status === CourseStatus.Completed && <Button type="submit" variant="default" className="w-full bg-red-500">
                            Restart Course (TEST ONLY)
                        </Button>}
                        {formState?.message && (
                            <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
                        )}
                    </form>
                    <form action={launchAction}>
                        <input type="hidden" name="course" value={course.courseId} />
                        <input type="hidden" name="name" value={course.courseName} />
                        {course.status === CourseStatus.Active && <Button type="submit" variant="default" className="w-full">
                            Continue Course
                        </Button>}
                        {launchState?.message && (
                            <p className="text-sm text-red-500 text-center py-2">{launchState.message}</p>
                        )}
                    </form>
                </div>
            </CardContent>
            <CardFooter className="text-sm whitespace-pre-line">
                {courseProgress}
            </CardFooter>
        </Card>
    )
};