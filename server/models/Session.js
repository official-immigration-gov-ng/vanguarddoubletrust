const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);

