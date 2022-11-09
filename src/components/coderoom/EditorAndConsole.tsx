import { useState } from "react";
import LanguageSelectionListbox from "./LangaugeSelectionListbox";
import ThemeSelectionListbox from "./ThemeSelectionListbox";
import Editor, { OnChange } from "@monaco-editor/react";
import { ClockLoader as Loader } from "react-spinners";
import axios from "axios";
import useWindowDimensions from "../../utils/useWindowDimension";
import { Tab } from "@headlessui/react";

export default function EditorAndConsole({ input, onChangeHandler }: { input: string; onChangeHandler: OnChange }) {
    const [currentLanguage, setCurrentLanguage] = useState("python");
    const [currentTheme, setCurrentTheme] = useState("vs-dark");

    const [results, setResults] = useState<any[]>([]);

    async function submitCode(code: string) {
        let config = {
            method: "post",
            url: "/api/coderunner",
            headers: {
                "Content-Type": "text/plain",
            },
            data: code,
        };
        await axios(config)
            .then((res) => setResults([...results, ...res.data.result]))
            .catch((err) => console.log(err));
    }

    const { height } = useWindowDimensions();

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <div className="col-span-3 dark:bg-dark-100 bg-white rounded-lg h-full">
            <Tab.Group>
                <Tab.List className="flex flex-center justify-center space-x-1 bg-blue-900/20 p-1">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                "w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700",
                                selected ? "bg-green-200" : "dark:text-white text-black hover:bg-white/[0.12] hover:dark:text-white hover:text-black"
                            )
                        }
                    >
                        Code Editor
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                "w-full rounded-lg py-1 text-sm font-medium leading-5 text-blue-700",
                                selected ? "bg-green-200" : "dark:text-white text-black hover:bg-white/[0.12] hover:dark:text-white hover:text-black"
                            )
                        }
                    >
                        Console
                    </Tab>
                </Tab.List>
                <Tab.Panels className="w-full h-full">
                    <Tab.Panel className="px-1 mt-2">
                        <div className="flex gap-6 items-center">
                            <div className="flex gap-1 items-center">
                                <p>Change language:</p>
                                <LanguageSelectionListbox setCurrentLanguage={setCurrentLanguage} />
                            </div>
                            <div className="flex gap-1 items-center">
                                <p>Change theme:</p>
                                <ThemeSelectionListbox setCurrentTheme={setCurrentTheme} />
                            </div>
                            <button
                                disabled={currentLanguage !== "python"}
                                onClick={() => submitCode(input)}
                                className="mt-1 ml-10 flex items-center gap-2 px-4 py-1.5 font-bold outline outline-green-200 disabled:opacity-70 bg-green-200 rounded text-dark-100"
                            >
                                Submit!
                            </button>
                        </div>

                        <Editor
                            height={`${height! - 255}px`}
                            theme={currentTheme}
                            defaultLanguage="python"
                            language={currentLanguage}
                            loading={<Loader />}
                            value={input}
                            onChange={onChangeHandler}
                            className="mt-2 h-full"
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        style={{ height: "75vh" }}
                        className="flex flex-col w-full h-full mt-2 mb-10 dark:bg-black bg-white break-all overflow-y-auto"
                    >
                        <button
                            className="absolute w-fit dark:border-white border-black border-2 rounded-lg px-1 mt-1 mr-1 text-sm self-end"
                            onClick={() => setResults([])}
                        >
                            Clear
                        </button>
                        {results &&
                            results.map((result, index) => (
                                <div key={index} className="dark:text-white text-black w-full break-all">
                                    {result}
                                </div>
                            ))}
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
