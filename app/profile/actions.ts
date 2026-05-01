"use server"
import { dbSetUserName } from "@/utils/db/users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"
import { createClient } from '@/utils/supabase/server'

export async function saveUserInfo(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    //const phone = formData.get("phone") as string;

    if (name.length > 0) {
        await updateUserName(userId, name);
    }

    if (email.length > 0) {
        await updateUserEmail(userId, email)
    }

    revalidatePath('/profile', 'layout')
    redirect('/profile')
}

export async function saveUserName(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const name = formData.get("name") as string;

    let msg = { message: "Name must contain at least one character and ideally match license info" }
    if (name.replace(/\s/g, "").length > 0) {
        const result = await updateUserName(userId, name);
        console.log(result)
        if (result?.status) {
            revalidatePath('/profile', 'layout')
            redirect('/profile')
        }
        msg.message = result?.message ?? ""
    }

    return msg

}

export async function saveUserEmail(currentState: { message: string }, formData: FormData) {
    const userId = formData.get("user") as string;
    const email = formData.get("email") as string;

    if (email.replace(/\s/g, "").length > 0) {
        await updateUserEmail(userId, email)
    }
}

export async function updateUserName(userId: string, name: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data || !data.user) {
        redirect('/login')
    }

    if (data.user.id !== userId) {
        //should never happen, but.....
        console.log("logged in user doesn't match")
    }

    if (name.length > 0) {
        const userMetadata = data.user.user_metadata;
        userMetadata.full_name = name;
        const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
            data: userMetadata
        })
        if (updateError) {
            return { message: updateError.message }
        }
        await dbSetUserName(userId, name);
        return { status: true, message: "success" }
    }

}

export async function updateUserEmail(userId: string, email: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data || !data.user) {
        redirect('/login')
    }

    if (data.user.id !== userId) {
        //should never happen, but.....
        console.log("logged in user doesn't match")
    }

    if (data.user.app_metadata.provider === 'email' && data.user.email !== email) {

        let { data: user, error: updateError } = await supabase.auth.updateUser({
            email: email
        })
        if (updateError) {
            return { message: updateError.message }
        }
        else {
            return { status: true, message: "Successfully set user email!" }
        }
    }
    else if (data.user.app_metadata.provider !== 'email') {
        return { message: "Can't update oauth identity's email!" }
    }

    redirect('/profile')
}
