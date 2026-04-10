import React from "react";
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
import { Text, Button, VStack, Field, Input, Box } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import { ChatState } from "../../Context/ChatProvider.jsx";
import axios from "axios";
import UserListItem from "../Useravatar/UserListItem.jsx";
import UserBadgeItem from "../Useravatar/UserBadgeItem.jsx";

function GroupChatModal({ children }) {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, Chats, setChats } = ChatState();

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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "https://whispr-backend-rr1w.onrender.com/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...Chats]);
      toaster.create({
        title: "New Group is created",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to Create the chat",
        description: error.response.data,
        type: "warning",
        duration: 5000,
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (deleteduser) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== deleteduser._id)
    );
  };

  return (
    <DialogRoot size="lg">
      <DialogTrigger asChild>
        <span>{children}</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle
            fontSize="35px"
            fontFamily="cursive"
            display="flex"
            justifyContent="center"
          >
            Create Group Chats
          </DialogTitle>
        </DialogHeader>
        <DialogBody display="flex" flexDir="column" alignItems="center">
          <form onSubmit={(e) => e.preventDefault()}>
            <VStack gap="4">
              <Field.Root orientation="horizontal" id="chatnamefield">
                <Field.Label>Chat-Name</Field.Label>
                {/* <Text fontsize="md" fontweight="bold">
                       Name
                     </Text> */}
                <Input
                  id="chat-name"
                  placeholder="Enter the chat name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  border="solid"
                />
              </Field.Root>
              <Field.Root orientation="horizontal" id="searchfield">
                <Field.Label>Search Users</Field.Label>
                {/* <Text fontsize="md" fontweight="bold">
                       Name
                     </Text> */}
                <Input
                  id="search-name"
                  placeholder="Add Users"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                  border="solid"
                />
              </Field.Root>
              {/* selected users */}
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handlefunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                <div>loading</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handlefunction={() => handleGroup(user)}
                    />
                  ))
              )}
              {/* render search users */}
            </VStack>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              border="solid"
              color="blue"
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default GroupChatModal;
