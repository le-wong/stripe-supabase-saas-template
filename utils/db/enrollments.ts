import { db } from "@/utils/db/db";
import { enrollmentsTable, coursesTable, entitlementsTable } from "@/utils/db/schema";
import { eq, and, not, or, sql } from "drizzle-orm";
import { CourseStatus } from "../types";


export async function dbGetAllEnrollmentsForUser(userId: string) {
    return db.select()
        .from(enrollmentsTable)
        .leftJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
        .where(eq(enrollmentsTable.userId, userId));
}

export async function getUnstartedEnrollmentsForUser(userId: string) {
    return db.select()
        .from(enrollmentsTable)
        .leftJoin(coursesTable, eq(enrollmentsTable.courseId, coursesTable.id))
        .where(
            and(
                eq(enrollmentsTable.userId, userId),
                or(
                    eq(enrollmentsTable.status, CourseStatus.Inactive),
                    not(eq(entitlementsTable.courseId, coursesTable.id))
                )
            )
        );
}

export async function dbEnrollInCourse(userId: string, courseId: string) {

    return db.insert(enrollmentsTable)
        .values({
            userId: userId,
            courseId: courseId,
            status: CourseStatus.Active,
            questionsAnswered: 0,
            correctAnswers: 0
        })
        .onConflictDoUpdate({
            target: [enrollmentsTable.userId, enrollmentsTable.courseId],
            set: {
                questionsAnswered: 0,
                correctAnswers: 0,
                status: CourseStatus.Active,
                startedAt: sql`now()`
            },
        }).returning();
}

export async function dbWithdrawFromCourse(userId: string, courseId: string) {
    return db.update(enrollmentsTable)
        .set({ status: CourseStatus.Inactive, completedAt: null })
        .where(
            and(
                eq(enrollmentsTable.userId, userId),
                eq(enrollmentsTable.courseId, courseId)
            )
        ).returning();
}