import { db } from "@/utils/db/db";
import { enrollmentsTable, productsTable, entitlementsTable } from "@/utils/db/schema";
import { eq, and, not, or } from "drizzle-orm";
import { CourseStatus } from "../types";


export async function dbGetAllEnrollmentsForUser(userId: string) {
    return db.select()
        .from(enrollmentsTable)
        .leftJoin(productsTable, eq(enrollmentsTable.courseId, productsTable.id))
        .where(eq(enrollmentsTable.userId, userId));
}

export async function getUnstartedEnrollmentsForUser(userId: string) {
    return db.select()
        .from(enrollmentsTable)
        .leftJoin(productsTable, eq(enrollmentsTable.courseId, productsTable.id))
        .where(
            and(
                eq(enrollmentsTable.userId, userId),
                or(
                    eq(enrollmentsTable.status, CourseStatus.Inactive),
                    not(eq(entitlementsTable.courseId, productsTable.id))
                )
            )
        );
}

export async function enrollInCourse(userId: string, courseId: string) {

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
            },
        }).returning();
}

export async function withdrawFromCourse(userId: string, courseId: string) {
    return db.update(enrollmentsTable)
        .set({ status: CourseStatus.Inactive })
        .where(
            and(
                eq(enrollmentsTable.userId, userId),
                eq(enrollmentsTable.courseId, courseId)
            )
        ).returning();
}