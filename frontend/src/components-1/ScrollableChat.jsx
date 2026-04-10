import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/Chatlogic.jsx";
import { ChatState } from "../Context/ChatProvider.jsx";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Avatar } from "./../components/ui/avatar.jsx";
import { Tooltip } from "./../components/ui/tooltip.jsx";
function ScrollableChat({ messages }) {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                showArrow
                content={m.sender.name}
                positioning={{ placement: "bottom" }}
              >
                <div style={{ display: "inline-block" }}>
                  <Avatar
                    mr={1}
                    mt="7px"
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </div>
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
