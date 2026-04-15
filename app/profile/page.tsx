"use server"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserInfo, getLicenseInfo } from '../dashboard/actions'
import { Banner } from '@/components/ui/banner'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { License } from '@/components/License'

export default async function Profile() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }
    //console.log(data.user)
    const user = (await getUserInfo(data.user.id)).at(0) //TODO: handle no user??
    const phoneNumber = user && user.phone ? ('(' + user?.phone.slice(0, 3) + ')' + user?.phone.slice(3, 6) + '-' + user?.phone.slice(6)) : "No phone number"
    const userLicenseInfo = (await getLicenseInfo(user.id))
    //console.log(userLicenseInfo)
    const userLicenses = [];
    for (const license of userLicenseInfo) {
        userLicenses.push({
            type: license.license_type_table?.type,
            state: license.states_table?.state,
            number: license.licenses_table.licenseNumber
        })
    }
    console.log(userLicenses)
    return (
        <main className="flex-1">
            {!data.user.phone &&
                <Banner id="add-phone-banner">
                    <span className="text-center">
                        <Link href="#">Add your phone number</Link> to enable SMS-based learning!
                    </span>
                </Banner>
            }
            <div className="container">
                Hello {user?.name}
            </div>
            <div>
                <Card className="p-2 m-5">
                    <CardHeader>
                        <CardTitle>
                            My Account Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent style={{ whiteSpace: 'pre-line' }}>
                        {`Email: ${user?.email} 
                        Phone: ${phoneNumber}`}
                        <br></br>
                        <ul>
                            {userLicenses.map((license) => (
                                <li key={license.number}>
                                    <License
                                        type={license.type ?? ""}
                                        state={license.state ?? ""}
                                        number={license.number} />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </main >)

}
