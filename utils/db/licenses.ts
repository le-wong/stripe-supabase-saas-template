import { db } from "@/utils/db/db";
import { usersTable, licensesTable, licenseTypeTable, statesTable } from "@/utils/db/schema";
import { eq, sql } from "drizzle-orm";

export async function dbGetLicenseInfo(userId: string) {
    return db.select()
        .from(licensesTable)
        .leftJoin(usersTable, eq(licensesTable.userId, usersTable.id))
        .leftJoin(licenseTypeTable, eq(licensesTable.typeId, licenseTypeTable.id))
        .leftJoin(statesTable, eq(licensesTable.stateId, statesTable.id))
        .where(eq(licensesTable.userId, userId));
}

export async function dbSetLicenseInfo(userId: string, licenseNumber: string, licenseState: string, licenseType: string) {

    const licenseTypeId = db.$with('license_type_id').as(
        db.select({ id: licenseTypeTable.id }).from(licenseTypeTable).where(eq(licenseTypeTable.type, licenseType))
    )

    const licenseStateId = db.$with('license_state_id').as(
        db.select({ id: statesTable.id }).from(statesTable).where(eq(statesTable.state, licenseState))
    )

    return db.insert(licensesTable)
        .values({
            userId: userId,
            licenseNumber: licenseNumber,
            stateId: sql`(select id from ${licenseStateId})`,
            typeId: sql`(select id from ${licenseTypeId})`,
        })
}

/*
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
        */