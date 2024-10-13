import OpenAI from "openai";

//API Key is Read form the Environment Variable OPENAI_API_KEY
export const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION_ID,
});

//The defauult Assistant ID that is used if no other is provided in the url
export const defaultAssistantId = process.env.OPENAI_ASSISTANT_ID;
