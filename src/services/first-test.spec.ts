import sum from './first-test';

describe('first test', () => {
  it('should test if jest config is working for the first fake test', () => {
    const sumNumbers = sum(3, 5);

    expect(sumNumbers).toBe(8);
  });
});
