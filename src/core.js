function isBeforeEndDate(endDateStr, todayStr) {
  const end = new Date(endDateStr);
  const today = new Date(todayStr || new Date().toISOString().split('T')[0]);
  return today <= end;
}

function buildMessage(template, friendName) {
  return template.replace('[name]', friendName);
}

module.exports = { isBeforeEndDate, buildMessage };
