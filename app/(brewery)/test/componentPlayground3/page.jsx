"use client";

import CountdownComponent from "@/app/displayComponents/CountdownComp";
import { use } from "marked";
import { useEffect, useState } from "react";

function DisplayTablePage() {
  const [startCountdown, setStartCountdown] = useState(false);
  const [stopCountdown, setStopCountdown] = useState(false);
  const [resetCountdown, setResetCountdown] = useState(false);

  const [userState, setUserState] = useState({
    user: {
      firstName: "John",
      lastName: "Doe",
      age: 30,
    },
  });

  useEffect(
    () => {
      console.log("Updated User State: ", userState);
    },
    [userState] // Only re-run the effect if userState changes
  ); // Only re-run the effect if userState changes

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

  const items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ];

  const handleClick = (id) => {
    console.log("Item clicked with ID:", id);
    if (id === 1) {
      setUserState({
        user: {
          firstName: "Susan",
          lastName: "Walker",
          age: 32,
        },
      });
    } else if (id === 2) {
      setUserState((prevState) => ({
        ...prevState, // Preserve other state if exists
        user: {
          ...prevState.user, // Spread existing user data
          age: 40, // Update age
        },
      }));
    } else if (id === 3) {
      setUserState((prevState) => ({
        user: {
          ...prevState.user, // Spread existing user data
          age: 45, // Update age
        },
      }));
    }
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

      <div>
        {items.map((item) => (
          <button key={item.id} onClick={() => handleClick(item.id)}>
            {item.name}
          </button>
        ))}
      </div>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button className="btn" onClick={() => document.getElementById("my_modal_1").showModal()}>
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button className="btn">Select</button>
            </form>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close2</button>
              <button className="btn">Select2</button>
            </form>
          </div>
          <button className="btn">Do nothing</button>
        </div>
      </dialog>
    </div>
  );
}

export default DisplayTablePage;
