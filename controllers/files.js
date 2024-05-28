const processFile = require('../middlewares/processFile')
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "syc-databases.json" });
const bucket = storage.bucket("databases");
const fs = require("fs");

const uploadFile = async (req, res, next) => {
    const bucket = storage.bucket("csaavedra_databases_backups");
    try {
        await processFile(req, res, next);
        let file = req.file;

        if (!req.file) {
            //create a example txt file
            const exampleTxt = "Hello World!";
            fs.writeFileSync("example.txt", exampleTxt);
            req.file = {
                originalname: "example.txt",
                buffer: fs.readFileSync("example.txt"),
            };
        }

        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on("error", (err) => {
            res.status(500).send({ message: err.message });
        });

        blobStream.on("finish", async (data) => {
            // Create URL for directly file access via HTTP.
            const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );

            try {
                // Make the file public
                await bucket.file(req.file.originalname).makePublic();
            } catch {
                return res.status(500).send({
                    message:
                        `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
                    url: publicUrl,
                });
            }

            res.status(200).send({
                message: "Uploaded the file successfully: " + req.file.originalname,
                url: publicUrl,
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = async (req, res, next) => {
    const bucketName = req.params.name || "databases";
    const bucket = storage.bucket(bucketName);
    try {
        const [files] = await bucket.getFiles();
        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file.name,
                url: file.metadata.mediaLink,
                updated: file.metadata.updated,
                metadata: file.metadata,

            });
        });

        res.status(200).send(fileInfos);
    } catch (err) {
        res.status(500).send({
            message: "Unable to read list of files!",
        });
    }
};

const downloadFile = async (req, res, next) => {
    let bucketName = req.params.bucket;
    const bucket = storage.bucket(bucketName);

    try {
        const [metaData] = await bucket.file(req.params.name).getMetadata();
        res.redirect(metaData.mediaLink);

    } catch (err) {
        res.status(500).send({
            message: "Could not download the file. " + err,
        });
    }
};

const deleteFile = async (req, res, next) => {
    try {
        await bucket.file(req.params.name).delete();

        res.status(200).send({
            message: "Deleted the file successfully: " + req.params.name,
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete the file. " + err,
        });
    }
};

const createBucket = async (req, res, next) => {
    let bucketName = req.params.name;
    try {
        await storage.createBucket(bucketName);
        res.status(200).send({
            message: "Bucket created successfully!",
        });
    } catch (err) {
        res.status(500).send({
            message: "Could not create the bucket. " + err,
        });
    }
};

const filesController = {
    uploadFile,
    getListFiles,
    downloadFile,
    deleteFile,
    createBucket,
};

module.exports = filesController;