import express, { json }  from "express";
import dbConnect from "./DataBase/db.js";
import bodyParser from 'body-parser'
import {User_SignUp, User_Login_API,imgUploadAPI,ReviewApplication} from "./Controller/User.js";
import { handleFileUpload } from './Controller/uploadFile.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerui from 'swagger-ui-express';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db=await dbConnect()
const port=4000;
const app=express();

const rawData=fs.readFileSync('./swagger-output.json')
const swaggerDocuments=JSON.parse(rawData)
app.use('/api-docs',swaggerui.serve,swaggerui.setup(swaggerDocuments))


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


//----------------------------

app.post('/upload', handleFileUpload, (req, res) => {
    res.status(200).json({ filename: req.file.filename });
});
//------------------------------


app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// app.get('/', (req, res) => {
//     res.render('homePage');
// });

app.post('/upload', handleFileUpload, (req, res) => {
    res.status(200).json({ filename: req.file.filename });
});


//--------------------------
app.get('/',(req,res)=>{
    const view=
    `<h1>API Home Page</h1>`
    res.send(view);
})

app.post('/API/User_SignUp',User_SignUp)
app.post('/API/User_Login',User_Login_API)
app.post('/API/ImgUpload_API',imgUploadAPI);
app.post('/API/ReviewApplication',ReviewApplication);


app.listen((port),()=>{
    console.log(`server is now running on Port: ${port}`);
})

export default db;