type FileItem = { id: string; [key: string]: unknown };
let files: FileItem[] = [];

export const getFiles = () => files;
export const createFile = (file: FileItem) => {
  files.push(file);
  return file;
};
export const updateFile = (id: string, updates: Partial<FileItem>) => {
  const idx = files.findIndex((f) => f.id === id);
  if (idx !== -1) {
    files[idx] = { ...files[idx], ...updates };
    return files[idx];
  }
  return null;
};
export const deleteFile = (id: string) => {
  const prevLen = files.length;
  files = files.filter((f) => f.id !== id);
  return files.length < prevLen;
};
