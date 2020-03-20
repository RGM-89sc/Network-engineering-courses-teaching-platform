 const db = require('../tools/mountModel');
 const log4js = require('log4js');
 const logger = log4js.getLogger();
 const bcrypt = require('bcrypt');
 const connectDB = require('../tools/connectDB');
 const config = require('../config.js');
 const Excel = require('exceljs/lib/exceljs.nodejs');
 logger.level = 'debug';
 const saltRounds = 10;
// const users = require('./account.json');
// const initStu = (stu) => {
//     if(!await db.student.findOne({
//         id: stu.account
//     })) {
//         db.student.create();
//     }
// }

// users.forEach((user, index) => {
//     const userType = user.userType;
//     if(!userType) {
//         logger.error(`Error! attr userType dose not exist! index:${index}`);
//         return;
//     }else if(userType !== 'stu' || userType !== 'tch'){
//         logger.error(`Error user type! index:${index}`);
//         return;
//     }
//     switch(user.userType) {
//         case 'stu':  
//         case 'tch': 
//         default: break;
//     }
// });
// console.log(jo instanceof Array);

/* 列：学号、姓名、院系、年级、专业 */
// 1. 无需构造学号

const run = async (filePath) => {
  const workbook = new Excel.Workbook();
  // await connectDB(config.db);
  workbook.xlsx.readFile(filePath)
    .then(() => {
      let successCount = 0, failedCount = 0, repeatedCount = 0;
  
      const worksheet = workbook.getWorksheet(2);
  
      worksheet.eachRow(async (row, rowNumber) => {
          if(rowNumber < 2) {
              return;
          }
          
          const [,id, username, faculty, grade, major, sclass] = row.values;
          
          if(await db.student.findOne({
              id,
          })) {
            ++repeatedCount;
            return;
          }
          const password =  await bcrypt.hash(id.slice(id.length-4), saltRounds); //密码为学号后四位
          await db.student.create({
              id,
              username,
              password,
              faculty,
              major,
              grade,
              sclass: sclass.substr(0, sclass.length-1)
          }).then((doc) => {
              ++successCount;
              // logger.info(`输入${id}成功`);
              
          }).catch((err) => {
              ++failedCount;
              logger.fatal(err);
          })

      });
      
    }).then(() => {
     
    }).catch(err => {
      logger.info(err);
    });
}
// run(`student_account.xlsx`);
module.exports = run;

// 2. 构造学号 年级 + 院系 + 专业 + 班级 + 递增序号
// const DEPARTMENTS = {
//     computerEng: {
//         id: '01',
//         label: '计算机工程学院'
//     }
// };
// const MAJORS = {
//     networkEng: {
//         id: '01',
//         label: '网络工程'
//     },
//     sfwEng: {
//         id: '02',
//         label: '软件工程'
//     }
// }
// workbook.xlsx.readFile(`account.xlsx`)
//   .then(function() {
//     const worksheet = workbook.getWorksheet(1);
//     worksheet.eachRow((row, rowNumber) => {
//         if(rowNumber <= 1) {
//             return;
//         }
//         const year = row[3];
//         const department = row[2]
//         const major = row[4];
//         const id = +(year + department + major) * 10000;

//         console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
//     });
//   });
