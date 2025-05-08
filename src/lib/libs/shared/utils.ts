export function foo(bar: unknown) {
  return bar;
}

export function getElapsedTime(startTime: Date) {
  // Record end time
  const endTime = new Date();

  // Compute time difference in milliseconds
  let timeDiff = endTime.getTime() - startTime.getTime();

  // Convert time difference from milliseconds to seconds
  timeDiff /= 1000;

  // Extract integer seconds that dont form a minute using %
  const seconds = Math.floor(timeDiff % 60);

  // Pad seconds with a zero if neccessary
  const secondsAsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

  // Convert time difference from seconds to minutes using %
  timeDiff = Math.floor(timeDiff / 60);

  // Extract integer minutes that don't form an hour using %
  const minutes = timeDiff % 60;

  // Pad minutes with a zero if neccessary
  const minutesAsString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  // Convert time difference from minutes to hours
  timeDiff = Math.floor(timeDiff / 60);

  // Extract integer hours that don't form a day using %
  const hours = timeDiff % 24;

  // Convert time difference from hours to days
  timeDiff = Math.floor(timeDiff / 24);

  // The rest of timeDiff is number of days
  const days = timeDiff;

  const totalHours = hours + days * 24; // add days to hours
  const totalHoursAsString =
    totalHours < 10 ? `0${totalHours}` : `${totalHours}`;

  if (totalHoursAsString === '00') {
    return `${minutesAsString}:${secondsAsString}`;
  }

  return `${totalHoursAsString}:${minutesAsString}:${secondsAsString}`;
}
