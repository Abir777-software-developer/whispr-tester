import { Container, Box, Text, Tabs } from "@chakra-ui/react";
// import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import Login from "../components-1/authentication/Login";
import Signup from "../components-1/authentication/Signup";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Ubuntu" color="black">
          WHisp-r
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="2px">
        <Tabs.Root variant="enclosed" maxW="m" fitted defaultValue={"tab-1"}>
          <Tabs.List mb="1em">
            <Tabs.Trigger value="tab-1" width="50%">
              LOGIN
            </Tabs.Trigger>
            <Tabs.Trigger value="tab-2" widows="50%">
              SIGN UP
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="tab-2">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
}

export default Homepage;
