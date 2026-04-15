import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card"
import { Course, CourseStatus, CourseProgress } from "@/utils/types";


interface ProgressProps {
    courseName: string,
    questionsAnswered: number,
    questionsTotal: number
}


export const CourseProgressCard = (props: ProgressProps) => {
    //const [formState, formAction] = useActionState(props.formAction, initialState)
    //const [launchState, launchAction] = useActionState(props.launchAction, initialState)

    return (

        <Card className="max-w-full mx-auto mb-8">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{props.courseName}</CardTitle>
            </CardHeader>
            <CardContent style={{ whiteSpace: 'pre-line' }}>
                <div className="mt-6 grid grid-cols-1 gap-4">
                    Progress: {props.questionsAnswered} answered / {props.questionsTotal}
                </div>
            </CardContent>
        </Card>
    )
};
