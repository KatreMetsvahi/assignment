type Item = { [key: string]: any };

export default function findIndexOfFinalMatch(items: Item[], key: string, value: any, index: number = 0): number {
  const nextItem = items[index + 1];

  if (nextItem && nextItem[key] === value) {
    return findIndexOfFinalMatch(items, key, value, index + 1);
  }

  return index;
}