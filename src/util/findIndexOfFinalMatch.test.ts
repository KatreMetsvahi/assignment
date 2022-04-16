import findIndexOfFinalMatch from "./findIndexOfFinalMatch";

it('finds the last continuous value in an unbroken chain', () => {
  const items = [
    { id: 1, active: true },
    { id: 2, active: true },
    { id: 3, active: true },
    { id: 4, active: false },
    { id: 5, active: true }
  ]

  expect(findIndexOfFinalMatch(items, 'active', true)).toEqual(2);
});

it('returns the starting index when no matched were found', () => {
  const items = [
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: false },
    { id: 4, active: false },
    { id: 5, active: false }
  ]

  expect(findIndexOfFinalMatch(items, 'active', true)).toEqual(0);
});