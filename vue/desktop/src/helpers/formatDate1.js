

export function formatDate (date, now, $dayjs) {
  const created = $dayjs(date);
  const sss = now.diff(created);
  const minute = Math.ceil(sss / 1000 / 60);
  const hour = Math.ceil(minute / 60);
  const day = Math.ceil(hour / 24);
  return minute > 59
    ? hour > 23
      ? day > 29
        ? created.format('YYYY-MM-DD')
        : `${day}天前`
      : `${hour}小时前`
    : `${minute}分钟前`;
}