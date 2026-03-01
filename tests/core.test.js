const { isBeforeEndDate, buildMessage } = require('../src/core');

describe('isBeforeEndDate', () => {
  it('returns true when current date is before END_DATE', () => {
    expect(isBeforeEndDate('2026-03-20', '2026-03-14')).toBe(true);
  });

  it('returns true when current date equals END_DATE', () => {
    expect(isBeforeEndDate('2026-03-20', '2026-03-20')).toBe(true);
  });

  it('returns false when current date is after END_DATE', () => {
    expect(isBeforeEndDate('2026-03-20', '2026-03-21')).toBe(false);
  });
});

describe('buildMessage', () => {
  it('replaces [name] placeholder with friend name', () => {
    const result = buildMessage('Hey [name], send the file?', 'Sarah');
    expect(result).toBe('Hey Sarah, send the file?');
  });

  it('returns message unchanged when no placeholder', () => {
    const result = buildMessage('Hey, send the file?', 'Sarah');
    expect(result).toBe('Hey, send the file?');
  });
});
