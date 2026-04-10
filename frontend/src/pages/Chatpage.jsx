import { ChatState } from "../Context/ChatProvider.jsx";
import { Box } from "@chakra-ui/react";
import React from "react";
import SideDrawer from "../components-1/miscellaneous/SideDrawer.jsx";
import Mychats from "../components-1/Mychats.jsx";
import ChatBox from "../components-1/ChatBox.jsx";
import { useState } from "react";
function Chatpage() {
  const { user } = ChatState();
  // const navigate = useNavigate();
  const [fetchagain, setfetchagain] = useState(false);
  // useEffect(() => {
  //   if (!user) navigate("/");
  // }, [user, navigate]);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {/* {console.log("user from chats", user)} */}
        {user && <Mychats fetchagain={fetchagain} />}
        {user && (
          <ChatBox fetchagain={fetchagain} setfetchagain={setfetchagain} />
        )}
      </Box>
    </div>
  );
}

export default Chatpage;
