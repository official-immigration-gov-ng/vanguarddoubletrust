const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    firstname: { type: String, trim: true, default: "" },
    lastname: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    dob: { type: String, trim: true, default: "" },
    gender: { type: String, trim: true, default: "" },
    acctype: { type: String, trim: true, default: "" },
    brname: { type: String, trim: true, default: "" }
  },
  { _id: false }
);

const AccountSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, trim: true, default: "" },
    status: { type: String, trim: true, default: "ACTIVE" },
    branchCode: { type: String, trim: true, default: "RBSUS001" },
    openingDate: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    currency: { type: String, trim: true, default: "USD" },
    balance: { type: Number, default: 0 }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: { type: ProfileSchema, default: () => ({}) },
    account: { type: AccountSchema, default: () => ({}) },
    accountPinHash: { type: String, default: "" },
    transferPinHash: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

