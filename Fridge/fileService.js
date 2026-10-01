export async function readFromJsonFile(filePath) {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить файл ${filePath} (${response.status})`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`Файл ${filePath} повреждён: внутри не JSON.`);
  }
}
