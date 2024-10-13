import { defaultAssistantId } from "@/app/openai"; //default assistantId
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Add a new message to a thread and invoke the assistant on the updated thread
export async function POST(request, { params: { threadId } }) {
  const { content } = await request.json();
  const searchParams = request.nextUrl.searchParams
  let assistantId = searchParams.get("assistantId");

  if (!assistantId) {
    assistantId = defaultAssistantId
  }
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
