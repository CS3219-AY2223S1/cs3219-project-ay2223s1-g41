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
                                <div className="flex flex-col gap-2 dark:bg-dark-200 bg-light-100 p-2 rounded-md">
                                    <div className="gap-1 break-all">
                                        <p className="font-lg font-bold">Input:</p>
                                        <div className="flex-wrap">
                                            {_.isObject(example.input) ? (
                                                Object.entries(example.input).map((input, index) => (
                                                    <pre key={index}>
                                                        <code>
                                                            {input[0]} = {JSON.stringify(input[1])}
                                                        </code>
                                                    </pre>
                                                ))
                                            ) : _.isArray(example.input) ? (
                                                <pre>
                                                    <code key={index}>{JSON.stringify(example.input)}</code>
                                                </pre>
                                            ) : (
                                                <pre>
                                                    <code>{example.input}</code>
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                    <div className="gap-1 break-all">
                                        <p className="font-lg font-bold">Output:</p>
                                        <div className="flex-wrap">
                                            {_.isObject(example.output) ? (
                                                Object.entries(example.output).map((output, index) => (
                                                    <pre key={index}>
                                                        <code>
                                                            {output[0]} = {JSON.stringify(output[1])}
                                                        </code>
                                                    </pre>
                                                ))
                                            ) : _.isArray(example.output) ? (
                                                <pre>
                                                    <code key={index}>{JSON.stringify(example.output)}</code>
                                                </pre>
                                            ) : (
                                                <pre>
                                                    <code>{example.output}</code>
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>Explanation: {example.explanation}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
