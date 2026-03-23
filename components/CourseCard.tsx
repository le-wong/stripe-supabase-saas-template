"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { useActionState } from "react";
import { Course, CourseStatus } from "@/utils/types";

interface CourseProps {
    /* courseName: string,
     courseId: string,
     userId: string,
     status: CourseStatus,
     description: string,
     */
    myCourse: Course,
    formAction: any
}
export const CourseCard = (props: CourseProps) => {
    const initialState = {
        message: ''
    }

    const [formState, formAction] = useActionState(props.formAction, initialState)
    return (

        <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{props.myCourse.courseName}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {props.myCourse.description}

                </CardDescription>
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
            </CardContent>
        </Card>
    )
};