"use client";

import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCustomerInformation } from "@/utils/actions";
import CustomerInfoComponent from "@/app/displayComponents/CustomerInfo";
import CountdownComponent from "@/app/displayComponents/CountdownComp";

function Chat() {
  const [text, setText] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [startCountdown, setStartCountdown] = useState(false);

  const { mutate, isPending, data } = useMutation({
    mutationFn: () => getCustomerInformation(),
    onSuccess: (data) => {
      if (!data) {
        toast.error("Error fetching data");
        return;
      }

      setCustomersData(data);
      console.log("[Chat.jsx]: Inside onSuccess. Value of data: \n", customersData);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStartCountdown(true);

    console.log("[Chat.jsx]: Before mutate. Value of text \n", text);
    mutate(text);
    console.log("[Chat.jsx]: After mutate. Value of data: \n", customersData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
        <div className="join w-full items-center space-x-2">
          <input
            type="text"
            placeholder="Message GeniusGPT"
            className="input input-bordered join-item w-full"
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-primary join-item" type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
      <div>
        <h1>Customer Information</h1>

        <CustomerInfoComponent customers={customersData} />
      </div>
    </div>
  );
}

export default Chat;
