import mongoose, { Document, Schema, Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface UserDoc extends Document{
  name? : string,
  email? : string,
  password? : string,
  matchPassword? :(enteredPassword :string)=> Promise<boolean>
}

export interface UserModel extends Model<UserDoc>{
  matchPassword? :(enteredPassword :string)=> Promise<boolean>
}

export const DOCUMENT_NAME = "User"
export const COLLECTION_NAME = "users"

const userSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword : string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  if(this.password) this.password = await bcrypt.hash(this.password, salt)
})

const User: Model<UserDoc> = mongoose.model<UserDoc, UserModel>("User", userSchema)

export default User
