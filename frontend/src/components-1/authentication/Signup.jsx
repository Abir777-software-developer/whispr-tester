import React from "react";
import { VStack, Field, Input, Button, Box, Text } from "@chakra-ui/react";
import { InputGroup } from "../../components/ui/Input-group.jsx";
import { useState } from "react";
//import { colorPalettes } from "compositions/lib/color-palettes";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setname] = useState("");
  const [show, setshow] = useState(false);
  const [email, setemail] = useState("");
  const [confirmpassword, setconfirm] = useState("");
  const [password, setpass] = useState("");
  const [pic, setpic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => setshow(!show);
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toaster.create({
        description: "Please select an image",
        type: "info",
        duration: 5000,
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "WHisp-r");
      data.append("cloud_name", "Whisprcloud");
      fetch("https://api.cloudinary.com/v1_1/Whisprcloud/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setpic(data.secure_url);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toaster.create({
        description: "Please select an image",
        type: "info",
        duration: 5000,
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        description: "Please fill all the fields",
        type: "info",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toaster.create({
        description: "Password doesnot match",
        type: "info",
        duration: 5000,
      });
      return;
    }
    // console.log(name, email, password, pic);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://whispr-backend-rr1w.onrender.com/api/user",
        { name, email, password, pic },
        config
      );

      // console.log(data);

      toaster.create({
        description: "Registration successful",
        type: "info",
        duration: 5000,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));

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
      setLoading(false);
    }
  };
  return (
    <form>
      <VStack gap="4">
        <Field.Root orientation="horizontal" id="namefield">
          <Field.Label htmlFor="signup-name">Name</Field.Label>
          {/* <Text fontsize="md" fontweight="bold">
            Name
          </Text> */}
          <Input
            id="signup-name"
            // id="namefield"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </Field.Root>
        <Field.Root orientation="horizontal" id="emailfield">
          <Field.Label htmlFor="emaill">Email</Field.Label>
          {/* <Text fontsize="md" fontweight="bold">
            Name
          </Text> */}
          <Input
            id="emaill"
            // id="emailfield"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </Field.Root>
        <Field.Root orientation="horizontal" id="passwordfield">
          <Field.Label htmlFor="signup-password">Password</Field.Label>
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
              id="signup-password"
              // id="passwordfield"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setpass(e.target.value)}
            />
          </InputGroup>
        </Field.Root>
        <Field.Root orientation="horizontal" id="confirmpasswordfield">
          <Field.Label htmlFor="cpassword">Confirm Password</Field.Label>
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
              id="cpassword"
              // id="confirmpasswordfield"
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmpassword}
              onChange={(e) => setconfirm(e.target.value)}
            />
          </InputGroup>
        </Field.Root>
        <Field.Root orientation="horizontal" id="picfield">
          <Field.Label htmlFor="pict">Upload your Picture</Field.Label>
          {/* <Text fontsize="md" fontweight="bold">
            Name
          </Text> */}
          <Input
            id="pict"
            // id="picfield"
            colorPalette="blue"
            type="file"
            p={1.5}
            accept="image/"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </Field.Root>

        <Button
          colorPalette="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          // isLoading={loading}
          loading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
}

export default Signup;
