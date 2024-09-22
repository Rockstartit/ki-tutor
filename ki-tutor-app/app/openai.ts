import OpenAI from "openai";

//API Key wird aus der Umgebungsvariable OPENAI_API_KEY gelesen
export const openai = new OpenAI({
    organization: "org-JOZZVGILnxuXT7NdjxlKF7g8"
});

//Die Assistant ID welche für den Chat verwendet wird
export const assistantId = "asst_nUCtNHJFFdODxsSde7TJ0iJ2";
