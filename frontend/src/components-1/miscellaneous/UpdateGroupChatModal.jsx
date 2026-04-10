import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "../../components/ui/dialog.jsx";
import {
  IconButton,
  Button,
  Text,
  Box,
  Input,
  Field,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { LuView } from "react-icons/lu";
import UserBadgeItem from "../Useravatar/UserBadgeItem.jsx";
import UserListItem from "../Useravatar/UserListItem.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { ChatState } from "../../Context/ChatProvider.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import React from "react";
import { useState } from "react";

function UpdateGroupChatModal({ fetchagain, setfetchagain, fetchMessages }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setrenameLoading] = useState(false);

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User already in the group",
        type: "error",
        duration: 5000,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone",
        type: "error",
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "https://whispr-backend-rr1w.onrender.com/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setfetchagain(!fetchagain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove someone",
        type: "error",
        duration: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "https://whispr-backend-rr1w.onrender.com/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessages();
      setfetchagain(!fetchagain);
      setrenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setrenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "https://whispr-backend-rr1w.onrender.com/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setfetchagain(!fetchagain);
      setrenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
      });
      setrenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://whispr-backend-rr1w.onrender.com/api/user?search=${search}`,
        config
      );
      //   console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured",
        description: "Failed to load search results",
        type: "warning",
        duration: 5000,
      });
    }
  };
  return (
    <DialogRoot size="lg">
      <DialogTrigger asChild>
        <Button size="xs">
          <FontAwesomeIcon icon={faEye} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader
          fontFamily="cursive"
          display="flex"
          justifyContent="center"
        >
          <DialogTitle fontSize="2rem">{selectedChat.chatName}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handlefunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <form onSubmit={(e) => e.preventDefault()}>
            <VStack gap="4">
              <Field.Root
                orientation="horizontal"
                id="namefield"
                display="flex"
              >
                {/* <Field.Label>Name</Field.Label> */}
                {/* <Text fontsize="md" fontweight="bold">
                        Name
                      </Text> */}
                <Input
                  id="login-name"
                  placeholder="Chat Name"
                  mb={1}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  bg="blue"
                  color="white"
                  ml={1}
                  onClick={handleRename}
                  loading={renameLoading}
                >
                  Update
                </Button>
              </Field.Root>

              {/* <Button
                    variant="solid"
                    bg="lightblue"
                    color="white"
                    ml={1}
                        
                    onClick={handleRename}
                    loading={renameLoading}
                  >
                    Update
                  </Button> */}
              <Field.Root
                orientation="horizontal"
                id="searchfield"
                display="flex"
              >
                {/* <Field.Label>Name</Field.Label> */}
                {/* <Text fontsize="md" fontweight="bold">
                        Name
                      </Text> */}
                <Input
                  id="search-name"
                  placeholder="Add Users to Group"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Field.Root>
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handlefunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </VStack>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="solid"
              bg="red"
              color="white"
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button variant="solid" bg="red" color="white">
              Close
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default UpdateGroupChatModal;
