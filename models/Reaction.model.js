const { Schema, model } = require("mongoose");

const reactionSchema = new Schema(
    {
        content: { type: String, required: true },
        user: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);


const Reaction = model("Reaction", reactionSchema);
module.exports = Reaction;