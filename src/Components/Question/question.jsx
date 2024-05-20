

export const Question = ({question}) => {
    const q = JSON.parse(question.options)
    return (
        <div>
            <p>{question.question_text}</p>
            <table>
                <tr>
                    <td>{q[0]}</td>
                    <td>{q[1]}</td>
                </tr>
                <tr>
                    <td>{q[2]}</td>
                    <td>{q[3]}</td>
                </tr>
            </table>
        </div>
    )
}