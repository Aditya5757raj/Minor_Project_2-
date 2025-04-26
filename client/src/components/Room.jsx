import React, { useEffect, useCallback, useState, useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../services/Peer.js";
import { useSocket } from "../utils/SocketProvider.js";
import Editor from "./EditorPage.js";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Dialog from "./DialogBox.jsx";
import Whiteboard from "./Whiteboard.jsx";
import {
  Camera,
  Mic,
  MicOff,
  Monitor,
  Phone,
  VideoOff,
  Code,
  Maximize2,
  Minimize2,
  X,
  Square,
} from "lucide-react";

const RoomPage = () => {
  const socket = useSocket();
  const { roomId, email } = useParams();

  // Media and connection states
  const [incomingCall, setIncomingCall] = useState(false);
  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [remoteEmail, setRemoteEmail] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState(null);

  // UI states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Code editor state
  const [codeRef, setCodeRef] = useState(null);

  // Whiteboard states
  const [whiteboardData, setWhiteboardData] = useState([]);
  const whiteboardRef = useRef(null);

  // Initialize whiteboard when component mounts
  useEffect(() => {
    if (!socket) return;

    // Request current whiteboard state when joining
    socket.emit("whiteboard:request-state", { roomId });

    // Handle initial whiteboard state
    const handleInitialState = (data) => {
      setWhiteboardData(data);
      if (whiteboardRef.current) {
        whiteboardRef.current.loadData(data);
      }
    };

    // Handle real-time drawing updates
    const handleWhiteboardUpdate = (action) => {
      setWhiteboardData(prev => [...prev, action]);
      if (whiteboardRef.current && isWhiteboardOpen) {
        whiteboardRef.current.handleRemoteAction(action);
      }
    };

    // Handle clear events
    const handleWhiteboardClear = () => {
      setWhiteboardData([]);
      if (whiteboardRef.current && isWhiteboardOpen) {
        whiteboardRef.current.clear();
      }
    };

    socket.on("whiteboard:initial-state", handleInitialState);
    socket.on("whiteboard:update", handleWhiteboardUpdate);
    socket.on("whiteboard:clear", handleWhiteboardClear);

    return () => {
      socket.off("whiteboard:initial-state", handleInitialState);
      socket.off("whiteboard:update", handleWhiteboardUpdate);
      socket.off("whiteboard:clear", handleWhiteboardClear);
    };
  }, [socket, roomId, isWhiteboardOpen]);

  // Broadcast drawing action to all participants
  const handleWhiteboardAction = useCallback((action) => {
    const newAction = {
      ...action,
      timestamp: Date.now(),
      author: email
    };
    setWhiteboardData(prev => [...prev, newAction]);
    socket.emit("whiteboard:action", { 
      roomId, 
      action: newAction
    });
  }, [socket, roomId, email]);

  // Clear whiteboard and notify all participants
  const handleClearWhiteboard = useCallback(() => {
    setWhiteboardData([]);
    socket.emit("whiteboard:clear", { roomId });
  }, [socket, roomId]);

  // Whiteboard toggle handler
  const handleWhiteboardToggle = useCallback(() => {
    setIsWhiteboardOpen(!isWhiteboardOpen);
  }, [isWhiteboardOpen]);

  // Existing handlers
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`, id);
    socket.emit("sync:code", { id, codeRef });
    
    // Send current whiteboard state to new participant
    if (whiteboardData.length > 0) {
      socket.emit("whiteboard:send-state", { 
        to: id,
        roomId,
        data: whiteboardData 
      });
    }
    
    setRemoteSocketId(id);
    setRemoteEmail(email);
    setShowDialog(true);
    socket.emit("wait:for:call", { to: id, email });
  }, [codeRef, socket, whiteboardData, roomId]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer, email });
    setMyStream(stream);
    setShowDialog(false);
  }, [remoteSocketId, socket, email]);

  const handleIncommingCall = useCallback(
    async ({ from, offer, fromEmail }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setIncomingCall(true);
      setMyStream(stream);
      setRemoteEmail(fromEmail);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  const toggleVideo = () => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
      }
      socket.emit("user:video:toggle", {
        to: remoteSocketId,
        isVideoOff: !isVideoOff,
        email: email,
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const handleLeaveRoom = () => {
    socket.emit("leave:room", { roomId, email });
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
    setRemoteSocketId(null);
    setRemoteEmail(null);
    setRemoteStream(null);
    window.close();
  };

  const showScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      if (screenTrack) {
        const sender = peer.peer
          .getSenders()
          .find((s) => s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
        screenTrack.onended = () => {
          const videoTrack = myStream.getVideoTracks()[0];
          if (videoTrack && sender) {
            sender.replaceTrack(videoTrack);
          }
        };
      }
    } catch (error) {
      console.error("Error while sharing screen:", error);
    }
  };

  // Socket event listeners
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    const handleUserLeft = ({ email }) => {
      toast(`${email} has left the room.`, { icon: "👋" });
      if (remoteSocketId) {
        setRemoteSocketId(null);
        setRemoteEmail(null);
        setRemoteStream(null);
      }
    };

    socket.on("user:left", handleUserLeft);
    socket.on("remote:video:toggle", ({ isVideoOff, email }) => {
      if (remoteEmail === email) {
        setRemoteVideoOff(isVideoOff);
      }
    });
    socket.on("wait:for:call", ({ from, email }) => {
      toast("wait until someone lets you in");
    });

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user:left", handleUserLeft);
      socket.off("remote:video:toggle");
      socket.off("wait:for:call");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    remoteSocketId,
    remoteEmail,
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (incomingCall) {
        sendStreams();
        setIncomingCall(false);
      }
    }, 2000);
  }, [incomingCall, sendStreams]);
  
  return (
    <div>
      <Toaster />
      <div className="min-h-screen bg-black/15 flex">
        {/* Main Content Area */}
        <div className={`flex-1 p-4 transition-all duration-300 ${(isEditorOpen || isWhiteboardOpen) ? "w-[60%]" : "w-full"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
            {/* Local Video Stream */}
            <div className="relative overflow-hidden rounded-lg bg-black/15 shadow-lg">
              <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                {email}
              </div>
              {myStream && (
                <>
                  {!isVideoOff ? (
                    <ReactPlayer
                      playing
                      muted={isMuted}
                      height="100%"
                      width="100%"
                      url={myStream}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-[100px]">{email[0].toUpperCase()}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Remote Video Stream */}
            {remoteSocketId && (
              <div className="relative overflow-hidden rounded-lg bg-black/15 shadow-lg">
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                  {remoteEmail}
                </div>
                {remoteStream && (
                  <>
                    {!remoteVideoOff ? (
                      <ReactPlayer
                        playing
                        muted={isMuted}
                        height="100%"
                        width="100%"
                        url={remoteStream}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-[100px]">
                          {remoteEmail[0].toUpperCase()}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/15 backdrop-blur-sm border-t">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
              {/* Audio Control */}
              <button
                className={`p-3 rounded-full border ${isMuted
                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                    : "hover:bg-gray-100 border-gray-200"
                  }`}
                onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Video Control */}
              <button
                className={`p-3 rounded-full border ${isVideoOff
                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                    : "hover:bg-gray-100 border-gray-200"
                  }`}
                onClick={toggleVideo}>
                {isVideoOff ? <VideoOff size={20} /> : <Camera size={20} />}
              </button>

              {/* Screen Share */}
              <button
                className="p-3 rounded-full border border-gray-200 hover:bg-gray-100"
                onClick={showScreen}>
                <Monitor size={20} />
              </button>

              {/* Leave Call */}
              <button
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600"
                onClick={handleLeaveRoom}>
                <Phone size={20} className="rotate-[135deg]" />
              </button>

              <div className="w-px h-6 bg-gray-200"></div>

              {/* Code Editor Toggle */}
              <button
                className={`p-3 rounded-full border ${isEditorOpen
                    ? "bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100"
                    : "hover:bg-gray-100 border-gray-200"
                  }`}
                onClick={() => setIsEditorOpen(!isEditorOpen)}>
                <Code size={20} />
              </button>

              {/* Whiteboard Toggle */}
              <button
                className={`p-3 rounded-full border ${isWhiteboardOpen
                    ? "bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100"
                    : "hover:bg-gray-100 border-gray-200"
                  }`}
                onClick={handleWhiteboardToggle}>
                <Square size={20} />
              </button>

              {/* Fullscreen Toggle */}
              <button
                className="p-3 rounded-full border border-gray-200 hover:bg-gray-100"
                onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        {isEditorOpen && (
          <div className="w-[40%] border-l border-gray-200 bg-black/15 relative h-full">
            <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-between">
              <h2 className="font-semibold">Code Editor</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsEditorOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white/50 rounded-lg min-h-[calc(90-10rem)] shadow-sm">
                <Editor
                  roomId={roomId}
                  socket={socket}
                  onCodeChange={(code) => setCodeRef(code)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Whiteboard Panel */}
        {isWhiteboardOpen && (
          <div className="w-[40%] border-l border-gray-200 bg-black/15 relative h-full">
            <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold">Collaborative Whiteboard</h2>
                <button 
                  onClick={handleClearWhiteboard}
                  className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                >
                  Clear Board
                </button>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={handleWhiteboardToggle}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4 h-full">
              <div className="bg-white/50 rounded-lg h-[calc(100%-4rem)] shadow-sm flex items-center justify-center">
                <Whiteboard 
                  ref={whiteboardRef}
                  socket={socket} 
                  roomId={roomId}
                  onAction={handleWhiteboardAction}
                  initialData={whiteboardData}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Incoming Call Dialog */}
      {showDialog && remoteEmail && (
        <Dialog
          user={remoteEmail}
          onAdmit={handleCallUser}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default RoomPage;