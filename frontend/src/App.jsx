import React from "react";
// import { Button, ButtonGroup } from "@chakra-ui/react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import "./App.css";
import ChatProvider from "./Context/ChatProvider.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/chats" element={<Chatpage />} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
