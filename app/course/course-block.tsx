"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/utils/types"
import { useState, useActionState } from "react"
import { QuestionChoiceRadioButtons } from "@/components/DynamicRadioButton";
import { completeCourse, getUnansweredQuestions, saveCourseQuestion } from "./actions";

interface CourseProps {
    courseId: string,
    userId: string,
    questions: Question[],
    startIndex: number
}

/*
First question = index 0/number 1
First skipped question = lowest index in attempted question that has no user choice -> lowest index in getUnansweredQuestions
First unanswered question = lowest index from course questions that doesn't exist in attempted questions
*/
export default function CourseBlock(props: CourseProps) {
    const questions = props.questions;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(props.startIndex);

    let startingOption = null;

    for (const choice of questions[currentQuestionIndex].choices) {
        if (choice.userChose) {
            startingOption = choice.choiceNumber;
            break;
        }
    }
    //console.log(startingOption)

    const [selectedOption, setSelectedOption] = useState(startingOption);
    const [checkSubmit, setCheckSubmit] = useState(false);

    const initialMessage = {
        message: ''
    }
    const [formState, formAction] = useActionState(completeCourse, initialMessage)
    const [submitMessage, setSubmitMessage] = useState("")
    const handleNext = async () => {
        const userAnswerId = selectedOption ? questions[currentQuestionIndex].choices[selectedOption - 1].id : null;
        await saveCourseQuestion(props.courseId, props.userId, questions[currentQuestionIndex].id, userAnswerId)

        if (currentQuestionIndex < questions.length - 1) {
            //console.log(currentQuestionIndex)
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(() => {
                let startingOption = null;
                for (const choice of questions[currentQuestionIndex + 1].choices) {
                    if (choice.userChose) {
                        startingOption = choice.choiceNumber;
                        break;
                    }
                }
                //console.log(startingOption)
                return startingOption
            })
            if (checkSubmit) {
                setCheckSubmit(false);
            }
        }
    };

    const handleBack = () => {
        if (checkSubmit) {
            setCheckSubmit(false);
        }
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(() => {
                let startingOption = null;
                //console.log(questions[currentQuestionIndex - 1])
                for (const choice of questions[currentQuestionIndex - 1].choices) {
                    if (choice.userChose) {
                        startingOption = choice.choiceNumber;
                        break;
                    }
                }
                //console.log(startingOption)
                return startingOption
            })
        }
    }

    const handleFinish = async () => {
        const userAnswerId = selectedOption ? questions[currentQuestionIndex].choices[selectedOption - 1].id : null;
        await saveCourseQuestion(props.courseId, props.userId, questions[currentQuestionIndex].id, userAnswerId)


        const unansweredQuestions = await getUnansweredQuestions(props.courseId, props.userId);
        console.log(unansweredQuestions)
        if (unansweredQuestions.length > 0) {
            setSubmitMessage(`Are you sure you want to finalize your answers and submit? There are ${unansweredQuestions.length} unanswered questions!`)
        }
        else {
            setSubmitMessage("Are you sure you want to finalize your answers and submit?")
        }
        setCheckSubmit(true);

    }

    const handleFirstQ = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(() => {
            let startingOption = null;
            //console.log(questions[currentQuestionIndex - 1])
            for (const choice of questions[0].choices) {
                if (choice.userChose) {
                    startingOption = choice.choiceNumber;
                    break;
                }
            }
            //console.log(startingOption)
            return startingOption
        })
    }

    const handleFirstUnattemptedQ = () => {
        //todo
    }

    const handleFirstSkippedQ = async () => {
        const unansweredQuestions = await getUnansweredQuestions(props.courseId, props.userId);
        console.log(unansweredQuestions)
        let lowestIndex = 1000; //max?
        for (const question of unansweredQuestions) {
            if (question.questionNumber && question.questionNumber < lowestIndex) {
                lowestIndex = question.questionNumber;
            }
        }

        if (lowestIndex < 1000) {
            setCurrentQuestionIndex(lowestIndex - 1);
            setSelectedOption(null)
        }
    }

    return (
        <div>
            <span className="grid grid-cols-4 gap-4 justify-end rounded-md ring mx-4 p-4">
                Go to...
                <Button className="max-w-sm" onClick={handleFirstQ}> First question</Button>
                <Button className="max-w-sm" onClick={handleFirstSkippedQ}> First skipped question</Button>
                <Button className="max-w-sm" onClick={handleFirstUnattemptedQ}> First unattempted question</Button>
            </span>
            <br />
            {checkSubmit &&
                <span className="grid grid-cols-3 grid-rows-1 gap-4 justify-end px-6">
                    <form action={formAction}>
                        <input type="hidden" name="user" value={props.userId} />
                        <input type="hidden" name="course" value={props.courseId} />
                        <p className="col-span-2">{submitMessage}</p>
                        <Button className="max-w-xs col-start-3" type="submit">Submit!</Button>
                    </form>
                </span>}
            <br></br>
            <Card className="max-w-lg mx-auto mb-8">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Question {questions[currentQuestionIndex].number}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {questions[currentQuestionIndex].text}
                    </CardDescription>
                    <br></br>
                    <QuestionChoiceRadioButtons
                        options={questions[currentQuestionIndex].choices}
                        selectedOption={selectedOption?.toString()}
                        onSelect={setSelectedOption}>
                    </QuestionChoiceRadioButtons>
                </CardContent>
                <CardFooter className="grid grid-rows-1 grid-cols-2 gap-4">
                    {currentQuestionIndex > 0 && <Button className="max-w-sm" onClick={handleBack}>
                        Back
                    </Button>}
                    {currentQuestionIndex === questions.length - 1 ?
                        !checkSubmit && <Button className="max-w-sm col-start-2" onClick={handleFinish}>
                            Finish
                        </Button>
                        : <Button className="max-w-sm col-start-2" onClick={handleNext}>
                            Next
                        </Button>}
                </CardFooter>
            </Card>

        </div>
    )
}