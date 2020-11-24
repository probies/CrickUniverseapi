const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const notesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        src: {
            type: String,
            trim: true,
            min: 3,
            max: 500,
            required: true
        },
        key: {
            type: String,
            trim: true,
            min: 3,
            max: 50,
            required: true
        },
        mtitle: {
            type: String
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        categories: [{ type: ObjectId, ref: 'Category', required: true }],
        tags: [{ type: ObjectId, ref: 'Tag', required: true }],
        postedBy: {
            type: ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notes', notesSchema);
