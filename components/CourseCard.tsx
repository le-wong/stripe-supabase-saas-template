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

    const courseProgress = props.myCourse.status === CourseStatus.NotStarted ? "" :
        `Progress: ${props.myCourse.progress.questionsAnswered}/100 attempted | ${props.myCourse.progress.questionsCorrect}/100 correct \n\
        Course Started: ${props.myCourse.progress.startedAt.toDateString()}`
    return (

        <Card className="max-w-md mx-auto mb-8">
            <CardHeader className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <CardTitle className="text-xl font-bold">{props.myCourse.courseName}</CardTitle>
                <span className="justify-end grid grid-flow-col gap-2 align-top ">
                    {props.myCourse.stateTags.length > 0 &&
                        <Button
                            className="rounded-full border px-3 py-1 text-sm bg-blue-600 text-white border-blue-600 -my-3"
                        >
                            {props.myCourse.stateTags.toUpperCase()}
                        </Button>
                    }
                    {props.myCourse.roleTags.length > 0 &&
                        <Button
                            className="rounded-full border px-3 py-1 text-sm transition bg-green-600 text-white border-green-600 -my-3"
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
                    {courseProgress}
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
                        {formState?.message && (
                            <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
                        )}
                    </form>
                    <form action={launchAction}>
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