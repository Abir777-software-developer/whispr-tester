import React from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogBackdrop,
} from "../../components/ui/dialog.jsx";
import { Button, Text, Spinner, Box } from "@chakra-ui/react";

const CatchMeUpModal = ({ isOpen, onClose, summary, loading }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size="md">
      <DialogBackdrop />
      <DialogContent bg="#141624" color="white" borderRadius="xl">
        <DialogHeader>
          <DialogTitle fontSize="2xl" fontWeight="bold">
            ✨ While You Were Away
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {loading ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={10}>
              <Spinner size="xl" color="#6c63ff" thickness="4px" mb={4} />
              <Text color="gray.400">Whispr is reading the updates...</Text>
            </Box>
          ) : (
            <Box p={2}>
              <Text fontSize="md" lineHeight="tall" color="gray.200">
                {summary || "No summary available."}
              </Text>
            </Box>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="ghost" colorPalette="gray" onClick={onClose}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button 
            bg="#6c63ff" 
            color="white" 
            _hover={{ bg: "#5a52e0" }}
            onClick={onClose}
          >
            Got it ✓
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CatchMeUpModal;
