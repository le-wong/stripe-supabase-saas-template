"use server"
import { dbGetUserInfo } from '@/utils/db/users'
import { dbGetAllEnrollmentsForUser, dbWithdrawFromCourse, dbEnrollInCourse } from '@/utils/db/enrollments'
import { getUserEntitlements } from '@/utils/db/entitlements'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import { dbGetLicenseInfo, dbSetLicenseInfo, dbRemoveLicense } from '@/utils/db/licenses'
import { dbRestartCourseTestingOnly } from '@/utils/db/courses'

export async function getUserInfo(userId: string) {
    return await dbGetUserInfo(userId);
}

export async function getEnrollments(userId: string) {
    return await dbGetAllEnrollmentsForUser(userId);
}

export async function getEntitlements(userId: string) {
    return await getUserEntitlements(userId);
}

export async function getLicenseInfo(userId: string) {
    return await dbGetLicenseInfo(userId);
}

export async function updateLicenseInfo(userId: string, licenseNumber: string, licenseState: string, licenseType: string) {
    await dbSetLicenseInfo(userId, licenseNumber, licenseState, licenseType);

    revalidatePath('/profile', 'page')
    redirect('/profile')
}

export async function removeLicense(id: string) {
    await dbRemoveLicense(id);

    revalidatePath('/profile', 'page')
    redirect('/profile')
}

export async function enrollAndLaunchCourse(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbEnrollInCourse(userId, courseId);

    const course = new URLSearchParams({ id: courseId }).toString();
    redirect(`/course?${course}`)
}

export async function withdraw(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbWithdrawFromCourse(userId, courseId);

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function restartTestingOnly(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbRestartCourseTestingOnly(courseId, userId);

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}


export async function launchCourse(currentState: { message: string }, formData: FormData) {
    const courseId = formData.get("course") as string

    const course = new URLSearchParams({ id: courseId }).toString();
    redirect(`/course?${course}`)

}

