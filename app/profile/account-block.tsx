"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { License } from "@/utils/types"
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LicenseBlock } from "./license-block";
import { saveUserName, saveUserEmail } from "./actions";
import { CircleCheck, CircleX } from "lucide-react";
import { forgotPassword } from "../auth/actions";


interface AccountProps {
    userId: string,
    name: string,
    email: string,
    emailVerified: boolean,
    phone: string | null,
    license: License[] | null,
    editFn: any

}

export default function AccountBlock(props: AccountProps) {
    const initialMessage = {
        message: ''
    }
    const [formStateName, formActionName] = useActionState(saveUserName, initialMessage)
    const [formStateEmail, formActionEmail] = useActionState(saveUserEmail, initialMessage)
    const [formStatePassword, formActionPassword] = useActionState(forgotPassword, initialMessage);
    const [editInfo, setEditInfo] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);

    const handleEditInfo = () => {
        setEditInfo(true)
    }

    const handleSaveInfo = () => {
        setEditInfo(false)
    }

    const handleCancelEditInfo = () => {
        setEditInfo(false)
    }

    const handleEditName = () => {
        setEditName(true)
    }

    const handleCancelEditName = () => {
        setEditName(false)
    }

    const handleEditEmail = () => {
        setEditEmail(true)
    }

    const handleCancelEditEmail = () => {
        setEditEmail(false)
    }



    return (
        <div className="flex grid-cols-2">
            <Card className="p-2 m-5">
                <CardHeader>
                    <CardTitle>
                        My Account Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-line">
                    {editInfo ? <>
                        <form action={formActionName} className="grid gap-4 grid-cols-2">
                            <input type="hidden" name="user" value={props.userId} />
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" defaultValue={props.name} name="name" required />
                            </div>
                            <span className="grid grid-cols-2 gap-4 mt-2">
                                <Button className="w-full mt-4" type='submit'>Save</Button>
                            </span>
                            {formStateName?.message && (
                                <p className="text-sm text-red-500 text-center py-2">{formStateName.message}</p>
                            )}
                        </form>
                        <br></br>
                        <form action={formActionEmail} className="grid gap-4 grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email (requires reverification)</Label>
                                <Input id="email" type="email" defaultValue={props.email} name="email" />
                            </div>
                            <span className="grid grid-cols-2 gap-4 mt-2">
                                <Button className="w-full mt-4" type='submit'>Save</Button>
                            </span>
                        </form>
                        <br />
                        <form action={formActionPassword} className="grid gap-4 grid-cols-2">
                            <input type="hidden" name="email" value={props.email} />
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="********" name="password" className="bg-gray-100" readOnly={true} />
                            </div>
                            <span className="grid grid-cols-2 gap-4 mt-2">
                                <Button className="w-full mt-4" type='submit'>Reset Password</Button>
                            </span>
                        </form>
                        <Button className="w-full mt-4" onClick={handleCancelEditInfo}>Cancel</Button>
                    </>
                        :
                        <div>
                            <div className="flex items-center gap-3">
                                <p>{`Email: ${props.email}`}</p>
                                {props.emailVerified ?
                                    <span className="flex items-center gap-1">
                                        <CircleCheck className="text-green-500"></CircleCheck>
                                        <Label className="text-green-500">Email verified!</Label>
                                    </span>
                                    :
                                    <span className="flex items-center gap-1">
                                        <CircleX className="text-red-500"></CircleX>
                                        <Label className="text-red-500">Pending verification!</Label>
                                    </span>
                                }
                            </div>
                            <div>{`Phone: ${props.phone ?? ""}`}</div>
                            <Button className="w-full mt-4" onClick={handleEditInfo}>Edit Info</Button>
                        </div>
                    }
                </CardContent>
            </Card>
            <Card className="p-2 m-5">
                <CardHeader>
                    <CardTitle>My Licenses</CardTitle>
                    <CardDescription className="text-red-500">Enter information exactly as it appears on issued license! </CardDescription>
                </CardHeader>
                <CardContent>
                    {props.license?.map((myLicense, index) => (
                        <LicenseBlock key={index} licenseId={myLicense.id} userId={props.userId} type={myLicense.type} state={myLicense.state} number={myLicense.number ?? null}></LicenseBlock>
                    ))}
                    <LicenseBlock key={-1} licenseId={null} userId={props.userId} type={null} state={null} number={""}></LicenseBlock>
                </CardContent>
            </Card>
        </div >
    )
}