import OpenAI from "openai";

//API Key wird aus der Umgebungsvariable OPENAI_API_KEY gelesen
export const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION_ID,
});

//Die Assistant ID welche für den Chat verwendet wird
export const assistantId = process.env.OPENAI_ASSISTANT_ID;
