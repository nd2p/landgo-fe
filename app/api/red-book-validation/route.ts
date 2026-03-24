import { NextResponse } from "next/server";

type GeminiValidationResult = {
  isRedBook: boolean;
  reason: string;
};

function stripCodeFences(value: string) {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
}

async function validateSingleFileWithGemini(file: File) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelUrl =
    process.env.AI_MODEL ??
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const bytes = await file.arrayBuffer();
  const mimeType = file.type || "image/jpeg";
  const prompt =
    'You are validating whether an uploaded image is a real Vietnamese land-use-right certificate or house ownership certificate ("so do", "so hong", red book, pink book). Return only compact JSON with keys isRedBook (boolean) and reason (string). Mark isRedBook=false for unrelated property photos, selfies, screenshots, blank images, maps, or other paperwork. If unsure, return false.';

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: Buffer.from(bytes).toString("base64"),
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  };

  const url = modelUrl.includes("?") ? `${modelUrl}&key=${apiKey}` : `${modelUrl}?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Gemini validation failed");
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();

  if (!text) {
    throw new Error("Gemini returned an empty validation result");
  }

  const parsed = JSON.parse(stripCodeFences(text)) as GeminiValidationResult;

  return {
    isRedBook: Boolean(parsed.isRedBook),
    reason: parsed.reason?.trim() || "Anh nay khong giong giay to so do hop le",
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "Khong tim thay anh can kiem tra" },
        { status: 400 },
      );
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const result = await validateSingleFileWithGemini(file);
        return {
          fileName: file.name,
          ...result,
        };
      }),
    );

    const invalidFiles = results
      .filter((result) => !result.isRedBook)
      .map(({ fileName, reason }) => ({ fileName, reason }));

    return NextResponse.json({
      success: true,
      data: {
        valid: invalidFiles.length === 0,
        invalidFiles,
      },
    });
  } catch (error) {
    console.error("Red book validation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Khong the kiem tra anh so do luc nay",
      },
      { status: 500 },
    );
  }
}
