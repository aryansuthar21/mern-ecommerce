const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // 🔐 Password is OPTIONAL (Google users won’t have it)
    password: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // 🔵 Google login flag
    isGoogleUser: {
      type: Boolean,
      default: false,
    },

    // 🔑 Does this user have a password set?
    hasPassword: {
      type: Boolean,
      default: false,
    },

    profilePic: {
      type: String,
    },

  resetPasswordToken:{ type:String },
  resetPasswordExpire:{type: Date},

  },
  {
    timestamps: true,
  }
)

// 🔐 Match password (safe for Google users)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

// 🔐 Hash password ONLY if it exists & is modified
// 🔐 Hash password ONLY if it exists & is modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  this.hasPassword = true
})


const User = mongoose.model('User', userSchema)

module.exports = User
