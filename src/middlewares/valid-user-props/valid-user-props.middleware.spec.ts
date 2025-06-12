import { ValidUserPropsMiddleware } from './valid-user-props.middleware';

describe('ValidUserPropsMiddleware', () => {
  it('should be defined', () => {
    expect(new ValidUserPropsMiddleware()).toBeDefined();
  });
});
