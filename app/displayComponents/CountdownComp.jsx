"use client";

import React, { useState, useEffect } from "react";

const CountdownComponent = ({ duration, start, stop, reset }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Start the countdown
  useEffect(() => {
    if (start) {
      setTimeLeft(duration);
      setIsTimerActive(true);
    }
  }, [start, duration]);

  // Stop the countdown
  useEffect(() => {
    if (stop) {
      setIsTimerActive(false);
    }
  }, [stop]);

  // Reset the countdown
  useEffect(() => {
    if (reset) {
      setTimeLeft(duration);
      setIsTimerActive(false);
    }
  }, [reset, duration]);

  // Countdown logic
  useEffect(() => {
    if (!isTimerActive || timeLeft === 0) {
      setIsTimerActive(false);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerActive, timeLeft]);

  //   return <div>{timeLeft !== null && <p>Loading .. {timeLeft} seconds</p>}</div>;
  return (
    <>
      {/* <div>{timeLeft !== null && <p>Loading .. {timeLeft} seconds</p>}</div> */}
      <span className="countdown">
        <span style={{ "--value": timeLeft }}></span>
      </span>
    </>
  );
};

export default CountdownComponent;
