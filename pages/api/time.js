export function getTime() {
  const date = new Date();

  let offset = date.getTimezoneOffset();
  let hours = offset / 60;
  date.setHours(date.getHours() + hours + 8);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
  );
}
