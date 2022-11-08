export interface QuestionType {
    _id: string;
    type: string[];
    name: string;
    difficulty: string;
    description: string;
    examples: { input: any; output: any; explanation: string }[];
    tests: any[];
}
