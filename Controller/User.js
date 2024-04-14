import dbConnect from "../DataBase/db.js";
import db from "../Server.js";
import * as normalfs from "fs";
import fs from "fs/promises"

import path from "path";


const sp = "SP_EmployeeDetail";




//------------------SignUp-------------------------------
export const User_SignUp = async (req, res) => {
    let {Name, Email,Password , Mobile, City, State, UserType }=req.body;

    console.log(req.body)
    try {
        const { recordset } = await db.request()
            .input('Flag', 'SignUp')
            .input('Name', Name)            
            .input('Mobile', Mobile)
            .input('Email',Email)
            .input('Password',Password)
            .input('City',City)            
            .input('State',State)
            .input('UserType',UserType)

            .execute(sp)

        console.log(recordset);
        return res.status(200).json({ Flag: recordset[0].Flag, Flag_Msg: recordset[0].Flag_Msg})
    } catch (error) {   
        console.log(error);
        return res.status(200).json({Flag: '0', Flag_Msg: 'Something Went Wrong' })
    }
}



//------------Login -----------------------------------
export const User_Login_API= async (req, res) => {
    let {Email,Password}=req.body;

    console.log(req.body)
    try {
        const { recordset } = await db.request()
            .input('Flag', 'Login')
            .input('Email',Email)
            .input('Password',Password)

            .execute(sp)

        console.log(recordset);

        let filterData=recordset.map((item)=>{
            return {
                Name:item.Name,
                Email:item.Email,
                City:item.City,
                State:item.State,
                FormType:item.FormType,
                UserType:item.UserType
            }
        })
         res.status(200).json({ Flag: recordset[0].Flag, Flag_Msg: recordset[0].Flag_Msg,Result: filterData})
    } catch (error) {   
        console.log(error);
        return res.status(200).json({Flag: '0', Flag_Msg: 'Something Went Wrong' })
    }
}

//-----------------------Admin Review Img--------------------------------------
export const ReviewApplication = async (req, res) => {
   let {FromDate,ToDate}=req.body;
  console.log(req.body)
  try {
      const { recordset } = await db.request()
          .input('Flag', 'ReviewApplication')
          .input('FromDate', FromDate)
          .input('ToDate',ToDate)
          .execute(sp)
      console.log(recordset);

      let filterData=recordset.map((item)=>{
        return {
            Name:item.Name,
            Email:item.Email,
            Mobile:item.Mobile,
            Image:item.Image,
        }
    })
       res.status(200).json({ Flag: recordset[0].Flag, Flag_msg: recordset[0].recordset, Details: filterData })

  } catch (error) {
      console.log('err is: ', error);
      return res.status(200).json({ Flag: '0', Flag_msg: 'Somethin Went Wrong' })
  }
}



//--------------------------------------Base 64 Img---------------------------


export const imgUploadAPI = async (req, res) => {
  let { Mobile, Img_Base } = req.body;
  var ourFilePath = await base64ToFile("Img", Mobile, Img_Base);

console.log('ourFilePath',ourFilePath)
console.log('Img_Base:',Img_Base)
//console.log(req.body)
  try {
      const { recordset } = await db.request()
          .input('Flag', 'ImgUpload')
          .input('Img_Base', ourFilePath)
          .input('Mobile', Mobile)
          .execute(sp);

      console.log(recordset);
      return res.status(200).json({ Flag: recordset[0].Flag, Flag_Msg: recordset[0].Flag_Msg });
  } catch (err) {
      console.log('error:', err);
      return res.status(404).json({ Flag: '0', Flag_Msg: 'Something went Wrong' });
  }
};



//-----------------------------------------------------------


let base64ToFile = async (ImgName,id, base64String) => {
  try {
      let extension = "";

      if (base64String != null && base64String.trim() != "") {
          extension = "";
          let trimmed = base64String.substring(0, 5);
          let excelTrim = base64String.substring(0, 8);
          if (excelTrim.toUpperCase() === "UESDBBQA") {
              extension = ".xlsx";
          } else {
              switch (trimmed.toUpperCase()) {
                  case "IVBOR":
                      extension = ".png";
                      break;

                  case "/9J/4":
                      extension = ".jpg";
                      break;

                  case "JVBER":
                      extension = ".pdf";
                      break;

                  case "UESDB":
                      extension = ".docx";
                      break;

                  case "0M8R4":
                      extension = ".doc";
                      break;

                  default:
                      extension = "Unknown";
                      break;
              }
          }
      }

         const saveDirectory = "D:\\UPLOADS\\WasserStoff\\Image\\Assignment";
      if (!normalfs.existsSync(saveDirectory)) {
        normalfs.mkdirSync(saveDirectory);
      }
      const currentDateTime = new Date();

      const year = currentDateTime.getFullYear();
      const month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
      const day = String(currentDateTime.getDate()).padStart(2, "0");
      const hours = String(currentDateTime.getHours()).padStart(2, "0");
      const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
      const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");

      const formattedDateTime = `${day}${month}${year}${hours}${minutes}${seconds}`;

      const outputFilePath = `${ImgName}_${id}_${formattedDateTime}${extension}`;

      const filePath = path.join(saveDirectory,"\\", outputFilePath);
      const buffer = Buffer.from(base64String, "base64");

      await fs.writeFile(filePath, buffer);

      //return { ourFilePath: filePath, outputFilePath };
      //return outputFilePath
      return filePath
  } catch (err) {
      console.log(err?.message);
  }
};


