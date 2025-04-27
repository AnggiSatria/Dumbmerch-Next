"use client";

import Navbar from "@/components/manual/Navbar";
import { useReadCheckAuth } from "@/hooks";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

let socket;

export default function Page() {
  let title = "Complain Admin";
  document.title = "Dumbmerch | " + title;

  const pathname = usePathname();
  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // useEffect(() => {
  //   socket = io("http://localhost:5000/", {
  //     auth: {
  //       token: localStorage.getItem("token"),
  //     },
  //   });

  //   socket.on("new message", () => {
  //     socket.emit("load messages", contact?.id);
  //   });

  //   loadContact();
  //   loadMessages();

  //   socket.on("connect_error", (err) => {
  //     console.error(err.message);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [messages]);

  useEffect(() => {
  if (!contact?.id) return;

  socket = io("http://localhost:5000/", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  socket.on("new message", () => {
    socket.emit("load messages", contact.id);
  });

  loadContact();
  loadMessages();

  socket.on("connect_error", (err) => {
    console.error(err.message);
  });

  return () => {
    socket.disconnect();
  };
}, [contact?.id]);

  const loadContact = () => {
    socket.emit("load customer contact");

    socket.on("customer contact", (data) => {
      let dataContacts = data.map((item) => ({
        ...item,
        message: "Click here to start message",
      }));
      setContacts(dataContacts);
    });
  };

  const onClickContact = (data) => {
    setContact(data);
    socket.emit("load messages", data.id);
  };

  const loadMessages = () => {
    socket.on("messages", (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        setMessages(dataMessages);
      } else {
        setMessages([]);
      }
    });
  };

  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };

      socket.emit("send message", data);
      e.target.value = "";
    }
  };

  // Scroll otomatis ke pesan terakhir
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="w-full min-h-screen flex flex-col items-center py-5 gap-5">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />
      <div className="flex w-full max-w-[84%] xl:max-w-[1080px] mx-auto gap-3">
        <div className="flex w-3/12 h-[600px] border-r border-r-white pr-3 gap-3 flex-col">
          {contacts?.length > 0 && (
            <>
              {contacts?.map((res, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onClickContact(res);
                    }}
                    className={`flex w-full rounded-md h-[100px] cursor-pointer gap-3 items-center px-3 hover:bg-[#212121] ${
                      contact?.id === res?.id ? `bg-[#3d3d3d]` : ``
                    }`}
                  >
                    <div className="flex w-[30%] h-3/4 rounded-md cursor-pointer">
                      <Image
                        className="!h-full rounded-md shadow cursor-pointer"
                        layout="responsive"
                        alt="detail-product.png"
                        src={res?.profile?.image || "/Frame.png"}
                        width={75}
                        height={75}
                      />
                    </div>

                    <div className="flex h-3/4 flex-grow flex-col gap-3 cursor-pointer">
                      <label
                        htmlFor=""
                        className="w-full h-1/2 flex items-center text-sm font-semibold text-[#F74D4D] cursor-pointer"
                      >
                        {res?.name}
                      </label>
                      <label
                        htmlFor=""
                        className="w-full h-1/2 flex items-center text-xs font-semibold text-[#ababab] cursor-pointer"
                      >
                        Click here to start messages
                      </label>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="flex w-9/12 h-[600px] flex-col">
          {contact ? (
            <div className="flex flex-col w-full h-full overflow-y-auto bg-gray-800 p-3">
              <div className="flex flex-col flex-grow">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex my-2 ${
                      msg.idSender === checkUsers?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.idSender !== checkUsers?.id && (
                      <div className="flex items-end mr-2">
                        <Image
                          className="rounded-full"
                          src={contact?.profile?.image || "/Frame.png"}
                          alt="avatar"
                          width={30}
                          height={30}
                        />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-2 max-w-xs ${
                        msg.idSender === checkUsers?.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {msg.message}
                    </div>
                    {msg.idSender === checkUsers?.id && (
                      <div className="flex items-end ml-2">
                        <Image
                          className="rounded-full"
                          src={checkUsers?.profile?.image || "/Frame.png"}
                          alt="avatar"
                          width={30}
                          height={30}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  onKeyPress={onSendMessage}
                  placeholder="Type your message..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center text-white font-semibold text-xl">
              No Messages
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
