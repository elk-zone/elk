const TRANSPARENT_1X1_PNG =
  "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export const getMockImage = async (): Promise<Blob> => {
  const response = await fetch(TRANSPARENT_1X1_PNG);
  return await response.blob();
};
