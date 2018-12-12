import { assert } from './assert';

describe('assert', () => {
  it('should do nothing when the condition is met', () => {
    try {
      assert(true, 'nothing done');
      expect(true).toBe(true);
    } catch (error) {
      expect(true).toBe(false);
    }
  });

  it('should throw with the passed in message when the condition is not met', () => {
    const message = 'Condition not met';

    try {
      assert(false, message);
    } catch (error) {
      expect(error.message).toBe(message);
    }
  });
});
