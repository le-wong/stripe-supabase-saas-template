// utils/db/products.ts
//this file is the logic of what to do wwith database 

import { db } from "@/utils/db/db";
import { coursesTable, questionsTable, questionChoicesTable, usersTable, enrollmentsTable, courseAttemptsTable } from "@/utils/db/schema";
import { eq, and, or, isNull, isNotNull, ne } from "drizzle-orm";

export async function upsertProductFromStripe(product: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    stateTags: string | null;
    roleTags: string | null;
}) {
    return db
        .insert(coursesTable)
        .values({
            stripeProductId: product.id,
            name: product.name,
            description: product.description,
            active: product.active,
            stateTags: product.stateTags,
            roleTags: product.roleTags
        })
        .onConflictDoUpdate({
            target: coursesTable.stripeProductId,
            set: {
                name: product.name,
                description: product.description,
                active: product.active,
                stateTags: product.stateTags,
                roleTags: product.roleTags
            },
        });
}

export async function setProductInactive(stripeProductId: string) {
    return db
        .update(coursesTable)
        .set({ active: false })
        .where(eq(coursesTable.stripeProductId, stripeProductId));
}

export async function dbGetCourseProgressForUser(courseId: string, userId: string) {
    return db.select({
        courseName: coursesTable.name,
        questionsAnswered: enrollmentsTable.questionsAnswered,
        questionsTotal: coursesTable.totalQuestions
    }).from(enrollmentsTable)
        .leftJoin(coursesTable, eq(coursesTable.id, courseId))
        .where(
            and(
                eq(enrollmentsTable.userId, userId),
                eq(enrollmentsTable.courseId, courseId)
            )
        )
}

export async function dbGetAllCourseQuestions(courseId: string) {
    return db.select({
        id: questionsTable.id,
        number: questionsTable.questionOrder,
        text: questionsTable.questionText,
        choiceId: questionChoicesTable.id,
        choiceNumber: questionChoicesTable.choiceOrder,
        choiceText: questionChoicesTable.choiceText,
        //isCorrect: questionChoicesTable.isCorrect
    }).from(questionsTable)
        .leftJoin(questionChoicesTable, eq(questionChoicesTable.questionId, questionsTable.id))
        .where(
            and(
                eq(questionsTable.courseId, courseId),
                eq(questionsTable.active, true)
            )
        )
}

export async function dbGetUnattemptedCourseQuestions(courseId: string, userId: string) {
    return db.select({
        id: questionsTable.id,
        number: questionsTable.questionOrder,
        text: questionsTable.questionText,
        choiceId: questionChoicesTable.id,
        choiceNumber: questionChoicesTable.choiceOrder,
        choiceText: questionChoicesTable.choiceText,
        isCorrect: questionChoicesTable.isCorrect
    }).from(questionsTable)
        .leftJoin(questionChoicesTable, eq(questionChoicesTable.questionId, questionsTable.id))
        .leftJoin(courseAttemptsTable, eq(courseAttemptsTable.questionId, questionChoicesTable.questionId))
        .where(
            and(
                eq(questionsTable.courseId, courseId),
                eq(questionsTable.active, true),
                isNull(courseAttemptsTable.questionId)
            )
        )
}

export async function dbGetUnansweredCourseQuestions(courseId: string, userId: string) {
    return db.select({ questionId: courseAttemptsTable.questionId, courseId: courseAttemptsTable.courseId })
        .from(courseAttemptsTable)
        .where(
            and(
                and(
                    eq(courseAttemptsTable.courseId, courseId),
                    eq(courseAttemptsTable.userId, userId)
                ),
                isNull(courseAttemptsTable.answerId)
            )
        )
}

export async function dbGetAnsweredCourseQuestions(courseId: string, userId: string) {
    return db.select({
        questionId: courseAttemptsTable.questionId,
        courseId: courseAttemptsTable.courseId,
        answerId: courseAttemptsTable.answerId,
        choiceNumber: questionChoicesTable.choiceOrder
    })
        .from(courseAttemptsTable)
        .leftJoin(questionChoicesTable, eq(questionChoicesTable.id, courseAttemptsTable.answerId))
        .where(
            and(
                and(
                    eq(courseAttemptsTable.courseId, courseId),
                    eq(courseAttemptsTable.userId, userId)
                ),
                and(
                    isNotNull(courseAttemptsTable.answerId)
                )
            )
        )
}

export async function dbSaveCourseQuestion(courseId: string, userId: string, questionId: string, questionChoice: string | null) {

    return db.insert(courseAttemptsTable)
        .values({
            courseId: courseId,
            userId: userId,
            questionId: questionId,
            answerId: questionChoice

        })
        .onConflictDoUpdate({
            target: [courseAttemptsTable.userId, courseAttemptsTable.courseId, courseAttemptsTable.questionId],
            set: {
                answerId: questionChoice
            }
        });
}

export async function dbGradeCourse(courseId: string, userId: string) {
    const correctQuestions = await db.select({ id: courseAttemptsTable.questionId }).from(courseAttemptsTable)
        .leftJoin(questionChoicesTable, eq(questionChoicesTable.id, courseAttemptsTable.questionId))
        .where(
            and(
                and(
                    eq(courseAttemptsTable.userId, userId),
                    eq(courseAttemptsTable.courseId, courseId)
                ),
                eq(questionChoicesTable.isCorrect, true)
            )
        )
    const totalQuestions = await db.select({ total: coursesTable.totalQuestions }).from(coursesTable)
        .where(eq(coursesTable.id, courseId))

    return { correct: correctQuestions, total: totalQuestions }
}
