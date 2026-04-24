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
        await dbSetUserName(userId, name);
    }

    if (email.length > 0) {
        return await updateUserEmail(email)
    }

    revalidatePath('/profile', 'layout')
    redirect('/profile')
}

export async function updateUserEmail(email: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data || !data.user) {
        redirect('/login')
    }

    if (data.user.app_metadata.provider === 'email' && data.user.email !== email) {

        let { data, error } = await supabase.auth.updateUser({
            email: email
        })
        if (error) {
            return { message: error.message }
        }
        else {
            revalidatePath('/profile', 'layout')
            redirect('/profile')
        }
    }
    else if (data.user.app_metadata.provider !== 'email') {
        return { message: "Can't update oauth identity's email!" }
    }

    redirect('/profile')
}
