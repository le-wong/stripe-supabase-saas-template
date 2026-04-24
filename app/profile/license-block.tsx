"use client"
import { License, SupportedLicenseTypes, AllStates } from "@/utils/types"
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateLicenseInfo, removeLicense } from "../dashboard/actions";
import { Dropdown } from "@/components/ui/dropdown-field"
import { Eraser, EraserIcon, Pencil, Save, SquarePlus, Trash2 } from "lucide-react";
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

interface LicenseProps {
    licenseId: string | null,
    userId: string,
    type: string | null,
    state: string | null,
    number: string
}

interface DialogProps {
    message: string,
    executeFn: any
}

const DialogBox = (props: DialogProps) => {

    return (
        <>

        </>
    )

}
export const LicenseBlock = (props: LicenseProps) => {

    const [selectedLicenseType, setSelectedLicenseType] = useState(props.type);
    const [selectedLicenseState, setSelectedLicenseState] = useState(props.state);
    const [licenseNumber, setLicenseNumber] = useState(props.number);
    const [editLicense, setEditLicense] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isOpenDeleteLicense, setIsOpenDeleteLicense] = useState(false);

    const oldLicenseProps = props;

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
        if (!editLicense && props.licenseId) {
            setEditLicense(true);
        }
        else {
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
            console.log(errorMessage)
            if (errorMessage.length === 0) {
                setErrorMsg("");
                setSelectedLicenseState(null)
                setSelectedLicenseType(null)
                setLicenseNumber("")
                setEditLicense(false)
                if (oldLicenseProps.number !== licenseNumber) {
                    await updateLicenseInfo(props.userId, licenseNumber, selectedLicenseState, selectedLicenseType)
                }

            }
            else {
                setErrorMsg(errorMessage);
            }
        }
    }

    const handleRemoveLicense = async () => {
        console.log("here")
        setIsOpenDeleteLicense(false)
        if (props.licenseId) {
            await removeLicense(props.licenseId)
        }
    }

    const confirmRemoveLicense = () => {
        setIsOpenDeleteLicense(true)
    }

    return (

        <div className="grid grid-rows-1 grid-cols-8 gap-4 py-2">
            {props.type ?
                <Input key="type" value={props.type.toString()} readOnly={true} className="bg-gray-200"></Input> :
                <Dropdown items={Object.values(SupportedLicenseTypes)} selectedItem={selectedLicenseType} onItemSelect={handleLicenseTypeChange} ></Dropdown>}
            {props.state ?
                <Input key="state" value={props.state.toString()} readOnly={true} className="bg-gray-200 "></Input> :
                <Dropdown items={Object.values(AllStates)} selectedItem={selectedLicenseState} onItemSelect={handleLicenseStateChange}></Dropdown>}

            {(editLicense || !props.licenseId) ? <Input key="number" value={licenseNumber} onChange={handleLicenseNumberChange}></Input>
                : <Input key="number" value={licenseNumber} readOnly={true} className="bg-gray-200 "></Input>
            }

            <span className="grid grid-cols-2 -my-4">
                {props.licenseId ? <>
                    <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleSaveLicenses}>{editLicense ? <Save /> : <Pencil />}</Button>
                    <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={confirmRemoveLicense}><Trash2 /></Button>
                </>
                    :
                    <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleSaveLicenses}><SquarePlus /></Button>
                }
            </span>
            {(errorMsg.length > 0) && <p className="col-span-3 text-sm text-red-500 whitespace-pre-line">{errorMsg}</p>}
            <Dialog open={isOpenDeleteLicense} onClose={() => setIsOpenDeleteLicense(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 bg-white p-8 rounded-lg">
                        <DialogTitle className="font-bold">{`Remove ${selectedLicenseType}, ${selectedLicenseState} License`}</DialogTitle>
                        <Description>Are you sure you want to delete this license?</Description>
                        <div className="flex gap-4">
                            <Button onClick={() => setIsOpenDeleteLicense(false)}>Cancel</Button>
                            <Button onClick={handleRemoveLicense}>Remove License</Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

        </div>
    )
};