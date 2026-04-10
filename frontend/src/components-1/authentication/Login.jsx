import React from "react";
import { VStack, Field, Input, Button, Box, Text } from "@chakra-ui/react";
import { InputGroup } from "../../components/ui/Input-group.jsx";
import { useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const [name, setname] = useState("");
  const [show, setshow] = useState(false);
  const [password, setpass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => setshow(!show);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !password) {
      toaster.create({
        description: "Please fill all the fields",
        type: "info",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://whispr-backend-rr1w.onrender.com/api/user/login",
        { name, password },
        config
      );
      toaster.create({
        description: "Login successful",
        type: "info",
        duration: 5000,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));

      console.log("User Info Set:", localStorage.getItem("userInfo"));

      setLoading(false);
      // history.push('/chats')
      // navigate("/chats");
      navigate("/chats");
    } catch (error) {
      toaster.create({
        title: "Error occured",
        description: error.response?.status === 429 
          ? error.response.data.message 
          : (error.response?.data?.message || "something went wrong"),
        type: "error",
        duration: 5000,
      });
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <form>
      <VStack gap="4">
        <Field.Root orientation="horizontal" id="loginnamefield">
          <Field.Label htmlFor="login-name">Name</Field.Label>
          {/* <Text fontsize="md" fontweight="bold">
              Name
            </Text> */}
          <Input
            id="login-name"
            // id="namefield"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </Field.Root>

        <Field.Root orientation="horizontal" id="loginpasswordfield">
          <Field.Label htmlFor="login-password">Password</Field.Label>
          {/* <Text fontsize="md" fontweight="bold">
              Name
            </Text> */}
          <InputGroup
            flex="1"
            endElement={
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleClick}
                colorPalette="blue"
              >
                {show ? "Hide" : "Show"}
              </Button>
            }
          >
            <Input
              id="login-password"
              // id="passwordfield"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setpass(e.target.value)}
            />
          </InputGroup>
        </Field.Root>

        <Button
          colorPalette="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          loading={loading}
        >
          Sign Up
        </Button>

        <Button
          variant="solid"
          colorPalette="red"
          width="100%"
          onClick={() => {
            setname("Abir Dey");
            setpass("123456");
          }}
        >
          Get User Credentials
        </Button>
      </VStack>
    </form>
  );
}

export default Login;
