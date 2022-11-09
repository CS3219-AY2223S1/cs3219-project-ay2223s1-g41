import { NextApiRequest, NextApiResponse } from "next";
import { PythonShell } from "python-shell";

async function pythonRunner(code: string) {
    return new Promise<any[] | undefined>((resolve) => {
        PythonShell.runString(code, undefined, function (err, result) {
            if (err) resolve(Object.entries(err));
            resolve(result);
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(500).json("error");
    }
    const code = req.body;

    const result = await pythonRunner(code);
    return res.status(200).json({
        result: result,
    });
}
