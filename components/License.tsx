"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { useActionState } from "react";
import { Course, CourseStatus, CourseProgress } from "@/utils/types";

interface LicenseProps {
    type: string,
    state: string,
    number: string
}
export const License = (props: LicenseProps) => {
    const initialState = {
        message: ''
    }

    //const [formState, formAction] = useActionState(props.formAction, initialState)
    //const [launchState, launchAction] = useActionState(props.launchAction, initialState)

    //const courseProgress = props.myCourse.status === CourseStatus.NotStarted ? "" :
    //    `Progress: ${props.myCourse.progress.questionsAnswered}/100 attempted | ${props.myCourse.progress.questionsCorrect}/100 correct \n\
    //    Course Started: ${props.myCourse.progress.startedAt.toDateString()}`
    return (

        <div style={{ whiteSpace: 'pre-line' }}>
            {`License: ${props.type}, ${props.state}, ${props.number}`}
        </div>
    )
};