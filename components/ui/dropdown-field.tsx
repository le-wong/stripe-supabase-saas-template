'use client';
import { useCombobox } from "downshift";
import { Input } from "./input";
import { Label } from "./label";
import { cx } from "class-variance-authority";
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
        <div>
            <div className="flex flex-col">
                <Label {...getLabelProps()}></Label>
                <Input className="" {...getInputProps()} placeholder={props.selectedItem || 'Select...'} />
                <button className="" {...getToggleButtonProps()} />
            </div>
            <ul {...getMenuProps()} className={`absolute w-36 bg-white mt-0 shadow-md max-h-80 overflow-scroll p-0 z-10 ${!isOpen && 'hidden'
                }`}>
                {isOpen &&
                    items.map((item, index) => (
                        <li className={cx(
                            highlightedIndex === index && 'bg-blue-300',
                            selectedItem === item && 'font-bold',
                            'py-2 px-3 shadow-sm flex flex-col text-sm',
                        )}
                            key={`${item}${index}`}
                            {...getItemProps({ item, index })}
                        >
                            <span>{item}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
};