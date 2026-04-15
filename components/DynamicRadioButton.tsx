
export const QuestionChoiceRadioButtons = ({ options, selectedOption, onSelect }) => {
    //const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (event) => {
        const value = event.target.value;
        onSelect(value);
    };

    return (
        <>
            {options.map((option) => (
                <ul key={option.choiceNumber}>
                    <input
                        type="radio"
                        id={option.choiceNumber}
                        name="dynamicRadio"
                        value={option.choiceNumber}
                        checked={selectedOption === option.choiceNumber.toString()}
                        onChange={handleOptionChange}
                    />
                    <label htmlFor={option.choiceNumber}> {option.choiceNumber}: {option.choiceText}</label>
                </ul>
            ))}
        </>
    )
}