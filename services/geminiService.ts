import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, AppLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: { companyName: { type: Type.STRING }, jobTitle: { type: Type.STRING } },
      required: ["companyName", "jobTitle"]
    },
    design: {
        type: Type.OBJECT,
        properties: {
          layout: { type: Type.STRING, enum: ["modern", "classic", "minimal"] },
          color: { type: Type.STRING, enum: ["blue", "emerald", "slate", "rose", "amber"] },
          font: { type: Type.STRING, enum: ["sans", "serif", "mono"] },
          rationale: { type: Type.STRING, description: "Message direct à l'utilisateur pour expliquer les choix." }
        },
        required: ["layout", "color", "font", "rationale"]
    },
    cv: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        title: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        summary: { type: Type.STRING },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              company: { type: Type.STRING },
              duration: { type: Type.STRING },
              description: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["role", "company", "duration", "description"]
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              degree: { type: Type.STRING },
              institution: { type: Type.STRING },
              year: { type: Type.STRING }
            },
            required: ["degree", "institution", "year"]
          }
        },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["fullName", "title", "summary", "skills", "experience", "education"]
    },
    coverLetter: { type: Type.STRING }
  },
  required: ["analysis", "design", "cv", "coverLetter"]
};

const MODEL_NAME = "gemini-3-flash-preview";

export const generateOrRefineContent = async (
  jobDescription: string,
  currentData: GeneratedContent | null,
  userMessage: string,
  masterCV: string,
  masterLetter: string,
  language: AppLanguage
): Promise<GeneratedContent> => {
  
  const isInitial = currentData === null;
  const langName = language === 'fr' ? 'Français' : 'English';

  const prompt = `
    Tu es un Expert Carrière et Designer. Tu interagis via un Chat.
    
    LANGUE DE SORTIE OBLIGATOIRE : ${langName}. (Tout le contenu CV et Lettre doit être en ${langName}).
    
    TÂCHE : ${isInitial ? "Créer une nouvelle candidature" : "Modifier la candidature existante"}
    
    OFFRE D'EMPLOI :
    ${jobDescription}
    
    ${isInitial ? `
    DONNÉES MAÎTRES (Source) :
    - CV : ${masterCV}
    - Lettre : ${masterLetter}
    ` : `
    ÉTAT ACTUEL JSON :
    ${JSON.stringify(currentData)}
    `}
    
    MESSAGE UTILISATEUR : "${userMessage}"
    
    DIRECTIVES :
    1. Si c'est la première demande, crée un CV et une lettre adaptés à l'offre en utilisant les données maîtres.
    2. Si c'est une modification, mets à jour le JSON actuel selon la demande (design ou contenu).
    3. 'design.rationale' doit contenir ta réponse textuelle au chat.
    4. Pas de photo. Format A4.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("Réponse vide de l'IA");
    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw error;
  }
};