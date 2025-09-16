type History = { id: string; [key: string]: unknown };
let histories: History[] = [];

export const getHistories = () => histories;
export const createHistory = (history: History) => {
  histories.push(history);
  return history;
};
export const updateHistory = (id: string, updates: Partial<History>) => {
  const idx = histories.findIndex((h) => h.id === id);
  if (idx !== -1) {
    histories[idx] = { ...histories[idx], ...updates };
    return histories[idx];
  }
  return null;
};
export const deleteHistory = (id: string) => {
  const prevLen = histories.length;
  histories = histories.filter((h) => h.id !== id);
  return histories.length < prevLen;
};
