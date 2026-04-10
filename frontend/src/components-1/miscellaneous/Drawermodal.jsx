import React, { useState } from "react";
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerActionTrigger,
} from "../../components/ui/drawer.jsx";
import { Box, Button, Input, Spinner } from "@chakra-ui/react";
import { LuVoicemail } from "react-icons/lu";
import { IconButton } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster.jsx";
import ChatLoading from "./ChatLoading.jsx";
import axios from "axios";
import UserListItem from "../Useravatar/UserListItem.jsx";
import { ChatState } from "../../Context/ChatProvider.jsx";

function Drawermodal({ user, children }) {
  const [search, setSearch] = useState("");
  const [loading, setloading] = useState(false);
  const [serachresult, setsearches] = useState([]);
  const [loadingChat, setloadchat] = useState();
  const { setSelectedChat, Chats, setChats } = ChatState();

  const handlesearch = async () => {
    if (!search) {
      toaster.create({
        description: "Please enter something in serach",
        type: "info",
        duration: 5000,
      });
      return;
    }
    try {
      setloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://whispr-backend-rr1w.onrender.com/api/user?search=${search}`,
        config
      );
      setloading(false);
      setsearches(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!!",
        description: error.response?.status === 429 
          ? error.response.data.message 
          : "failed to load the search results",
        type: "warning",
        duration: 5000,
      });
      setloading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setloadchat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "https://whispr-backend-rr1w.onrender.com/api/chat",
        { userId },
        config
      );
      if (!Chats.find((c) => c._id === data._id)) setChats([data, ...Chats]);
      setSelectedChat(data);
      setloadchat(false);
    } catch (error) {
      toaster.create({
        title: "Error fetching the chats",
        description: error.message,
        type: "warning",
        duration: 5000,
      });
    }
  };
  return (
    <div>
      <DrawerRoot key="start" placement="start">
        <DrawerBackdrop />

        {children ? (
          <DrawerTrigger asChild>
            <span>{children}</span>
          </DrawerTrigger>
        ) : (
          <DrawerTrigger asChild>
            <IconButton size="xs" variant="ghost" colorPalette="black">
              <LuVoicemail />
            </IconButton>
          </DrawerTrigger>
        )}
        <DrawerContent bg="lightblue">
          <DrawerHeader>
            <DrawerTitle>Search Users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name "
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handlesearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              serachresult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handlefunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button
                variant="outline"
                // borderBlockColor="black"
                // borderBlockEndColor="black"
                // borderBlockStartColor="black"
                border="solid"
              >
                Cancel
              </Button>
            </DrawerActionTrigger>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </div>
  );
}

export default Drawermodal;
