const express=require('express')
const dotenv=require('dotenv')
dotenv.config();
const morgan=require('morgan')
const {createProxyMiddleware}=require('http-proxy-middleware')
const rateLimit=require('express-rate-limit')
const axios=require('axios')
const app=express();

const PORT= 3004;

const limiter=rateLimit({
    windowMs:15*60*1000,
    max:100
})

app.use(morgan('combined'))
app.use(limiter)

app.use('/bookingservice',async(req,res,next)=>{
    try{
   const response=await axios.get('http://localhost:3001/auth/api/v1/isAuthenticated',{
    headers:{
        'x-access-token':req.headers['x-access-token']
    }
   });

   if(response.data.success) next();
}
   catch(error){
    return res.status(401).json({message:'unauthorized request'})}
})
app.use('/bookingservice/',createProxyMiddleware({target:'http://localhost:3002/',changeOrigin:true}))

app.get('/home',(req,res)=>{
    res.status(200).json("Hello")
})

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})