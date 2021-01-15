function myDate(dateInt, includeDay = false) {
  const date = new Date(dateInt);
  const year = date.getFullYear();
  const day =
    date.getDate() < 10 ? "0" + String(date.getDate()) : String(date.getDate());
  const month =
    date.getMonth() < 9
      ? "0" + String(date.getMonth() + 1)
      : String(date.getMonth() + 1);
  return includeDay ? year + "-" + month + "-" + day : year + "-" + month;
}

function myTime(dateString) {
  const date = new Date(dateString);
  return date.getTime() + date.getTimezoneOffset() * 60 * 1000;
}

export { myDate, myTime };
