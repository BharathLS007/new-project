import { Checkout } from './checkout';

describe('Checkout component', () => {
  it('should be instantiable', () => {
    const c = new Checkout();
    expect(c).toBeTruthy();
  });
});
