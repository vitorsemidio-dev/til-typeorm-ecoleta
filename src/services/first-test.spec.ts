function sum(a: number, b: number): number {
  return a + b;
}

describe('first test', () => {
  it('should test if jest config is working for the first fake test', () => {
    const sumNumbers = sum(3, 5);

    expect(sumNumbers).toBe(8);
  });
});
