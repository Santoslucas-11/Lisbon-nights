const { Schema, model } = require('mongoose');

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: false,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        contact: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        picture_url: {
            type: String,
            default: "",
        },

        author: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
    },

    { timestamps: true }

);

const Event = model('Event', eventSchema);

module.exports = Event;