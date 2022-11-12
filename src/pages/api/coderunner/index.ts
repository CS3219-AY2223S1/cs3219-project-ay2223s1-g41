import { NextApiRequest, NextApiResponse } from "next";
import { PythonShell } from "python-shell";

console.log("code runner started");
async function pythonRunner(code: string) {
    try {
        return new Promise<any[] | undefined>((resolve) => {
            PythonShell.runString(code, undefined, function (err, result) {
                console.log("inside python runner");
                if (err) resolve(Object.entries(err));
                resolve(result);
            });
        });
    } catch (err) {
        throw err;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(500).json("error");
    }
    const code = req.body;
    console.log("submitted code: " + code);
    const result = await pythonRunner(code);
    console.log("result: " + result);
    return res.status(200).json({
        result: result,
    });
}
