import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return;
    }

    const client = await connectToDatabase();
    const difficulty = req.query.difficulty as string;
    const questionNum = req.query.questionNum as string;

    let collection;

    if (difficulty == "easy") {
        collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_QN_EASY!);
    } else if (difficulty == "medium") {
        collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_QN_MEDIUM!);
    } else {
        collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_QN_HARD!);
    }

    //const questionCount = await easyCollection.countDocuments();
    const question = await collection.findOne({ id: parseInt(questionNum) });

    if (!question) {
        res.status(404).json({ message: "Failed to find question." });
        await client.close();
        return;
    }
    await client.close();
    res.status(200).json({ message: "Fetched a random easy question.", question: question });
}

export default handler;
