"use server"
import { dbGetUserInfo } from '@/utils/db/users'
import { dbGetAllEnrollmentsForUser, dbWithdrawFromCourse, dbEnrollInCourse } from '@/utils/db/enrollments'
import { getUserEntitlements } from '@/utils/db/entitlements'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'

export async function getUserInfo(userId: string) {
    return await dbGetUserInfo(userId);
}

export async function getEnrollments(userId: string) {
    return await dbGetAllEnrollmentsForUser(userId);
}

export async function enroll(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbEnrollInCourse(userId, courseId);

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function getEntitlements(userId: string) {
    return await getUserEntitlements(userId);
}

export async function withdraw(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbWithdrawFromCourse(userId, courseId);

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function launchCourse(courseId: string, userId: string) {
    return ({ message: "Launched course" })
}