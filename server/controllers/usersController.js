const Users = require("../models/usersModel");
require('dotenv').config()
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const helper = require("../utils/helper");
const randomstring = require("randomstring");
const path = require("path");
const fs = require("fs");
const { config } = require("process");
const { ObjectId } = require("mongodb");
const { log } = require("console");


module.exports.registerUser = async (req, res) => {
  try {
    const userName = await helper.capitalizeName(req.body.name);
    const userEmail = req.body.email;
    const userPass = await helper.createPassword(req.body.password);
    const userMobile = req.body.mobile;

    // console.log(req.body.masterPassword);
    // return false;

    if (req.body.masterPassword == undefined) {
      var masterPass = null;
    } else {
      var masterPass = await helper.createPassword(req.body.masterPassword);
    }

    const emailExist = await Users.findOne({ email: userEmail });
    const rand = Math.random().toString(16).substr(2, 16);

    if (emailExist) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({ success: false, message: "Email already exist" });
    } else {
      const creatUser = new Users({
        name: userName,
        email: userEmail,
        password: userPass,
        mobile: userMobile,
        masterPassword: masterPass,
        token: rand
      });
      if (req.file) {
        creatUser.avtar = req.file.filename;
      } else {
        creatUser.avtar = null; // or user.image = "";
      }

      const saveUserData = await creatUser.save();
      // complete data save here 
      verifyURL = 'http://localhost:5000/api/verify-email?token=' + rand;
      // send mail to user
      const sendMailResponse = helper.sendEmail(userEmail, 'Email Verification', 'Please verify your email', `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Send Mail</title>
      </head>
      
      <body style="margin:0;padding:0" dir="ltr" bgcolor="#ffffff">
          <table border="0" cellspacing="0" cellpadding="0" align="center" id="m_-7626415423304311386email_table"
              style="border-collapse:collapse">
              <tbody>
                  <tr>
                      <td id="m_-7626415423304311386email_content"
                          style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff">
                          <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                              <tbody>
                                  <tr>
                                      <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td height="1" colspan="3" style="line-height:1px"></td>
                                  </tr>
                                  <tr>
                                      <td>
                                          <table border="0" width="100%" cellspacing="0" cellpadding="0"
                                              style="border-collapse:collapse;text-align:center;width:100%">
                                              <tbody>
                                                  <tr>
                                                      <td width="15px" style="width:15px"></td>
                                                      <td style="line-height:0px;max-width:600px;padding:0 0 15px 0">
                                                          <table border="0" width="100%" cellspacing="0" cellpadding="0"
                                                              style="border-collapse:collapse">
                                                              <tbody>
                                                                  <tr>
                                                                      <td style="width:100%;text-align:left;height:33px"><img
                                                                              height="33"
                                                                              src="https://www.badabazaars.com/web/design_img/bada.png"
                                                                              style="border:0" class="CToWUd" data-bit="iit">
                                                                      </td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                      <td width="15px" style="width:15px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td>
                                          <table border="0" width="430" cellspacing="0" cellpadding="0"
                                              style="border-collapse:collapse;margin:0 auto 0 auto">
                                              <tbody>
                                                  <tr>
                                                      <td>
                                                          <table border="0" width="430px" cellspacing="0" cellpadding="0"
                                                              style="border-collapse:collapse;margin:0 auto 0 auto;width:430px">
                                                              <tbody>
                                                                  <tr>
                                                                      <td width="15" style="display:block;width:15px">
                                                                          &nbsp;&nbsp;&nbsp;</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td>
                                                                          <table border="0" width="100%" cellspacing="0"
                                                                              cellpadding="0"
                                                                              style="border-collapse:collapse">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td>
                                                                                          <table border="0" cellspacing="0"
                                                                                              cellpadding="0"
                                                                                              style="border-collapse:collapse">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td width="20"
                                                                                                          style="display:block;width:20px">
                                                                                                          &nbsp;&nbsp;&nbsp;
                                                                                                      </td>
                                                                                                      <td>
                                                                                                          <table border="0"
                                                                                                              cellspacing="0"
                                                                                                              cellpadding="0"
                                                                                                              style="border-collapse:collapse">
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td>
                                                                                                                          <p
                                                                                                                              style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                                                              Hi
                                                                                                                              ${userName}!
                                                                                                                          </p>
      
                                                                                                                          <p> Your
                                                                                                                              Login
                                                                                                                              Id:${userEmail}
                                                                                                                              <br>
                                                                                                                              Password:${req.body.password}
                                                                                                                          </p>
                                                                                                                          <p
                                                                                                                              style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                                                              You
                                                                                                                              updated
                                                                                                                              your
                                                                                                                              <span
                                                                                                                                  class="il">email</span>
                                                                                                                              address
                                                                                                                              to
                                                                                                                              <span
                                                                                                                                  style="color:#2b5a83"
                                                                                                                                  id="m_-7626415423304311386body_email"><a
                                                                                                                                      href="mailto:${userEmail}"
                                                                                                                                      target="_blank">${userEmail}</a></span>.
                                                                                                                              <a
                                                                                                                                  href="${verifyURL}">
                                                                                                                                  <span
                                                                                                                                      class="il">Confirm</span>
                                                                                                                                  your
                                                                                                                                  <span
                                                                                                                                      class="il">email</span></a>
                                                                                                                              address
                                                                                                                              to
                                                                                                                              continue
                                                                                                                              capturing
                                                                                                                              and
                                                                                                                              sharing
                                                                                                                              your
                                                                                                                              moments
                                                                                                                              with
                                                                                                                              the
                                                                                                                              world.
                                                                                                                          </p>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                                  <tr>
                                                                                                                      <td height="20"
                                                                                                                          style="line-height:20px">
                                                                                                                          &nbsp;
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                                  <tr>
                                                                                                                      <td><a href="${verifyURL}"
                                                                                                                              style="color:#1b74e4;text-decoration:none;display:block;width:370px"
                                                                                                                              target="_blank"
                                                                                                                              data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/accounts/confirm_email/S5s9GbL6/cnVhc2luZ2hlMDFAZ21haWwuY29t/?app_redirect%3DFalse&amp;source=gmail&amp;ust=1658914278556000&amp;usg=AOvVaw1eF_-1j16FhP8HtQVHGD6s">
                                                                                                                              <table
                                                                                                                                  border="0"
                                                                                                                                  width="390"
                                                                                                                                  cellspacing="0"
                                                                                                                                  cellpadding="0"
                                                                                                                                  style="border-collapse:collapse">
                                                                                                                                  <tbody>
                                                                                                                                      <tr>
                                                                                                                                          <td
                                                                                                                                              style="border-collapse:collapse;border-radius:3px;text-align:center;display:block;border:solid 1px #009fdf;padding:10px 16px 14px 16px;margin:0 2px 0 auto;min-width:80px;background-color:#47a2ea">
                                                                                                                                              <a href=""
                                                                                                                                                  style="color:#1b74e4;text-decoration:none;display:block"
                                                                                                                                                  target="_blank"
                                                                                                                                                  <center>
                                                                                                                                                  <font
                                                                                                                                                      size="3">
                                                                                                                                                      <a
                                                                                                                                                          href="${verifyURL}">
                                                                                                                                                          <span
                                                                                                                                                              style="font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#fdfdfd;font-size:16px;line-height:16px"><span
                                                                                                                                                                  class="il">Confirm</span>&nbsp;<span
                                                                                                                                                                  class="il">email</span>&nbsp;address</span>
                                                                                                                                                      </a>
                                                                                                                                                  </font>
                                                                                                                                                  </center>
                                                                                                                                              </a>
                                                                                                                                          </td>
                                                                                                                                      </tr>
                                                                                                                                  </tbody>
                                                                                                                              </table>
                                                                                                                          </a>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                                  <tr>
                                                                                                                      <td height="20"
                                                                                                                          style="line-height:20px">
                                                                                                                          &nbsp;
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                      </td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td height="10" style="line-height:10px" colspan="1">
                                                                          &nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td>
                                          <table border="0" cellspacing="0" cellpadding="0"
                                              style="border-collapse:collapse;margin:0 auto 0 auto;width:100%;max-width:600px">
                                              <tbody>
                                                  <tr>
                                                      <td height="4" style="line-height:4px" colspan="3">&nbsp;</td>
                                                  </tr>
                                                  <tr>
                                                      <td width="15px" style="width:15px"></td>
                                                      <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                                                      <td style="text-align:center">
                                                          <div style="padding-top:10px;display:flex">
                                                              <div style="margin:auto"><img
                                                                      src="https://www.badabazaars.com/web/design_img/bada.png"
                                                                      height="26" width="52" alt="" class="CToWUd"
                                                                      data-bit="iit"></div><br>
                                                          </div>
                                                          <div style="height:10px"></div>
                                                          <div style="color:#abadae;font-size:11px;margin:0 auto 5px auto">©
                                                              Instagram. Meta Platforms,
                                                              Inc., 1601 Willow Road, Menlo Park, CA 94025<br></div>
                                                          <div style="color:#abadae;font-size:11px;margin:0 auto 5px auto">If
                                                              you didn't change your
                                                              Instagram <span class="il">email</span> address, <a href=""
                                                                  style="color:#abadae;text-decoration:underline"
                                                                  target="_blank"
                                                                  data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/accounts/remove/revoke_wrong_email/?uidb36%3Dn752wk1%26token%3D5zw-22ded54809dcbad9c7a4d6282b8ed7fb%26nonce%3DBoDUVCNb%26encoded_email%3DcnVhc2luZ2hlMDFAZ21haWwuY29t&amp;source=gmail&amp;ust=1658914278556000&amp;usg=AOvVaw3Oe3Hp81PQfDyukdRF_9vN">revert
                                                                  this change</a>.<br></div>
                                                      </td>
                                                      <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                                                      <td width="15px" style="width:15px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td height="32" style="line-height:32px" colspan="3">&nbsp;</td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table><span><img src="https://www.badabazaars.com/web/design_img/bada.png"
                                  style="border:0;width:1px;height:1px" class="CToWUd" data-bit="iit"></span>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`)

      res.status(200).send({ success: true, message: `Thank you ${userName} for connect with us.` });
    }

  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const userToken = req.query.token;
    const findUserbyToken = await Users.findOne({ token: userToken });
    if (findUserbyToken) {
      await Users.updateOne({ token: userToken }, { $set: { status: "Y", token: '' } });
      res.status(200).send({ success: true, message: "Your Email has been verified successfully" });
    } else {
      res.status(400).send({ sucess: false, message: "Invalid Token" })
    }
  } catch (error) {
    res.status(500).send({ sucess: false, message: error.message })
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const loginEmail = req.body.email;
    const loginPass = req.body.password;

    if (loginEmail == null) {
      res.status(400).send({ success: false, message: "Please Enter a Email" })
    } else if (loginPass == null) {
      res.status(400).send({ success: false, message: "Please Enter a Password" })
    };

    const emailExist = await Users.findOne({ email: loginEmail }, { name: 1, email: 1, password: 1, role: 1, mobile: 1, status: 1, avtar: 1 });
    if (emailExist) {
      if (emailExist.status == "N") {
        res.status(400).send({ success: false, message: "You have recievd a verification email Kindly confirm to activate you account." })
      } else {

        const findAdmin = await Users.findOne({ role: "admin" });
        const checkPassword = await helper.comparePassword(findAdmin.masterPassword, loginPass) || await helper.comparePassword(emailExist.password, loginPass);

        if (checkPassword) {
          const token = await helper.create_token(emailExist);
          if (emailExist.avtar) {
            var userProfile = `${process.env.FILE_PATH}/${emailExist.avtar}`;
          } else {
            var userProfile = `${process.env.DEFAULT_IMAGE}`;
          }
          const data = {
            name: emailExist.name,
            avtar: userProfile,
            token: token
          };
          res.status(200).send({ success: true, message: "Login Successfully", data });
          return false;
        } else {
          res.status(400).send({ success: false, message: "Invaild Password" });
          return false;
        }
      }

    } else {
      res.status(400).send({ success: false, message: "Email not found" })
    }
  } catch (error) {
    console.log("Error from login function : ", error);
  }
};

module.exports.userProfile = async (req, res) => {
  try {
    const tokenDecriptData = req.user.data;
    const findUser = await Users.findOne({ _id: new ObjectId(tokenDecriptData._id) });
    if (findUser.avtar) {
      var userProfile = `${process.env.FILE_PATH}/${findUser.avtar}`;
    } else {
      var userProfile = `${process.env.DEFAULT_IMAGE}`;
    }

    const data = {
      name: findUser.name,
      email: findUser.email,
      mobile: findUser.mobile,
      role: findUser.role,
      avtar: userProfile
    }

    res.status(200).send({ success: true, message: "User Detail", data });

  } catch (error) {
    console.log("Error from userProfile function : ", error);
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const { _id } = req.user.data;
    const avtar = req.file;
    const findProfile = await Users.findOne({ _id });

    const fileURL = path.join(__dirname, `../public/uploads/`);
    if (findProfile) {
      // if (avtar) {
      //   fs.unlinkSync(`${fileURL}${findProfile.avtar}`);
      // }
      var condition = {};
      if (name) {
        const firstLetter = name[0];
        if (isNaN(firstLetter)) {
          condition.name = await helper.capitalizeName(name);
        } else {
          res.status(400).send({ success: false, message: "Invalid Name" });
        }
      };

      if (mobile) {
        if (mobile.length == 10) {
          condition.mobile = mobile;
        } else {
          res.status(400).send({ success: false, message: "Invalid Number" });
        }
      };

      if (avtar) {
        condition.avtar = avtar.filename;
      }
      const updateData = await Users.updateOne({ _id }, { $set: condition });
      console.log(updateData);
      res.status(200).send({ success: true, message: "Profile Update Successfull", data: condition });
    } else {
      res.status(400).send({ sucess: false, message: "Failed Profile Update" });
    };
    return false;
  } catch (error) {
    console.log("Error from updateProfile function : ", error);
  };
};

module.exports.deleteUser = async (req, res) => {
  try {
    const fileURL = path.join(__dirname, `../public/uploads/`);
    const { _id } = req.query;
    const findUser = await Users.findOne({ _id: new ObjectId(_id) });
    if (findUser) {
      if (findUser.avtar) {
        fs.unlinkSync(`${fileURL}${findUser.avtar}`);
      }
      const deleteUser = await Users.deleteOne({ _id });
      res.status(200).send({ success: true, message: "User has been delete successfully" });
    } else {
      res.status(400).send({ success: false, message: "User can't find" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.deleteAllUser = async (req, res) => {
  try {
    const fileURL = path.join(__dirname, `../public/uploads/`);
    const findAllUsers = await Users.find({ role: "user" });
    if (findAllUsers) {
      var getAllUsers = findAllUsers.map((allUsers) => {
        if (fs.existsSync(`${fileURL}${allUsers.avtar}`)) {
          fs.unlinkSync(`${fileURL}${allUsers.avtar}`);
        }
      })
    }
    const deleteAllUsers = await Users.deleteMany({ role: "user" });
    res.status(200).send({ success: true, message: "All User has been delete successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports.viewAllUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 500;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const viewAllUsers = await Users.find({ role: "user" })
      .select("-__v")
      .limit(limit)
      .skip(skip);

    const fileURL = path.join(__dirname, `../public/uploads/`);

    if (viewAllUsers) {
      var getUsers = viewAllUsers.map((user) => {
        if (fs.existsSync(`${fileURL}${user.avtar}`)) {
          return {
            ...user.toObject(),
            avtar: `${process.env.FILE_PATH}/${user.avtar}`
          };
        } else {
          return {
            ...user.toObject(),
            avtar: `${process.env.DEFAULT_IMAGE}`
          };
        }
      }
      )
    }
    res.status(200).send({ success: true, message: "All User viewed successfully", data: getUsers });
  } catch (error) {
    console.log("Error from viewAllUser Function", error);
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { _id } = req.user.data;
    const { oldPassword, newPassword } = req.body;
    const findProfile = await Users.findOne({ _id });

    if (findProfile) {
      const checkPassword = await helper.comparePassword(findProfile.password, oldPassword);
      if (checkPassword) {
        if (newPassword.length >= 6) {
          const createPassword = await helper.createPassword(newPassword);
          const updatePassword = await Users.updateOne({ _id }, { $set: { password: createPassword } });
          res.status(200).send({ success: true, message: "Password Updated Successfully" });
          const sendMailResponse = await helper.sendEmail(findProfile.email, "Password Update", "Your Password Updated Successfully", `<p><b>Your Password Updated Successfully.</b></p> 
          <br>
          <p>Email : ${findProfile.email} <br> Password :  ${newPassword}`);
        } else {
          res.status(400).send({ success: false, message: "Password to Short" });
        }
      } else {
        res.status(400).send({ success: false, message: "Old Password not match" });
      }
    }

  } catch (error) {
    console.log("Error from updatePassword function", error);
  }
};

module.exports.updateMasterPassword = async (req, res) => {
  try {
    const { _id } = req.user.data;
    const { oldPassword, newPassword } = req.body;
    const findProfile = await Users.findOne({ _id });

    if (findProfile) {
      if (findProfile.role == "admin") {
        const checkPassword = await helper.comparePassword(findProfile.masterPassword, oldPassword);
        if (checkPassword) {
          if (newPassword.length >= 6) {
            const createPassword = await helper.createPassword(newPassword);
            const updatePassword = await Users.updateOne({ _id }, { $set: { masterPassword: createPassword } });
            res.status(200).send({ success: true, message: "Password Updated Successfully" });
            const sendMailResponse = await helper.sendEmail(findProfile.email, "Password Update", "Your Password Updated Successfully", `<p><b>Your Password Updated Successfully.</b></p> 
            <br>
            <p>Email : ${findProfile.email} <br> Password :  ${newPassword}`);
          } else {
            res.status(400).send({ success: false, message: "Password to Short" });
          }
        } else {
          res.status(400).send({ success: false, message: "Old Password not match" });
        }
      } else {
        res.status(400).send({ success: false, message: "You are not Admin" });
      }
    }
  } catch (error) {
    console.log("Error from updatePassword function", error);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { _id } = req.query;
    const findProfile = await Users.findOne({ _id: new ObjectId(_id) });

    if (findProfile) {
      if (findProfile.status == "N") {
        const changeStatus = await Users.updateOne({ _id }, { $set: { status: "Y", token: "" } });
      } else if (findProfile.status == "Y") {
        const changeStatus = await Users.updateOne({ _id }, { $set: { status: "N" } });
      }
      res.status(200).send({ success: true, message: "Status Updated Successfully" });
    } else {
      res.status(400).send({ success: false, message: "User not find" });
    }

  } catch (error) {
    console.log("Error from updatePassword function", error);
  }
};