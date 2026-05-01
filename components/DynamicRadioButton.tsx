
export const QuestionChoiceRadioButtons = ({ options, selectedOption, onSelect }) => {
    const numberToLetterLabels: Map<number, string> = new Map([
        [1, 'A'],
        [2, 'B'],
        [3, 'C'],
        [4, 'D'],
        [5, 'E'],
        [6, 'F']
    ])

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
                    <label htmlFor={option.choiceNumber}> {numberToLetterLabels.get(option.choiceNumber)}: {option.choiceText}</label>
                </ul>
            ))}
        </>
    )
}