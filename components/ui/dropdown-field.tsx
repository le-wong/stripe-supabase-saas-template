import Downshift, { useSelect } from "downshift";

interface DropdownProps {
    items: string[],
    selectedItem: any,
    onItemSelect: any
}

export const Dropdown = (props: DropdownProps) => {
    //const [selectedItem, setSelectedItem] = useState(null);
    /*
    const {
        isOpen,
        selectedItem,
        highlightedIndex,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
    } = useSelect({
        items,
        //selectedItem,
        onSelectedItemChange: ({ selectedItem: newSelectedItem }) => onItemSelect(newSelectedItem)
    });
    console.log(onItemSelect)
    */
    const items = props.items
    return (
        <Downshift onChange={props.onItemSelect} >
            {({
                isOpen,
                //selectedItem,
                highlightedIndex,
                getToggleButtonProps,
                getMenuProps,
                getItemProps,
            }) => (
                <div className='border rounded-md text-sm px-3 py-2'>
                    <button className="" {...getToggleButtonProps()}>
                        {props.selectedItem || 'Select...'}
                    </button>
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
                </div>)}
        </Downshift>
    );
};