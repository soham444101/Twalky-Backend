import e from "express";
import { Server} from "socket.io";
import {createServer} from "http";
import ConnectDB from "./database/index.database.js";
import { Session } from "./models/session.model.js";
import webRTCSSignalingSocket from "./controllers/socket.js";
import dotenv from "dotenv"; 
dotenv.config({
    path:'./.env'
})


const app = e();
// app.use(cors())
const server = createServer(app);
const io = new Server(server,{
    cors:{
        option :"*"
    }
});


// Database Connection call
ConnectDB()
.then(()=>{

    server.listen(process.env.PORT || 5000,"0.0.0.0",()=>{
    console.log(`Server is listen on ${process.env.PORT}`);
    // console.log(`http://localhost:${port}`);
    
})

})
.catch((e)=>{
    console.log("Error in app file",e);
})

app.get("/create-session",async (req ,res )=>{
  
    try {

        console.log("Crete Session Call come to Backend")
       const sessionId = Math.random().toString(36).substr(2,9);
       const session = new Session({sessionId:sessionId,participants:[]});
       console.table([sessionId,session]);
       
       await session.save();
       res.json({sessionId});
        
    } catch (error) {
        console.log('====================================');
        console.log("Error in Create-Session ",error);
        console.log('====================================');
    }

})

app.get("/is-alive", async(req,res)=>{
    try {
        console.log('====================================');
        console.log("is Alive " , req);
        console.log("Query" , req.query);
        console.log('====================================');
       const {sessionId}= req.query;
       console.log('====================================');
       console.log("Sessoson Id ",sessionId);
       console.log('====================================');
       const session = await Session.findOne({sessionId:sessionId});
       console.log('====================================');
       console.log("Responce ",session);
       console.log('====================================');
       res.json({isAlive : session})

    } catch (error) {
        console.log('====================================');
        console.log("Error in is-alive ",error);
        console.log('====================================');
    }
})

// Middlewar 
app.use(e.json())
// app.use((req,res,next )=>{
//     req.io = io;
//     next();
// })

webRTCSSignalingSocket(io);








