const { isBeforeEndDate, buildMessage, isPdfFromFriend } = require('../src/core');

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

describe('isPdfFromFriend', () => {
  const friendPhone = '+1234567890';

  it('returns true when sender matches and has PDF mimetype', () => {
    const msg = {
      from: '1234567890@c.us',
      hasMedia: true,
      _data: { mimetype: 'application/pdf' }
    };
    expect(isPdfFromFriend(msg, friendPhone)).toBe(true);
  });

  it('returns false when sender does not match', () => {
    const msg = {
      from: '9999999999@c.us',
      hasMedia: true,
      _data: { mimetype: 'application/pdf' }
    };
    expect(isPdfFromFriend(msg, friendPhone)).toBe(false);
  });

  it('returns false when message has no media', () => {
    const msg = {
      from: '1234567890@c.us',
      hasMedia: false,
      _data: {}
    };
    expect(isPdfFromFriend(msg, friendPhone)).toBe(false);
  });

  it('returns false when media is not PDF', () => {
    const msg = {
      from: '1234567890@c.us',
      hasMedia: true,
      _data: { mimetype: 'image/jpeg' }
    };
    expect(isPdfFromFriend(msg, friendPhone)).toBe(false);
  });
});
