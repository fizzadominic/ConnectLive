import express from 'express';
const router  = express.Router();


router.get("/send", (req, res)=>{
     res.send("send messages to the endpoint");
});
 
export default router;