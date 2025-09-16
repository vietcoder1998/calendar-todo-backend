type LinkedItem = { id: string; [key: string]: unknown };
let linkedItems: LinkedItem[] = [];

export const getLinkedItems = () => linkedItems;
export const createLinkedItem = (item: LinkedItem) => {
  linkedItems.push(item);
  return item;
};
export const updateLinkedItem = (id: string, updates: Partial<LinkedItem>) => {
  const idx = linkedItems.findIndex((i) => i.id === id);
  if (idx !== -1) {
    linkedItems[idx] = { ...linkedItems[idx], ...updates };
    return linkedItems[idx];
  }
  return null;
};
export const deleteLinkedItem = (id: string) => {
  const prevLen = linkedItems.length;
  linkedItems = linkedItems.filter((i) => i.id !== id);
  return linkedItems.length < prevLen;
};
