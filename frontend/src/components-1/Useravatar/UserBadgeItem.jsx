import { Box } from "@chakra-ui/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function UserBadgeItem({ user, handlefunction }) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handlefunction}
    >
      {user.name}

      <FontAwesomeIcon icon={faXmark} style={{ paddingLeft: "1px" }} />
    </Box>
  );
}

export default UserBadgeItem;
