const Image = require('../models/img');

exports.fetchAll = async (req, res, next) => {
    try {
        const allImages = await Image.fetchAll();
        res.status(200).json(allImages);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updatePoints = async (req, res, next) => {
    const imageId = req.params.id;
    const newPoints = req.body.points;
    try {
        const result = await Image.updatePoints(imageId, newPoints);
        if (result) {
            res.status(200).json({ message: 'Points updated successfully' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        next(error);
    }
};

exports.fetchTopTen = async (req, res, next) => {
    try {
        const topTenImages = await Image.fetchTopTen();
        res.status(200).json(topTenImages);
    } catch (error) {
        console.error("Failed to fetch top ten images:", error);
        res.status(500).json({ message: "Failed to fetch top ten images" });
    }
};

exports.fetchTopTenUser = async (req, res, next) => {
    // ไม่สามารถ join กับ account ได้โดยตรง ต้องใช้ aggregate หรือ populate ถ้ามี ref
    // ตัวอย่างนี้จะคืน top ten images เฉย ๆ
    try {
        const topTenImages = await Image.fetchTopTen();
        res.status(200).json(topTenImages);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.onlyone = async (req, res, next) => {
    const id = req.params.id;
    try {
        const allImages = await Image.onlyone(id);
        res.status(200).json(allImages);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.findimage = async (req, res, next) => {
    const id = req.params.id;
    try {
        const image = await Image.findimage(id);
        res.status(200).json(image);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.upload = async (req, res, next) => {
    const { image_url, facemash_id } = req.body;
    try {
        await Image.addImage(image_url, facemash_id);
        res.status(200).json({ message: 'Image successfully added' });
    } catch (error) {
        console.error('Error adding image:', error);
        res.status(500).json({ error: 'Failed to add image' });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const deleteResponse = await Image.delete(req.params.id);
        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.fetchAllUserImg = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const allImages = await Image.fetchAllByUserId(userId);
        res.status(200).json(allImages);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.fetchAllUserDetail = async (req, res, next) => {
    try {
        const facemashId = req.params.facemashId;
        const allImages = await Image.fetchAllByFacemashId(facemashId);
        res.status(200).json(allImages);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.changeImage = async (req, res, next) => {
    const image_id = req.body.image_id;
    const image_url = req.body.image_url;
    try {
        await Image.changeImage(image_url, image_id);
        res.status(200).json({ message: 'image changed successfully.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
