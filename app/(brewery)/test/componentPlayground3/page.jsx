"use client";

import CountdownComponent from "@/app/displayComponents/CountdownComp";
import { useState } from "react";

function DisplayTablePage() {
  const [startCountdown, setStartCountdown] = useState(false);
  const [stopCountdown, setStopCountdown] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(false);

  const handleStart = () => {
    setStartCountdown(true);
    setStopCountdown(false);
    setResetCountdown(false);
  };

  const handleStop = () => {
    setStopCountdown(true);
  };

  const handleReset = () => {
    setResetCountdown(true);
    setStartCountdown(false);
    setStopCountdown(false);
  };

  return (
    <div className="border rounded-lg border-red-600 space-y-8">
      <h1 className="text-2xl font-bold text-red-600">Lets display Customer info from Supabase</h1>

      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="space-x-8">
        <button className="btn btn-primary" onClick={handleStart}>
          Start Countdown
        </button>
        <button className="btn btn-primary" onClick={handleStop}>
          Stop Countdown
        </button>
        <button className="btn btn-primary" onClick={handleReset}>
          Reset Countdown
        </button>
        <CountdownComponent duration={60} start={startCountdown} stop={stopCountdown} reset={resetCountdown} />
      </div>
    </div>
  );
}

export default DisplayTablePage;
