import { ChatState } from "../Context/ChatProvider.jsx";
import React from "react";
import { toaster } from ".././components/ui/toaster.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ChatLoading from "./miscellaneous/ChatLoading.jsx";
import { getSender } from "../config/Chatlogic.jsx";
import GroupChatModal from "./miscellaneous/GroupChatModal.jsx";
function Mychats({ fetchagain }) {
  const { user, selectedChat, setSelectedChat, Chats, setChats } = ChatState();
  const [loggeduser, setloggeduser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "https://whispr-backend-rr1w.onrender.com/api/chat",
        config
      );
      // console.log(data);

      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error occured",
        description: "failed to load the chats",
        type: "warning",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    const storeduser = localStorage.getItem("userInfo");
    if (storeduser) {
      setloggeduser(JSON.parse(storeduser));
    }
    fetchChats();
  }, [fetchagain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="lightblue"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            // rightIcon={<AddIcon />}
          >
            <FontAwesomeIcon icon={faPlus} />
            New Group Chats
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="lightblue"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {Chats ? (
          <Stack overflowY="scroll">
            {Chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? loggeduser && getSender(loggeduser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default Mychats;
