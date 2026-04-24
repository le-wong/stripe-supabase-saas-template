"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { License } from "@/utils/types"
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LicenseBlock } from "./license-block";
import { saveUserInfo } from "./actions";


interface AccountProps {
    userId: string,
    name: string,
    email: string,
    phone: string | null,
    license: License[] | null,
    editFn: any

}

export default function AccountBlock(props: AccountProps) {

    const initialMessage = {
        message: ''
    }
    const [formState, formAction] = useActionState(saveUserInfo, initialMessage)
    const [editInfo, setEditInfo] = useState(false);

    const handleEditInfo = () => {
        setEditInfo(true)
        //initialMessage.message = ""
    }

    const handleSaveInfo = () => {
        setEditInfo(false)
    }

    const handleCancel = () => {
        setEditInfo(false)
    }

    return (
        <div>
            <Card className="p-2 m-5">
                <CardHeader>
                    <CardTitle>
                        My Account Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-line">
                    {editInfo ?
                        <form action={formAction} className="grid gap-4">
                            <input type="hidden" name="user" value={props.userId} />
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    defaultValue={props.name}
                                    name="name"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email (requires reverification)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={props.email}
                                    name="email"
                                />
                            </div>
                            <span className="grid grid-cols-2 gap-4">
                                <Button className="w-full mt-4" type='submit'>Save</Button>
                                <Button className="w-full mt-4" onClick={handleCancel}>Cancel</Button>
                            </span>
                            {formState?.message && (
                                <p className="text-sm text-red-500 text-center py-2">{formState.message}</p>
                            )}
                        </form>
                        :
                        <div>
                            <p>{`Email: ${props.email} \n Phone: ${props.phone ?? ""}`}</p>
                            <Button className="w-full mt-4" onClick={handleEditInfo}>Edit Info</Button>
                        </div>
                    }
                </CardContent>
            </Card>
            <Card className="p-2 m-5">
                <CardHeader>
                    <CardTitle>My Licenses</CardTitle>
                </CardHeader>
                <CardContent>
                    {props.license?.map((myLicense) => (
                        <LicenseBlock key={myLicense.type.concat(myLicense.state).concat(myLicense.number)} licenseId={myLicense.id} userId={props.userId} type={myLicense.type} state={myLicense.state} number={myLicense.number ?? null}></LicenseBlock>
                    ))}
                    <LicenseBlock key="new" licenseId={null} userId={props.userId} type={null} state={null} number={""}></LicenseBlock>
                </CardContent>
            </Card>
        </div >
    )
}