"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { useActionState } from "react";
import { Course, CourseStatus, CourseProgress } from "@/utils/types";


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

    const courseProgress = props.myCourse.status === CourseStatus.NotStarted ? "Progress: Not Started" :
        `Progress: ${props.myCourse.progress.questionsAnswered}/${props.myCourse.progress.questionsTotal} attempted | ${props.myCourse.progress.questionsCorrect}/${props.myCourse.progress.questionsTotal} correct \n\
        Course Started: ${props.myCourse.progress.startedAt.toDateString()}`

    const courseCompleted = props.myCourse.status === CourseStatus.Completed ? `\nCourse Completed: ${props.myCourse.progress.completedAt?.toDateString() ?? ""}` : "";
    return (

        <Card className="max-w-md mx-auto mb-8">
            <CardHeader className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <CardTitle className="text-xl font-bold">{props.myCourse.courseName}</CardTitle>
                <span className="justify-end grid grid-flow-col gap-2 align-top ">
                    {props.myCourse.stateTags.length > 0 &&
                        <Button
                            className="rounded-full border px-3 py-1 text-sm bg-sky-600 text-white border-sky-600 -my-3"
                        >
                            {props.myCourse.stateTags.toUpperCase()}
                        </Button>
                    }
                    {props.myCourse.roleTags.length > 0 &&
                        <Button
                            className="rounded-full border px-3 py-1 text-sm transition bg-lime-600 text-white border-lime-600 -my-3"
                        >
                            {props.myCourse.roleTags.charAt(0).toUpperCase() + props.myCourse.roleTags.slice(1)}
                        </Button>
                    }
                </span>
            </CardHeader>
            <CardContent>
                <CardDescription style={{ whiteSpace: 'pre-line' }}>
                    {props.myCourse.description}
                    <br />
                    <br />
                    {courseProgress}
                    {courseCompleted}
                </CardDescription>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    <form action={formAction}>
                        <input type="hidden" name="user" value={props.myCourse.userId} />
                        <input type="hidden" name="course" value={props.myCourse.courseId} />
                        {(props.myCourse.status === CourseStatus.Inactive || props.myCourse.status === CourseStatus.NotStarted) && <Button type="submit" variant="default" className="w-full">
                            Start Course
                        </Button>}
                        {props.myCourse.status === CourseStatus.Active && <Button type="submit" variant="default" className="w-full">
                            Withdraw From Course
                        </Button>}
                        {props.myCourse.status === CourseStatus.Completed && <Button type="submit" variant="default" className="w-full bg-red-500">
                            Restart Course (TEST ONLY)
                        </Button>}
                        {formState?.message && (
                            <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
                        )}
                    </form>
                    <form action={launchAction}>
                        <input type="hidden" name="course" value={props.myCourse.courseId} />
                        <input type="hidden" name="name" value={props.myCourse.courseName} />
                        {props.myCourse.status === CourseStatus.Active && <Button type="submit" variant="default" className="w-full">
                            Launch Course
                        </Button>}
                        {launchState?.message && (
                            <p className="text-sm text-red-500 text-center py-2">{launchState.message}</p>
                        )}
                    </form>
                </div>
            </CardContent>
        </Card>
    )
};