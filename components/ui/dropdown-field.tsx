'use client';
import Downshift, { useCombobox, useSelect } from "downshift";
import { Input } from "./input";
import { Label } from "./label";

interface DropdownProps {
    items: string[],
    selectedItem: any,
    onItemSelect: any
}

//export const Dropdown = (props: DropdownProps) => {
export function Dropdown(props: DropdownProps) {
    const items = props.items
    const selectedItem = props.selectedItem

    const {
        isOpen,
        highlightedIndex,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        getInputProps,
        getLabelProps
    } = useCombobox({
        items: items,
        selectedItem,
        itemToString(item) {
            return item ?? ''
        },
        onSelectedItemChange: ({ selectedItem }) => {
            props.onItemSelect(selectedItem)
        },
        defaultIsOpen: false
    })

    return (
        <div >
            <div >
                <Label {...getLabelProps()}></Label>
                <Input className="" {...getInputProps()} placeholder={props.selectedItem || 'Select...'} />
                <button className="" {...getToggleButtonProps()} />
            </div>
            <ul {...getMenuProps()} className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${!isOpen && 'hidden'
                }`}>
                {isOpen &&
                    items.map((item, index) => (
                        <li className={highlightedIndex === index ? 'bg-blue-300' : 'bg-white'}
                            key={`${item}${index}`}
                            {...getItemProps({ item, index })}
                        >
                            {item}
                        </li>
                    ))}
            </ul>
        </div>
    );
};