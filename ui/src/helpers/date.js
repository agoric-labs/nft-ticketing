function getTime(time) {
  const timeArray = time.split(':');
  const hour = timeArray[0];
  const minute = timeArray[1];
  const amPm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12;
  return `${hour12}:${minute}${amPm}`;
}

export const getDateTime = (dateTime) => {
  console.log('datetime:', dateTime);
  // Thu, Mar 17 at 07:00PM EST
  const dateArray = dateTime.split(' ');
  console.log('datetime:', dateArray);
  const day = dateArray[0];
  const date = ''.concat(dateArray[1], ' ', dateArray[2]);
  const time = getTime(dateArray[4]);
  return `${day}, ${date} At ${time} ${dateArray[5].split('+')[0]}`;
};
console.log(getTime('22:22:00'));
