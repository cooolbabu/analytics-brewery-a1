"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { sayHello } from "@/utils/actions";

function Chat() {
  const { mutate, isPending, data } = useMutation({
    mutationFn: (query) => sayHello(query),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = "Hello World";
    console.log("[Chat.jsx]: Before mutate. Value of query \n", query);
    mutate(query);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl pt-12">
      <div className="join w-full">
        <input
          type="text"
          placeholder="Message GeniusGPT"
          className="input input-bordered join-item w-full"
        />
        <button className="btn btn-primary join-item" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default Chat;
