type RedBookValidationResponse = {
  success: boolean;
  data?: {
    valid: boolean;
    invalidFiles: Array<{
      fileName: string;
      reason: string;
    }>;
  };
  message?: string;
};

export async function validateRedBookImagesWithGemini(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("/api/red-book-validation", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as RedBookValidationResponse;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Khong the kiem tra anh so do luc nay");
  }

  return payload.data;
}
