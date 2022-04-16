import sort from './sort';

it('sorts an array of objects', () => {
  const one = { id: 1, name: 'one' };
  const two = { id: 2, name: 'two' };
  const three = { id: 3, name: 'three' };

  expect(sort([three, one, two], 'id')).toEqual([one, two, three]);
});