export default function Question({
  questionDescription,
  questionName,
  questionDifficulty,
}: {
  questionDescription: String;
  questionName: String;
  questionDifficulty: String;
}) {
  return (
    <div>
      <div className="font-bold text-xl">Question</div>
      <p>Name: {questionName}</p>
      <p>Difficulty: {questionDifficulty}</p>
      <p>{questionDescription}</p>
    </div>
  );
}
