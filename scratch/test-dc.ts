import { adminDcMutate } from "../lib/firebase/admin-dc";

async function main() {
  const dotenv = require("dotenv");
  dotenv.config();

  console.log("Running direct DC mutation test...");
  try {
    const res = await adminDcMutate("UpdateLesson", {
      id: "aaaaaaaa-1110-4000-8000-000000000001",
      title: "Updated Philadelphia Assessment Title",
      contentJson: JSON.stringify({
        version: 2,
        kind: "structured-lesson",
        summary: "Test Philly",
        objectives: ["Review philly props"],
        estimatedDurationMinutes: 15,
        completionMode: "manual",
        blocks: [
          {
            id: "rich-text-1",
            type: "richText",
            title: "Philly Assessment",
            isStudentVisible: true,
            required: true,
            contentKind: "tiptap",
            content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Welcome to Philly assessment academy." }] }] })
          }
        ]
      })
    });
    console.log("DC Mutation Success:", res);
  } catch (err) {
    console.error("DC Mutation Error:", err);
  }
}

main();
