import User from "../models/userModel"
import asyncHandler from "express-async-handler"
import generateToken from "../utils/generateToken"
import { Response } from "express"
import { ProtectedRequest } from "../types/app-request"
import mongoose from "mongoose"

const loginUser = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user?.matchPassword?.(password))) {
    generateToken(res, user._id as mongoose.Types.ObjectId)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(401)
    throw new Error(" Invalid email or password")
  }
})

const registerUser = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already Exists")
  }

  const user = await User.create({ name, email, password })

  if (user) {
    generateToken(res, user._id as mongoose.Types.ObjectId)
    res.status(201)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(400)
    throw new Error("Invalid User Credentials")
  }
})

// const forgotPassword = asyncHandler(async (req: ProtectedRequest, res: Response) => {
//   const { email } = req.body

//   const user = await User.findOne({ email })

//   if (!user) {
//     res.status(404)
//     throw new Error("User Not Found")
//   }

//   const resetToken = user.createPasswordResetToken()
//   user.save()

//   const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`

//   const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Your Password reset token. (valid for 10mins)",
//       message,
//     })

//     res.status(200).json({
//       message: "Token Sent to email!",
//     })
//   } catch (error) {
//     user.passwordResetToken = undefined
//     user.passwordResetExpires = undefined
//     user.save()
//     console.log(error)

//     res.status(500).json({
//       status: "error",
//       message:
//         "There was an error in sending the email. Please Try again later",
//     })
//   }
// })

// const resetPassword = asyncHandler(async (req: ProtectedRequest, res: Response) => {
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.resetToken)
//     .digest("hex")

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   })

//   if (!user) {
//     res.status(400).json({
//       status: "fail",
//       message: "Token is invalid or has expired",
//     })
//   }

//   user.password = req.body.password
//   user.passwordResetToken = undefined
//   user.passwordResetExpires = undefined
//   user.save()

//   generateToken(res, user._id)

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   })
// })

const logoutUser = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({
    message: "Logged Out Successfully",
  })
})

export { loginUser, registerUser, logoutUser }
