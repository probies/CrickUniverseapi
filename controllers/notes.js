const Notes = require('../models/notes');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, key ,src , categories, tags } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!src || !src.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!key || !key.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }

        let notes = new Notes();
        notes.title = title;
        notes.key = key;
        notes.src = src;
        notes.slug = slugify(title).toLowerCase();
        notes.mtitle = `${title} | ${process.env.APP_NAME}`;
        notes.postedBy = req.user._id;
        // categories and tags
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            notes.photo.data = fs.readFileSync(files.photo.path);
            notes.photo.contentType = files.photo.type;
        }

        notes.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(result);
            Notes.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
                (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    } else {
                        Notes.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                            (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler(err)
                                    });
                                } else {
                                    res.json(result);
                                }
                            }
                        );
                    }
                }
            );
        });
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Notes.findOne({ slug })
        // .select("-photo")
        
        .populate('postedBy', '_id name username')
        .select('_id title slug mtitle categories key src tags postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Notes.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Blog deleted successfully'
        });
    });
};


exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Notes.findOne({ slug })
        .select('photo')
        .exec((err, Notes) => {
            if (err || !Notes) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', Notes.photo.contentType);
            return res.send(Notes.photo.data);
        });
};

