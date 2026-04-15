//"use client"
"use server"
//import { useCourseStore } from "@/app/course/course-store";
import { redirect } from "next/navigation"
import { dbGetCourseProgressForUser, dbGetAllCourseQuestions, dbGetUnansweredCourseQuestions, dbSaveCourseQuestion, dbGetUnattemptedCourseQuestions, dbGetAnsweredCourseQuestions } from "@/utils/db/courses"


export async function getCourseProgress(courseId: string, userId: string) {
    return await dbGetCourseProgressForUser(courseId, userId);
}

export async function getCourseQuestions(courseId: string) {
    return await dbGetAllCourseQuestions(courseId);
}

export async function getUnattemptedCourseQuestions(courseId: string, userId: string) {
    return await dbGetUnattemptedCourseQuestions(courseId, userId);
}

export async function saveCourseQuestion(courseId: string, userId: string, questionId: string, userAnswer: string | null) {
    return await dbSaveCourseQuestion(courseId, userId, questionId, userAnswer)
}

export async function getUnansweredQuestions(courseId: string, userId: string) {
    return await dbGetUnansweredCourseQuestions(courseId, userId);
}

export async function getAnsweredQuestions(courseId: string, userId: string) {
    const answeredQuestions = await dbGetAnsweredCourseQuestions(courseId, userId);
    //console.log(answeredQuestions)
    let myMap: Map<string, string> = new Map();
    for (const question of answeredQuestions) {
        myMap.set(question.questionId, question.answerId ?? "")
    }

    return myMap;
}