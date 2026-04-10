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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Button, Image, Text, Box } from "@chakra-ui/react";
import { LuVoicemail } from "react-icons/lu";
function Profilemodal({ user, children }) {
  //   const { isOpen, onOpen, onclose } = useDisclosure();

  return (
    <DialogRoot size="lg">
      {children ? (
        <DialogTrigger asChild>
          <span>{children}</span>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          {/* <FontAwesomeIcon display={{ base: "flex" }} size="sm" icon={faEye} /> */}
          {/* <IconButton size="xs" variant="ghost" colorPalette="black">
            <LuVoicemail />
          </IconButton> */}
          <Button size="xs">
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader
          fontSize="40px"
          fontFamily="cursive"
          display="flex"
          justifyContent="center"
        >
          <DialogTitle fontSize="3rem">{user.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              marginBottom="20px"
            />
          </Box>
          {/* {console.log(user)} */}

          <Text
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="cursive"
            textAlign="center"
          >
            Email: {user.email}
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default Profilemodal;
