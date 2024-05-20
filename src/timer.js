

export const createTimer = (callbackPerSecond, timerDuration, callbackOnEnd) => {
  let secondsRemaining = timerDuration;
  const intervalId = setInterval(() => {
    callbackPerSecond(secondsRemaining); 
    secondsRemaining--;

    if (secondsRemaining === -1) {
      clearInterval(intervalId); 
      callbackOnEnd(); 
    }
  }, 1000); 
}