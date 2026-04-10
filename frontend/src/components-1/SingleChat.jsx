import { Text, Box, Button, Field, Input, VStack } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider.jsx";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getSender, getSenderFull } from "../config/Chatlogic.jsx";
import Profilemodal from "./miscellaneous/Profilemodal.jsx";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.jsx";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from ".././components/ui/toaster.jsx";
import "./Styles.css";
import ScrollableChat from "./ScrollableChat.jsx";
import Lottie from "react-lottie";
import animationData from "../animations/ani.json";
import CatchMeUpModal from "./miscellaneous/CatchMeUpModal.jsx";
import { LuSparkles } from "react-icons/lu";

const ENDPOINT = "http://localhost:5000";
// const ENDPOINT = "https://whispr-backend-rr1w.onrender.com";
function SingleChat({ fetchagain, setfetchagain }) {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setnotification,
    socket,
    socketConnected,
  } = ChatState() || {};
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState("");
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);

  // Catch Me Up States
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [missedCount, setMissedCount] = useState(0);
  const [lastSeenTime, setLastSeenTime] = useState(null);

  const selectedChatCompareRef = useRef();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setmessages([]); // 1. Clear old messages immediately to avoid state leakage
      setloading(true);

      const { data } = await axios.get(
        `${ENDPOINT}/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages);

      setmessages(data);
      setloading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toaster.create({
        title: "Error occured",
        description: "failed to load the chats",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket]);

  useEffect(() => {
    // 1. Before switching to a new chat, save the lastSeen time for the CURRENT chat
    if (selectedChatCompareRef.current) {
      localStorage.setItem(
        `whispr_lastSeen_${selectedChatCompareRef.current._id}_${user._id}`,
        new Date().toISOString()
      );
    }

    // 2. Load lastSeen time for the NEW chat and fetch messages
    const storedLastSeen = localStorage.getItem(
      `whispr_lastSeen_${selectedChat?._id}_${user._id}`
    );
    setLastSeenTime(storedLastSeen);
    setMissedCount(0); // Reset count

    fetchMessages();
    selectedChatCompareRef.current = selectedChat;

    return () => {
      if (selectedChatCompareRef.current) {
        localStorage.setItem(
          `whispr_lastSeen_${selectedChatCompareRef.current._id}_${user._id}`,
          new Date().toISOString()
        );
      }
    };
  }, [selectedChat, user._id]);


  // Handle missed message count calculation
  useEffect(() => {
    // 2. Only calculate if there are messages AND they belong to the current selectedChat
    if (messages.length > 0 && lastSeenTime && selectedChat) {
      const messagesBelongToChat = messages.every(m => m.Chat?._id === selectedChat._id || m.Chat === selectedChat._id);
      
      if (messagesBelongToChat) {
        const lastSeenDate = new Date(lastSeenTime);
        const missed = messages.filter(
          (m) => new Date(m.createdAt) > lastSeenDate && m.sender._id !== user._id
        );
        setMissedCount(missed.length);
      } else {
        setMissedCount(0); // If messages don't match, don't show the banner
      }
    } else {
      setMissedCount(0);
    }
  }, [messages, lastSeenTime, user._id, selectedChat]);

  const handleSummarize = async () => {
    if (!lastSeenTime || !selectedChat) return;

    try {
      setIsSummaryOpen(true);
      setSummaryLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${ENDPOINT}/api/message/summarize`,
        {
          chatId: selectedChat._id,
          since: lastSeenTime,
        },
        config
      );

      setSummary(data.summary);
      setSummaryLoading(false);

      // Update lastSeen so the banner disappears after summarizing
      const now = new Date().toISOString();
      localStorage.setItem(`whispr_lastSeen_${selectedChat._id}_${user._id}`, now);
      setMissedCount(0);
    } catch (error) {
      let errorMessage = "Summarizer model is waking up, try few times later";
      
      // If it's a rate limit error (429), use the backend's specific message
      if (error.response?.status === 429) {
        errorMessage = error.response.data.message;
      }

      toaster.create({
        title: "AI Summarization Status",
        description: errorMessage,
        type: "error",
      });
      setIsSummaryOpen(false);
      setSummaryLoading(false);
    }

  };

  // console.log(notification, "-------");
  // console.log(typeof notification);

  //receiving the message
  useEffect(() => {
    if (!socket) return;
    socket.on("message received", (newmessagereceived) => {
      if (
        !selectedChatCompareRef.current ||
        selectedChatCompareRef.current._id !== newmessagereceived.Chat?._id
      ) {
        // Handle notifications and sidebar refresh if the message is from a different chat
        setnotification((prev) => {
          if (!prev.find((n) => n._id === newmessagereceived._id)) {
            return [newmessagereceived, ...prev];
          }
          return prev;
        });
        setfetchagain((prev) => !prev);
      } else {
        setmessages((prev) => [...prev, newmessagereceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [socket]); // Only run once or when socket changes

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessage) {
      socket.emit("stop typing", selectedChat._id);
      event.preventDefault();
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");

        const { data } = await axios.post(
          `${ENDPOINT}/api/message`,
          {
            content: newmessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);

        socket.emit("new message", data);
        setmessages((prev) => [...prev, data]);
      } catch (error) {
        toaster.create({
          title: "Error occured",
          description: "failed to send the chats",
          type: "error",
          duration: 5000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setnewmessage(e.target.value);

    // Typing handler logic
    if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lasttypingtime = new Date().getTime();
    var timerlength = 3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timediff = timenow - lasttypingtime;

      if (timediff >= timerlength && typing) {
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timerlength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="cursive"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              size="xs"
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Profilemodal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchagain={fetchagain}
                  setfetchagain={setfetchagain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {missedCount > 0 && (
                  <Box
                    bg="rgba(108, 99, 255, 0.1)"
                    border="1px solid rgba(108, 99, 255, 0.3)"
                    borderRadius="lg"
                    p={2}
                    mb={4}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text fontSize="sm" color="#4a44cc" fontWeight="bold">
                      🔔 You missed {missedCount} messages
                    </Text>
                    <Button
                      size="xs"
                      bg="#6c63ff"
                      color="white"
                      _hover={{ bg: "#5a52e0" }}
                      onClick={handleSummarize}
                    >
                      <LuSparkles style={{ marginRight: "4px" }} />
                      Catch me up
                    </Button>
                  </Box>
                )}
                <ScrollableChat messages={messages} />
              </div>
            )}

            <CatchMeUpModal
              isOpen={isSummaryOpen}
              onClose={() => setIsSummaryOpen(false)}
              summary={summary}
              loading={summaryLoading}
            />

            <form onSubmit={(e) => e.preventDefault()}>
              <VStack gap="4">
                <Field.Root orientation="horizontal" id="namefield" mt={3}>
                  {/* <Field.Label>Name</Field.Label> */}
                  {/* <Text fontsize="md" fontweight="bold">
                        Name
                      </Text> */}
                  {istyping ? (
                    <div>
                      <Lottie
                        options={defaultOptions}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Input
                    variant="filled"
                    onKeyDown={sendMessage}
                    id="enter-mess"
                    placeholder="Enter a message"
                    value={newmessage}
                    onChange={typingHandler}
                  />
                  {/* <Button
                    variant="solid"
                    bg="blue"
                    color="white"
                    ml={1}
                    onClick={handleRename}
                    loading={renameLoading}
                  >
                    Update
                  </Button> */}
                </Field.Root>
              </VStack>
            </form>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="cursive">
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
