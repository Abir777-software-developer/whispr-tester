import React from "react";
import { SkeletonText } from "../../components/ui/skeleton.jsx";
import { HStack } from "@chakra-ui/react";
function ChatLoading() {
  return (
    <HStack>
      <SkeletonText noOfLines={3} gap="4" />
    </HStack>
  );
}

export default ChatLoading;
