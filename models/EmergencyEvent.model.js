const { Schema, model } = require("mongoose");

const emergencyEventSchema = new Schema(
    {
        user: [{ type: Schema.Types.ObjectId, ref: "User" }],
        imageUrl: { type: String },
        location: { type: String },
        geolocation_lat: { type: String },
        geolocation_lng: { type: String },
        typeOfEmergency: { type: String },
        description: { type: String },
        status: { type: String },
        reaction: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
    },
    {
        timestamps: true,
    }
);

const EmergencyEvent = model("EmergencyEvent", emergencyEventSchema);
module.exports = EmergencyEvent;