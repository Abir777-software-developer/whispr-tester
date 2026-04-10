import {
  Box,
  Button,
  HStack,
  Menu,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Text,
} from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip.jsx";
import { Avatar } from "../../components/ui/avatar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider.jsx";
import Profilemodal from "./Profilemodal.jsx";
import { useNavigate } from "react-router-dom";
import Drawermodal from "./Drawermodal.jsx";
import { getSender } from "../../config/Chatlogic.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

const SideDrawer = () => {
  // const [search, setsearch] = useState("");
  const navigate = useNavigate();
  const {
    user,
    selectedChat,
    setSelectedChat,
    Chats,
    setChats,
    notification,
    setnotification,
  } = ChatState();
  useEffect(() => {
    if (notification.length > 0) {
      toaster.create({
        title: "You got new messages!",
        type: "success",
        duration: 5000,
      });
    }
  }, [notification]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="lightblue"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        position="relative"
        height="60px"
      >
        <Tooltip
          showArrow
          content="Search Users to chat"
          positioning={{ placement: "right-end" }}
        >
          <Drawermodal user={user}>
            <Button variant="outline">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <Text display={{ base: "none", md: "flex" }} px="3.5">
                Search User
              </Text>
            </Button>
          </Drawermodal>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="cursive" fontWeight="bold">
          WHisp-r
        </Text>
        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FontAwesomeIcon icon={faBell} fontSize="2xl" />
              </Button>
            </MenuTrigger>
            <MenuContent pl={2}>
              {/* <div>
                {notification.length > 0 && (
                  <div className="notification-badge">
                    <span className="badge">{notification.length}</span>
                  </div>
                )}
              </div> */}

              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.Chat);
                    setnotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.Chat.isGroupChat
                    ? `New Message in ${notif.Chat.chatName}`
                    : `New Message from ${getSender(user, notif.Chat.users)}`}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FontAwesomeIcon icon={faCaretDown} />
              </Button>
            </MenuTrigger>
            <Avatar
              cursor="pointer"
              size="sm"
              name={user.name}
              src={user.pic}
            />
            <MenuContent>
              <Profilemodal user={user}>
                <MenuItem value="new-pro">My Profile</MenuItem>
              </Profilemodal>
              <MenuItem value="new log" onClick={logoutHandler}>
                Log Out
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>
    </div>
  );
};

export default SideDrawer;
