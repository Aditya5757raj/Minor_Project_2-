import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../utils/SocketProvider.js.js";
import { Video, Users, ArrowRight, Copy } from "lucide-react";
import { v4 as uuid } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import styled, { keyframes } from "styled-components";

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-22px) rotate(3deg); }
  66% { transform: translateY(-10px) rotate(-2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const codeSlide = keyframes`
  0% { transform: translateX(-5%); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateX(5%); opacity: 0; }
`;

const codeMatrix = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
`;

const codeBlink = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
`;

// Styled Container
const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image:
      radial-gradient(circle at 25% 25%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 60%);
    background-size: 300px 300px, 300px 300px, 500px 500px;
    opacity: 0.8;
    z-index: 1;
    animation: ${codeMatrix} 30s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background:
      linear-gradient(to right, transparent, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 20px 100%, 100% 20px;
    animation: ${codeSlide} 25s linear infinite;
    pointer-events: none;
    z-index: 2;
  }

  .code-grid, .code-sparkles {
    pointer-events: none;
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 2;
  }

  .code-sparkles {
    background-image: radial-gradient(circle at center, rgba(99, 102, 241, 0.4) 0%, transparent 1px);
    background-size: 50px 50px;
    animation: ${codeBlink} 5s ease infinite alternate;
  }
`;

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [errors, setErrors] = useState({});
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !room) {
        setErrors({
          username: !email ? "Name required" : "",
          roomId: !room ? "Room ID required" : ""
        });
        return;
      }
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const generateRoomid = () => {
    const newRoomId = uuid();
    setRoom(newRoomId);
    toast.success(`Room ID generated: ${newRoomId}`);
  };

  const copyRoomIdToClipboard = () => {
    if (!room) {
      toast.error("No Room ID to copy!");
      return;
    }
    navigator.clipboard.writeText(room).then(() => {
      toast.success("Room ID copied to clipboard!");
    });
  };

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}/${email}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <AuthContainer>
      <Toaster />
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <div className="bg-white w-16 h-16 rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Video className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Join Meeting</h1>
          <p className="text-gray-300 mt-2">Enter room details to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="roomId"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    errors.roomId ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter room ID"
                />
                <button
                  type="button"
                  onClick={copyRoomIdToClipboard}
                  className="ml-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                  <Copy className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {errors.roomId && <p className="mt-1 text-sm text-red-500">{errors.roomId}</p>}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.username ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter your name"
                />
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              Join Room
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Want to create a new room?{" "}
              <button onClick={generateRoomid} className="text-green-500 hover:text-green-600 font-medium">
                Generate Room ID
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Lobby;
