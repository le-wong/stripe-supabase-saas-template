"use server"
import { dbGetUserInfo } from '@/utils/db/users'
import { dbGetAllEnrollmentsForUser, dbWithdrawFromCourse, dbEnrollInCourse } from '@/utils/db/enrollments'
import { getUserEntitlements } from '@/utils/db/entitlements'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import { dbGetLicenseInfo, dbSetLicenseInfo } from '@/utils/db/licenses'


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
    return await dbSetLicenseInfo(userId, licenseNumber, licenseState, licenseType);
}

export async function enroll(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbEnrollInCourse(userId, courseId);

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function withdraw(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const courseId = formData.get("course") as string;

    await dbWithdrawFromCourse(userId, courseId);

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}




export async function launchCourse(currentState: { message: string }, formData: FormData) {
    const courseId = formData.get("course") as string
    //const courseName = formData.get("name") as string
    const data = { id: courseId } //, name: courseName }
    const course = new URLSearchParams(data).toString();
    redirect(`/course?${course}`)

}
