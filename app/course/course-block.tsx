"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/utils/types"
import { useState } from "react"
import { QuestionChoiceRadioButtons } from "@/components/DynamicRadioButton";
import { getUnansweredQuestions, saveCourseQuestion } from "./actions";

interface CourseProps {
    courseId: string,
    userId: string,
    questions: Question[],
    startIndex: number
}


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
    console.log(startingOption)

    const [selectedOption, setSelectedOption] = useState(startingOption);
    const [checkSubmit, setCheckSubmit] = useState(false);

    const submitMessage = {
        message: ''
    }

    const handleNext = async () => {
        const userAnswerId = selectedOption ? questions[currentQuestionIndex].choices[selectedOption - 1].id : null;
        await saveCourseQuestion(props.courseId, props.userId, questions[currentQuestionIndex].id, userAnswerId)

        if (currentQuestionIndex < questions.length - 1) {
            console.log(currentQuestionIndex)
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(() => {
                let startingOption = null;
                for (const choice of questions[currentQuestionIndex].choices) {
                    if (choice.userChose) {
                        startingOption = choice.choiceNumber;
                        break;
                    }
                }
                console.log(startingOption)
                return startingOption
            })
            if (checkSubmit) {
                setCheckSubmit(false);
            }
        }
        else {
            const unansweredQuestions = await getUnansweredQuestions(props.courseId, props.userId);
            console.log(unansweredQuestions)
            if (unansweredQuestions.length > 0) {
                submitMessage.message = `Are you sure you want to submit? There are ${unansweredQuestions.length} unanswered questions!`
            }
            console.log(submitMessage.message)
            setCheckSubmit(true);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(() => {
                let startingOption = null;
                for (const choice of questions[currentQuestionIndex].choices) {
                    if (choice.userChose) {
                        startingOption = choice.choiceNumber;
                        break;
                    }
                }
                console.log(startingOption)
                return startingOption
            })
        }
    }

    return (
        <div>
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
                    <br />
                </CardContent>
                <CardFooter className="grid grid-rows-1 grid-cols-2 gap-4">
                    {currentQuestionIndex > 0 && <Button className="max-w-sm" onClick={handleBack}>
                        Back
                    </Button>}
                    <Button className="max-w-sm col-start-2" onClick={handleNext}>
                        {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}