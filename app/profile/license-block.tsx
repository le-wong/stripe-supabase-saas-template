"use client"
import { License, SupportedLicenseTypes, AllStates } from "@/utils/types"
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addLicenseInfo, removeLicense, updateLicenseInfo } from "../dashboard/actions";
import { Dropdown } from "@/components/ui/dropdown-field"
import { CircleX, Eraser, EraserIcon, Pencil, Save, SquarePlus, Trash2 } from "lucide-react";
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'

interface LicenseProps {
    licenseId: string | null,
    userId: string,
    type: string | null,
    state: string | null,
    number: string
}

export const LicenseBlock = (props: LicenseProps) => {

    const [licenseType, setLicenseType] = useState(props.type);
    const [selectedLicenseState, setSelectedLicenseState] = useState(props.state);
    const [licenseNumber, setLicenseNumber] = useState(props.number);
    const [editLicense, setEditLicense] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isOpenDeleteLicense, setIsOpenDeleteLicense] = useState(false);

    const oldLicenseProps = props;
    const handleLicenseTypeChange = (event: any) => {
        setLicenseType(event.target.value);
    }

    const handleLicenseStateChange = (selected: string) => {
        setSelectedLicenseState(selected);
    }

    const handleLicenseNumberChange = (event: any) => {
        setLicenseNumber(event.target.value);
    }

    const handleSaveLicenses = async () => {
        if (!editLicense && props.licenseId) {
            setSelectedLicenseState(props.state)
            setLicenseType(props.type)
            setLicenseNumber(props.number)
            setEditLicense(true);
        }
        else {
            let errorMessage = "";
            if (!licenseType || licenseType.replace(/\s/g, "").length === 0) {
                errorMessage = errorMessage.concat("Type cannot be empty!\n")
            }
            if (!selectedLicenseState) {
                errorMessage = errorMessage.concat("State cannot be empty!\n")
            }
            if (!licenseNumber || licenseNumber.length === 0) {
                errorMessage = errorMessage.concat("License number cannot be empty!")
            }

            console.log(errorMessage)
            if (errorMessage.length === 0) {
                setErrorMsg("");

                if (!props.licenseId) {
                    setSelectedLicenseState(null)
                    setLicenseType(null)
                    setLicenseNumber("")
                }
                setEditLicense(false)
                if (!oldLicenseProps.licenseId) {
                    await addLicenseInfo(props.userId, licenseNumber, selectedLicenseState, licenseType)
                }
                else if (oldLicenseProps.number !== licenseNumber || oldLicenseProps.type !== licenseType || oldLicenseProps.state !== selectedLicenseState) {
                    await updateLicenseInfo(props.licenseId ?? oldLicenseProps.licenseId, licenseNumber, selectedLicenseState, licenseType)
                }

            }
            else {
                setErrorMsg(errorMessage);
            }
        }
    }

    const cancelSaveLicenses = () => {
        setLicenseNumber(oldLicenseProps.number);
        setLicenseType(oldLicenseProps.type);
        setSelectedLicenseState(oldLicenseProps.state);
        setErrorMsg("");
        setEditLicense(false);
    }

    const handleRemoveLicense = async () => {
        setIsOpenDeleteLicense(false)
        if (props.licenseId) {
            await removeLicense(props.licenseId)
        }
    }

    const confirmRemoveLicense = () => {
        setIsOpenDeleteLicense(true);
    }

    const handleCloseDialog = () => {
        setIsOpenDeleteLicense(false)
    }

    return (
        <>{!props.licenseId ? <span className="text-gray-600 self-center text-sm -ml-4">Add new...</span> : ""}
            <div className="flex grid grid-rows-1 grid-cols-[1fr_0.5fr_1fr_1fr] gap-4 py-2">

                {(!props.type || editLicense) ?
                    <Input key={"edit" + props.licenseId + props.type} placeholder="Enter license type..." value={licenseType ?? ""} onChange={handleLicenseTypeChange} className=""></Input>
                    :
                    <Input key={props.licenseId + props.type} value={props.type} readOnly={true} className="bg-gray-100" ></Input>
                }
                {(!props.state || editLicense) ?
                    <Dropdown items={Object.values(AllStates)} selectedItem={selectedLicenseState} onItemSelect={handleLicenseStateChange}></Dropdown>
                    :
                    <Input key={props.licenseId + props.state} value={props.state.toString()} readOnly={true} className="bg-gray-100"></Input>
                }

                {(editLicense || !props.licenseId) ?
                    <Input key={"edit" + (props.licenseId ?? "")} value={licenseNumber} onChange={handleLicenseNumberChange}></Input>
                    : <Input key={props.licenseId} value={props.number} readOnly={true} className="bg-gray-100"></Input>
                }

                <span className="grid grid-cols-3 pr-6 -my-4">
                    {props.licenseId ? (
                        <>
                            {editLicense ?
                                <>
                                    <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleSaveLicenses}><Save /></Button>
                                    <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={cancelSaveLicenses}><CircleX /></Button>
                                </>
                                : <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleSaveLicenses}><Pencil /></Button>
                            }
                            <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={confirmRemoveLicense}><Trash2 /></Button>
                        </>
                    )
                        :
                        <Button className="max-w-1/2 mt-4" variant="ghost" size="icon" onClick={handleSaveLicenses}><SquarePlus /></Button>
                    }
                </span>
                <span className="">
                    {(errorMsg.length > 0) && <p className="text-sm text-red-500 whitespace-pre-line">{errorMsg}</p>}
                </span>
                <Dialog open={isOpenDeleteLicense} onClose={handleCloseDialog} className="relative z-50">
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-4 bg-white p-8 rounded-lg">
                            <DialogTitle className="font-bold">{`Remove ${props.type}, ${props.state} License`}</DialogTitle>
                            <Description>Are you sure you want to delete this license?</Description>
                            <div className="flex gap-4">
                                <Button onClick={handleCloseDialog}>Cancel</Button>
                                <Button onClick={handleRemoveLicense}>Remove License</Button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

            </div>
        </>
    )
};