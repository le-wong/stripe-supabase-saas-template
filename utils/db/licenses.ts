import { db } from "@/utils/db/db";
import { usersTable, licensesTable, statesTable } from "@/utils/db/schema";
import { eq, sql, asc } from "drizzle-orm";

export async function dbGetLicenseInfo(userId: string) {
    return db.select()
        .from(licensesTable)
        .leftJoin(usersTable, eq(licensesTable.userId, usersTable.id))
        .leftJoin(statesTable, eq(licensesTable.stateId, statesTable.id))
        .where(eq(licensesTable.userId, userId))
        .orderBy(asc(licensesTable.type));
}

export async function dbSetLicenseInfo(userId: string, licenseNumber: string, licenseState: string, licenseType: string) {

    const licenseStateId = db.$with('license_state_id').as(
        db.select({ id: statesTable.id }).from(statesTable).where(eq(statesTable.state, licenseState))
    )

    return db.with(licenseStateId)
        .insert(licensesTable)
        .values({
            userId: userId,
            licenseNumber: licenseNumber,
            stateId: sql`(select id from ${licenseStateId})`,
            type: licenseType
        })
}

//todo: add check to confirm correct user's license?
export async function dbUpdateLicenseInfo(licenseId: string, licenseNumber: string, licenseType: string, licenseState: string) {
    const licenseStateId = db.$with('license_state_id').as(
        db.select({ id: statesTable.id }).from(statesTable).where(eq(statesTable.state, licenseState))
    )

    return db.with(licenseStateId)
        .update(licensesTable)
        .set({
            licenseNumber: licenseNumber,
            type: licenseType,
            stateId: sql`(select id from ${licenseStateId})`
        })
        .where(eq(licensesTable.id, licenseId))
}

export async function dbRemoveLicense(id: string) {
    return db.delete(licensesTable)
        .where(eq(licensesTable.id, id))
}