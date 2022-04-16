import sumWithLimits from "./sumWithLimits";

it('adds increment to base number', () => {
  expect(sumWithLimits(1, 1, 0, 2)).toEqual(2);
});

it('returns base number when the result exceeds max limit', () => {
  expect(sumWithLimits(1, 2, 0, 2)).toEqual(1);
});

it('returns base number when the result falls below min limit', () => {
  expect(sumWithLimits(1, -2, 0, 2)).toEqual(1);
});