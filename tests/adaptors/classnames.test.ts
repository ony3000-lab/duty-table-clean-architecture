import { classNames } from '@/adaptors';

describe('classNames adaptor', () => {
  it('Converts a multi-line class name using a template literal to a single-line class name.', () => {
    expect(
      // prettier-ignore
      classNames(
        `first
        second
        third`,
      ),
    ).toBe('first second third');
  });

  it('Converts a multi-line conditional class name using a template literal to a single-line class name.', () => {
    expect(
      // prettier-ignore
      classNames({
        [`first
        second
        third`]: true,
      }),
    ).toBe('first second third');
  });
});
