"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/utils/types"
import { useState, useActionState } from "react"
import { QuestionChoiceRadioButtons } from "@/components/DynamicRadioButton";
import { completeCourse, getUnansweredQuestions, saveCourseQuestion } from "./actions";
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

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

    const [selectedOption, setSelectedOption] = useState(() => {
        let startingOption = null;

        for (const choice of questions[currentQuestionIndex].choices) {
            if (choice.userChose) {
                startingOption = choice.choiceNumber;
                break;
            }
        }
        //console.log(startingOption)
        return startingOption
    });

    const [checkSubmit, setCheckSubmit] = useState(false);

    const initialMessage = {
        message: ''
    }
    const [formState, formAction] = useActionState(completeCourse, initialMessage)
    const [submitMessage, setSubmitMessage] = useState("")
    const handleNext = async () => {
        const userAnswerId = selectedOption ? questions[currentQuestionIndex].choices[selectedOption - 1].id : null;
        await saveCourseQuestion(props.courseId, props.userId, questions[currentQuestionIndex].id, userAnswerId)
        if (selectedOption) {
            questions[currentQuestionIndex].choices[selectedOption - 1].userChose = true;
        }
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
        //console.log(unansweredQuestions)
        setSubmitMessage(unansweredQuestions.length === 0 ? "" :
            (unansweredQuestions.length === 1 ? "There is 1 unanswered question!" : `There are ${unansweredQuestions.length} unanswered questions!`));
        setCheckSubmit(true);
    }

    return (
        <div className="">
            <Card className="m-5">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Relevant Course Material
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    This is a placeholder
                </CardContent>
            </Card>
            <Card className="max-w-lg mx-auto mb-8">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Question {questions[currentQuestionIndex].number}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="whitespace-pre-line">
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
            <Dialog open={checkSubmit} onClose={() => setCheckSubmit(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 bg-white p-8 rounded-lg">
                        <DialogTitle className="font-bold">Submit Course Exam</DialogTitle>
                        <Description>{`Are you sure you want to finalize your answers and submit? ${submitMessage}`}</Description>
                        <div className="flex gap-4 items-center">
                            <Button onClick={() => setCheckSubmit(false)}>Cancel</Button>
                            <form action={formAction} className="">
                                <input type="hidden" name="user" value={props.userId} />
                                <input type="hidden" name="course" value={props.courseId} />
                                <Button className="max-w-xs col-start-3" type="submit">Submit!</Button>
                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}