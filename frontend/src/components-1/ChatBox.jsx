import React from "react";
import { ChatState } from "../Context/ChatProvider.jsx";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat.jsx";
function ChatBox({ fetchagain, setfetchagain }) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="lightblue"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchagain={fetchagain} setfetchagain={setfetchagain} />
    </Box>
  );
}

export default ChatBox;
