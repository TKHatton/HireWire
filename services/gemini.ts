
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
  console.error('⚠️ Gemini API key is missing or invalid. Please set GEMINI_API_KEY in your .env.local file.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateCoverLetter = async (role: string, company: string, skills: string, socialContext?: string) => {
  const prompt = `Write a high-impact, modern cover letter for a ${role} position at ${company}. 
  User Skills: ${skills}. 
  ${socialContext ? `Include these contact details naturally: ${socialContext}` : ''}
  Keep it under 250 words. Focus on results and passion.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Failed to generate.";
};

export const analyzeSkillGap = async (jobDescription: string, userSkills: string) => {
  const prompt = `Act as a senior technical recruiter. Compare this job description: "${jobDescription}" with my current skills: "${userSkills}". 
  Provide:
  1. A "Match Score" (0-100).
  2. The top 3 missing skills.
  3. A 48-hour rapid learning plan for the most critical gap.
  Format as clean Markdown.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Analysis unavailable.";
};

export const generateMockQuestions = async (role: string, company: string, description: string) => {
  const prompt = `Generate 5 challenging, role-specific interview questions for a ${role} position at ${company}. Base them on this description: ${description}. Include "Ideal Answer" hints for each.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Practice questions unavailable.";
};

export const reformatResume = async (resumeData: string, targetFormat: string) => {
  const prompt = `Reformat this professional data: "${resumeData}" into a standard ${targetFormat} structure. Ensure tone and formatting match regional norms (e.g., CV vs Resume).`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Reformatting failed.";
};

export const discoverRelatedJobs = async (currentJobs: string, skills: string) => {
  const prompt = `Based on these current applications: [${currentJobs}] and my skills: [${skills}], suggest 5 specific types of roles or companies I should target next. Explain the strategic "Why".`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "No suggestions at this time.";
};

export const generateInterviewGuide = async (role: string, company: string) => {
  const prompt = `Create a high-stakes interview prep guide for ${role} at ${company}. Focus on advanced technical concepts and cultural fit.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Failed to generate guide.";
};

export const generateResumeSummary = async (skills: string, experience: string) => {
  const prompt = `Write a punchy, 2-sentence executive summary for a high-end professional with these skills: ${skills} and experience: ${experience}.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Failed.";
};

export const chatWithHillary = async (message: string, context: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: `You are Hillary, a warm and data-driven AI career coach for job seekers.
      
      CORE RULES:
      1. ALWAYS reference the user's actual data in advice when provided.
      2. Be encouraging but HONEST about conversion rates.
      3. Suggest specific actions based on the user's pipeline.
      4. Celebrate offers LOUDLY.
      5. Frame rejections as progress towards the next 'Yes'.
      6. Match the user's energy level.
      
      Context: ${context}`,
    },
  });
  return response.text || "I'm processing your request.";
};

export const generateAvatar = async (prompt: string, baseImage?: string) => {
  const parts: any[] = [];

  // If a base image is provided, include it in the request for transformation
  if (baseImage) {
    // Extract base64 data if it's a data URL
    const base64Data = baseImage.includes('base64,')
      ? baseImage.split('base64,')[1]
      : baseImage;

    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
    parts.push({
      text: `Transform this person's photo into a professional, corporate-style avatar with this setting: ${prompt}. Keep the person's face recognizable but place them in the described environment. Make it look polished and professional.`
    });
  } else {
    // Generate from scratch if no base image
    parts.push({
      text: `A professional, corporate-style professional avatar: ${prompt}`
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
