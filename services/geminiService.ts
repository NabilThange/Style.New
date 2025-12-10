import { GoogleGenAI } from "@google/genai";
import { WardrobeItem, ImageSize } from "../types";

// Production-Ready VTO System Instruction
const SYSTEM_INSTRUCTION = `
You are an advanced Virtual Try-On (VTO) AI engine. 
Your sole purpose is to realistically visualize specific garments on a specific person.
You act as a strict digital compositor, not a creative artist.
Your Output MUST be the exact person from the Reference Image wearing the Garment Images.
NEVER generate a new person.
NEVER use the face or body of the models found in the Garment Images.
`;

// Helper to convert URL or Base64 to raw Base64 string for Gemini
const resolveImageBase64 = async (data: string): Promise<string> => {
  // If it's already a base64 data URI (from user upload)
  if (data.startsWith('data:image')) {
    return data.replace(/^data:image\/\w+;base64,/, "");
  }

  // If it's a remote URL (default items)
  if (data.startsWith('http')) {
    try {
      const response = await fetch(data);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.replace(/^data:image\/\w+;base64,/, ""));
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to fetch remote image:", error);
      throw new Error("Could not process default image. CORS or Network error.");
    }
  }

  // Fallback (raw base64 string)
  return data;
};

export const generateOutfitImage = async (
  person: WardrobeItem,
  upper: WardrobeItem,
  lower: WardrobeItem,
  modelId: string = 'gemini-2.5-flash-image',
  imageSize: ImageSize = '1K'
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Resolve all images to base64
    const [personB64, upperB64, lowerB64] = await Promise.all([
      resolveImageBase64(person.imageData),
      resolveImageBase64(upper.imageData),
      resolveImageBase64(lower.imageData)
    ]);

    // 1. Target Person (The Source of Truth for Identity)
    const personPart = {
      inlineData: {
        mimeType: "image/png",
        data: personB64,
      },
    };

    // 2. Garment 1 (Texture Source Only)
    const upperPart = {
      inlineData: {
        mimeType: "image/png",
        data: upperB64,
      },
    };

    // 3. Garment 2 (Texture Source Only)
    const lowerPart = {
      inlineData: {
        mimeType: "image/png",
        data: lowerB64,
      },
    };

    // The Production-Ready Prompt Template
    const promptText = {
      text: `PERFORM VIRTUAL TRY-ON TASK.

      INPUT IMAGES:
      [IMAGE 1] = TARGET MODEL (User Profile).
      [IMAGE 2] = UPPER GARMENT (${upper.name} ${upper.color || ''}).
      [IMAGE 3] = LOWER GARMENT (${lower.name} ${lower.color || ''}).

      STRICT GENERATION RULES:
      1. **IDENTITY LOCK**: You MUST preserve the face, hair, body shape, skin tone, and pose of the person in [IMAGE 1] exactly. Do not morph the face.
      2. **GARMENT EXTRACTION**: Extract ONLY the clothing texture, pattern, and material from [IMAGE 2] and [IMAGE 3]. 
      3. **IGNORE GARMENT MODELS**: If [IMAGE 2] or [IMAGE 3] shows a human model wearing the clothes, IGNORE that human completely. Do not transfer their face, body type, or background. Only take the cloth.
      4. **COMPOSITION**: Warp and fit the garments from [IMAGE 2] and [IMAGE 3] naturally onto the body of [IMAGE 1]. Respect the lighting and shadows of [IMAGE 1].
      5. **OUTFIT**: The final image must show the person from [IMAGE 1] wearing the shirt from [IMAGE 2] and the pants/skirt from [IMAGE 3].

      OUTPUT:
      A single photorealistic image of the TARGET MODEL wearing the new outfit. High fidelity, ${modelId === 'gemini-3-pro-image-preview' ? imageSize : ''}.`
    };

    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
      imageConfig: {
        aspectRatio: "3:4"
      }
    };

    if (modelId === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = imageSize;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        // Order matters: Person First, then Clothes
        parts: [personPart, upperPart, lowerPart, promptText]
      },
      config: config
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const editWardrobeImage = async (
  item: WardrobeItem, 
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imageB64 = await resolveImageBase64(item.imageData);

    const imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: imageB64,
      },
    };

    const promptPart = {
      text: `Edit this specific image.
      Task: ${prompt}
      Maintain the original item's core structure unless asked to change it.
      Output the modified image only.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, promptPart]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};