type Item = { [key: string]: any };

export default function sort<T extends Item>(items: T[], sortProperty: string): T[] {
  return items.sort((a: Item, b: Item) => a[sortProperty] - b[sortProperty]);
}