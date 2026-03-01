function isBeforeEndDate(endDateStr, todayStr) {
  const end = new Date(endDateStr);
  const today = new Date(todayStr || new Date().toISOString().split('T')[0]);
  return today <= end;
}

function buildMessage(template, friendName) {
  return template.replace('[name]', friendName);
}

function isPdfFromFriend(message, friendPhone) {
  const normalizedPhone = friendPhone.replace('+', '') + '@c.us';
  return (
    message.from === normalizedPhone &&
    message.hasMedia === true &&
    message._data?.mimetype === 'application/pdf'
  );
}

module.exports = { isBeforeEndDate, buildMessage, isPdfFromFriend };
