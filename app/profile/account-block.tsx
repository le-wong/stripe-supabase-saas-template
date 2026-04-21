"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { License } from "@/utils/types"
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LicenseBlock } from "./license-block";


interface AccountProps {
    userId: string,
    name: string,
    email: string,
    phone: string | null,
    license: License[] | null,
    editFn: any

}

export default function AccountBlock(props: AccountProps) {
    //const [formState, formAction] = useActionState(loginUser, initialState)
    const initialMessage = {
        message: ''
    }
    const [editInfo, setEditInfo] = useState(false);

    const handleEditInfo = () => {
        setEditInfo(true)
    }

    const handleSaveInfo = () => {
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
                <CardContent style={{ whiteSpace: 'pre-line' }}>
                    {editInfo ? <form action={props.editFn}>
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={props.email}
                                name="email"
                            />
                        </div>
                        <div className="grid gap-2 mt-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="phone"
                                name="phone"
                            />
                        </div>
                        <Button className="w-full mt-4" onClick={handleSaveInfo}>Save</Button>
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
                        <LicenseBlock key={myLicense.type.concat(myLicense.state).concat(myLicense.number)} id={myLicense.id} userId={props.userId} type={myLicense.type} state={myLicense.state} number={myLicense.number ?? null}></LicenseBlock>
                    ))}
                    <LicenseBlock key="new" id={null} userId={props.userId} type={null} state={null} number={""}></LicenseBlock>
                </CardContent>
            </Card>
        </div >
    )
}