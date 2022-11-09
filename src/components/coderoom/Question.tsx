import { QuestionType } from "../../../peerprep";
import _ from "lodash";

export default function Question({ question }: { question: QuestionType | undefined }) {
    const difficulty = question?.difficulty;
    return (
        <div className="col-span-1 dark:bg-dark-100 bg-white rounded-lg flex flex-col p-2 overflow-auto h-full">
            {question && (
                <>
                    <div className="font-bold text-md py-1">Question: {question.name}</div>
                    <div className="font-bold text-md flex gap-1 pt-1 pb-3 border-b-2 dark:border-dark-200 border-light-100">
                        Difficulty:
                        <div
                            className={`${
                                difficulty === "hard" ? "bg-red-800" : difficulty === "medium" ? "bg-yellow-600" : "bg-green-800"
                            } px-2 rounded-lg text-white`}
                        >
                            {difficulty}
                        </div>
                    </div>

                    <div className="text-md py-1 mt-2 break-words">{question.description}</div>
                    <div>
                        {question.examples.map((example, index) => (
                            <div key={index} className="text-md gap-2 my-8 flex flex-col">
                                Example {index + 1}:
                                <div className="flex flex-col gap-2 dark:bg-dark-200 bg-light-100 p-2 rounded-md flex-wrap break-all">
                                    <div className="gap-1">
                                        <p className="font-lg font-bold">Input:</p>
                                        <div className="flex flex-col">
                                            {_.isObject(example.input) ? (
                                                Object.entries(example.input).map((input, index) => (
                                                    <code key={index}>
                                                        {input[0]} = {JSON.stringify(input[1])}
                                                    </code>
                                                ))
                                            ) : _.isArray(example.input) ? (
                                                <code key={index}>{JSON.stringify(example.input)}</code>
                                            ) : (
                                                <code>{example.input}</code>
                                            )}
                                        </div>
                                    </div>
                                    <div className="gap-1">
                                        <p className="font-lg font-bold">Output:</p>
                                        <div className="flex flex-col">
                                            {_.isObject(example.output) ? (
                                                Object.entries(example.output).map((output, index) => (
                                                    <code key={index}>
                                                        {output[0]} = {JSON.stringify(output[1])}
                                                    </code>
                                                ))
                                            ) : _.isArray(example.output) ? (
                                                <code key={index}>{JSON.stringify(example.output)}</code>
                                            ) : (
                                                <code>{example.output}</code>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {example.explanation && <div>Explanation: {example.explanation}</div>}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
