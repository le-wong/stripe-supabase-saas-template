"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "@/utils/types"
import { useState, useActionState, useEffect, useRef } from "react"
import { QuestionChoiceRadioButtons } from "@/components/DynamicRadioButton";
import { completeCourse, getUnansweredQuestions, saveCourseQuestion } from "./actions";
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDown } from "lucide-react";

interface CourseProps {
    courseId: string,
    courseName: string,
    userId: string,
    questions: Question[],
    answeredQuestions: Set<number>,
    startIndex: number
}

export default function CourseBlock(props: CourseProps) {
    const questions = props.questions;
    const initialMessage = {
        message: ''
    }

    const [answeredQuestions, setAnsweredQuestions] = useState(props.answeredQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(props.startIndex);
    const [selectedOption, setSelectedOption] = useState(startingChoice(questions[currentQuestionIndex]));;
    const [checkSubmit, setCheckSubmit] = useState(false);
    const [formState, formAction] = useActionState(completeCourse, initialMessage)
    const [submitMessage, setSubmitMessage] = useState("")
    const isFirstRender = useRef(true);

    function startingChoice(question: Question) {
        let startingOption = null;
        for (const choice of question.choices) {
            if (choice.userChose) {
                startingOption = choice.choiceNumber;
                break;
            }
        }
        return startingOption
    }

    function isAnswered(num: number) {
        if (num > 0 && num <= questions.length) {
            return answeredQuestions.has(num);
        }
        return false;
    }

    async function saveQuestion(index: number, option: number | null) {
        const userAnswerId = option ? questions[index].choices[option - 1].id : null;
        await saveCourseQuestion(props.courseId, props.userId, questions[index].id, userAnswerId)

        if (option) {
            for (let i = 0; i < questions[index].choices.length; i++) {
                if (i === (option - 1)) {
                    questions[index].choices[i].userChose = true;
                }
                else {
                    questions[index].choices[i].userChose = false;
                }
            }
            setAnsweredQuestions(prev => new Set(prev).add(questions[index].number))
        }
        else {
            setAnsweredQuestions(prev => {
                const newSet = new Set(prev);
                newSet.delete(questions[index].number);
                return newSet;
            })
            for (let i = 0; i < questions[index].choices.length; i++) {
                questions[index].choices[i].userChose = false;
            }
        }
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const saveQ = async () => {
            await saveQuestion(currentQuestionIndex, selectedOption);
        };

        saveQ();
    }, [selectedOption]);


    const handleNext = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(startingChoice(questions[currentQuestionIndex + 1]));
            if (checkSubmit) {
                setCheckSubmit(false);
            }
        }
    };

    const handleBack = async () => {
        if (checkSubmit) {
            setCheckSubmit(false);
        }

        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(startingChoice(questions[currentQuestionIndex - 1]));
        }
    }

    const handleFinish = async () => {
        const unansweredQuestions = questions.length - answeredQuestions.size;

        setSubmitMessage(unansweredQuestions === 0 ? "" :
            (unansweredQuestions === 1 ? "There is 1 unanswered question!" : `There are ${unansweredQuestions} unanswered questions!`));
        setCheckSubmit(true);
    }

    const handleClear = async () => {
        setSelectedOption(null);
        await saveQuestion(currentQuestionIndex, null);
    }

    const onJumpToQuestion = (num: number) => {
        if (num > 0 && num <= questions.length) {
            setCurrentQuestionIndex(num - 1)

            setSelectedOption(
                startingChoice(questions[num - 1])
            )
        }
    }


    return (
        <div className="flex flex-1 overflow-hidden relative">
            <aside className=" fixed top-14 bottom-14 inset-y-0  overflow-y-auto border-r mr-4 w-1/5">
                <div className="bg-gray-100  p-4 ">
                    <h2 className="text-lg font-semibold mb-4">{`Course Progress ${answeredQuestions.size}/${questions.length}`}</h2>
                    <ol className="space-y-2 ">
                        {Array.from({ length: questions.length + 50 }, (_, i) => {
                            const qNum = i + 1;
                            const qIsAnswered = isAnswered(qNum);
                            return (
                                <li key={qNum}>
                                    <Button onClick={() => onJumpToQuestion(qNum)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors 
                                    ${(currentQuestionIndex + 1) === qNum
                                            ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                                            : qIsAnswered
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-200'
                                        }`}>
                                        Q{qNum} {qIsAnswered && 'V'}
                                    </Button>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </aside>
            <div className="w-1/5 pr-4"></div>
            <span className=" w-4/5 flex grid grid-cols-1 overflow-y-auto ">
                <div className="border text-2xl font-bold p-2 bg-sky-300">{props.courseName}</div>
                <Disclosure as="div" className="border rounded-lg my-1 p-5 w-full justify-self-center">
                    <h3 className="text-xl font-bold">Relevant Course Material for Question {questions[currentQuestionIndex].number}</h3>
                    <DisclosureButton className="group flex py-2 w-full text-left border-b-2 ">Open me!
                        <ChevronDown className="w-5 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <div className="overflow-hidden py-2">
                        <DisclosurePanel transition className="origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0">This is a placeholder</DisclosurePanel>
                    </div>
                </Disclosure>
                <Card className="w-1/2 justify-self-center mx-auto my-4">
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
                    <CardFooter className="grid grid-rows-1 grid-cols-3 gap-4">
                        {currentQuestionIndex > 0 && <Button className="max-w-sm" onClick={handleBack}>
                            Back
                        </Button>}
                        {selectedOption && <Button className="max-w-sm col-start-2" onClick={handleClear}>
                            Clear
                        </Button>}
                        {currentQuestionIndex === questions.length - 1 ?
                            !checkSubmit && <Button className="max-w-sm col-start-3" onClick={handleFinish}>
                                Finish
                            </Button>
                            : <Button className="max-w-sm col-start-3" onClick={handleNext}>
                                Next
                            </Button>}
                    </CardFooter>
                </Card>
            </span>
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