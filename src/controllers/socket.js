import { Session } from "../models/session.model.js";

const webRTCSSignalingSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("User Connected", socket.id);

    socket.on("prepare-session", async ({ sessionId, userId }) => {
      console.log(`User ${userId} is preparing to join session ${sessionId}`);

      const session = await Session.findOne({ sessionId });

      if (session) {
        socket.join(sessionId);

        socket.emit("session-info", {
          participant: session?.participants,
        });

        socket.on("disconnect", () => {
          console.log(`User ${userId} is disconnected`);
        });
      } else {
        console.log(`Session not found. ID: ${sessionId}`);
        socket.emit("error", { message: "Session is not found" });
      }
    });

    socket.on("join-session", async ({ sessionId, userId, name, photo, micon, videon }) => {  
      try {
        const session = await Session.findOne({ sessionId });

        if (session) {
          const index = session.participants.findIndex(p => p.userId === userId);

          if (index !== -1) {
            session.participants[index] = {
              ...session.participants[index],
              name: name || session.participants[index].name,
              photo: photo || session.participants[index].photo,
              micon,
              videon,
              socketId: socket.id,
            };
          } else {
            session.participants.push({
              userId,
              name,
              photo,
              micon,
              videon,
              socketId: socket.id,
            });
          }

          await session.save();
          socket.join(sessionId);

          console.log(`User ${userId} joined session ${sessionId}`);

          io.to(sessionId).emit("new-participant",
            session.participants.find(p => p.userId === userId)
          );

          io.to(sessionId).emit("session-info", {
            participant: session.participants,
          });
        } else {
          console.log(`Session not found. ID: ${sessionId}`);
          socket.emit("error", { message: "Session is not found" });
        }
      } catch (error) {
        console.log("Error in join-session:", error);
      }
    });

    socket.on("current-room", async ({ sessionId }) => {
      console.log("Asking for room participants");
      const session = await Session.findOne({ sessionId });
      io.to(sessionId).emit("all-participants", session?.participants);
    });

    socket.on("send-offer", async ({ sessionId, sender, receiver, offer }) => {
      console.log(`User ${sender} is sending an offer to ${receiver} in session ${sessionId}`);
      io.to(sessionId).emit("receive-offer", { sender, receiver, offer });
    });

    socket.on("send-answer", async ({ sessionId, sender, receiver, answer }) => {
      console.log(`User ${sender} is sending an answer to ${receiver} in session ${sessionId}`);
      io.to(sessionId).emit("receive-answer", { sender, receiver, answer });
    });

    socket.on("send-ice-candidate", async ({ sessionId, sender, receiver, candidate }) => {
      console.log(`User ${sender} is sending ICE candidate to ${receiver} in session ${sessionId}`);
      io.to(sessionId).emit("receiving-ice-candidate", {
        sender,
        receiver,
        candidate,
      });
    });

    socket.on("toggle-mute", async ({ sessionId, userId }) => {
      console.log(`User ${userId} is toggling mute in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        participant.micon = !participant.micon;
        await session.save();

        console.log(`User ${userId} is now ${participant.micon ? "muted" : "unmuted"}`);
        io.to(sessionId).emit("participant-update", participant);
      }
    });

    socket.on("toggle-video", async ({ sessionId, userId }) => {
      console.log(`User ${userId} is toggling video in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        participant.videoOn = !participant.videoOn;
        await session.save();

        console.log(`User ${userId} has turned their video ${participant.videoOn ? "on" : "off"}`);
        io.to(sessionId).emit("participant-update", participant);
      }
    });

    socket.on("send-emoji", async ({ sessionId, userId, emoji }) => {
      console.log(`User ${userId} is sending emoji "${emoji}" in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        io.to(sessionId).emit("emoji-update", {
          name: participant.name,
          emoji,
        });
        console.log(`Emoji "${emoji}" sent by user ${userId}`);
      }
    });

    socket.on("send-chat", async ({ sessionId, userId, message }) => {
      console.log(`User ${userId} is sending chat "${message}" in session ${sessionId}`);
      const session = await Session.findOne({ sessionId });
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        io.to(sessionId).emit("receive-chat", {
          userId,
          name: participant.name,
          message,
        });
        console.log(`Message "${message}" sent by user ${userId}`);
      }
    });

    socket.on("hang-up", async () => {
      console.log("User Hang Up:", socket.id);
      const sessions = await Session.find();

      for (const session of sessions) {
        const index = session.participants.findIndex(p => p.socketId === socket.id);
        if (index !== -1) {
          const participant = session.participants[index];
          session.participants.splice(index, 1);
          await session.save();

          console.log(`User ${participant.name} (${participant.userId}) left session ${session.sessionId}`);
          io.to(session.sessionId).emit("session-info", {
            participants: session.participants,
          });
          io.to(session.sessionId).emit("participant-left", participant.userId);
          break;
        }
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      const sessions = await Session.find();

      for (const session of sessions) {
        const index = session.participants.findIndex(p => p.socketId === socket.id);
        if (index !== -1) {
          const participant = session.participants[index];
          session.participants.splice(index, 1);
          await session.save();

          console.log(`User ${participant.name} (${participant.userId}) left session ${session.sessionId}`);
          io.to(session.sessionId).emit("session-info", {
            participants: session.participants,
          });
          io.to(session.sessionId).emit("participant-left", participant.userId);
          break;
        }
      }
    });
  });
};

export default webRTCSSignalingSocket;
