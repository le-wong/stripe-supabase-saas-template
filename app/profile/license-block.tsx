"use client"
import { License, SupportedLicenseTypes, SupportedStates } from "@/utils/types"
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateLicenseInfo, removeLicense } from "../dashboard/actions";
import { Dropdown } from "@/components/ui/dropdown-field"
import { Eraser, EraserIcon, Pencil, SquarePlus } from "lucide-react";

interface LicenseProps {
    id: string | null,
    userId: string,
    type: string | null,
    state: string | null,
    number: string
}
export const LicenseBlock = (props: LicenseProps) => {

    const [selectedLicenseType, setSelectedLicenseType] = useState(props.type);
    const [selectedLicenseState, setSelectedLicenseState] = useState(props.state);
    const [licenseNumber, setLicenseNumber] = useState(props.number);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLicenseTypeChange = (selected) => {
        setSelectedLicenseType(selected);
    }

    const handleLicenseStateChange = (selected) => {
        setSelectedLicenseState(selected);
    }

    const handleLicenseNumberChange = (event) => {
        setLicenseNumber(event.target.value);
    }
    const handleSaveLicenses = async () => {
        let errorMessage = "";
        if (!licenseNumber || licenseNumber.length === 0) {
            errorMessage = errorMessage.concat("License number cannot be empty!\n")
        }
        if (!selectedLicenseState) {
            errorMessage = errorMessage.concat("State cannot be empty!\n")
        }
        if (!selectedLicenseType) {
            errorMessage = errorMessage.concat("Type cannot be empty!")
        }

        if (errorMessage.length === 0) {
            setErrorMsg("");
            //setEditLicenses(false)
            await updateLicenseInfo(props.userId, licenseNumber, selectedLicenseState, selectedLicenseType)

        }
        else {
            setErrorMsg(errorMessage);
        }
    }

    const handleRemoveLicense = async () => {
        if (props.id) {
            await removeLicense(props.id)
        }
    }


    return (

        <div className="grid grid-rows-1 grid-cols-8 gap-4 py-2">
            {props.type ?
                <Input value={props.type.toString()} readOnly={true} className="bg-gray-200"></Input> :
                <Dropdown items={Object.values(SupportedLicenseTypes)} selectedItem={selectedLicenseType} onItemSelect={handleLicenseTypeChange}></Dropdown>}
            {props.state ?
                <Input value={props.state.toString()} readOnly={true} className="bg-gray-200"></Input> :
                <Dropdown items={Object.values(SupportedStates)} selectedItem={selectedLicenseState} onItemSelect={handleLicenseStateChange}></Dropdown>}

            <Input value={licenseNumber} onChange={handleLicenseNumberChange}></Input>

            <span className="grid grid-cols-2 -my-4">
                <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleSaveLicenses}>{props.id ? <Pencil /> : <SquarePlus />}</Button>
                {props.id && <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleRemoveLicense}><Eraser /></Button>}
            </span>
            {(!props.id && errorMsg.length > 0) && <p className="col-span-3 text-sm text-red-500 " style={{ whiteSpace: 'pre-line' }}>{errorMsg}</p>}


        </div>
    )
};