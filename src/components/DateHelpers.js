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

function myDateDisp(dateInt, includeDay = false) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(dateInt);
  const year = date.getFullYear();
  const day =
    date.getDate() < 10 ? "0" + String(date.getDate()) : String(date.getDate());
  const month = monthNames[date.getMonth()].substring(0, 3);
  return includeDay ? day + "-" + month + "-" + year : month + "-" + year;
}

export { myDate, myTime, myDateDisp };
