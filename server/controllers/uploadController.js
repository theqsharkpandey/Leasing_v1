const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });

// Cloudinary errors are plain objects, not always Error instances.
// They may carry the message in different places depending on the SDK/error type.
function cloudinaryMsg(err) {
  return (
    (typeof err === "string" && err) ||
    err?.message ||
    err?.error?.message ||
    (err?.http_code ? `Cloudinary error (HTTP ${err.http_code})` : null) ||
    "Upload failed – please try again"
  );
}

exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res
        .status(400)
        .json({ error: "No files uploaded. Check file type or size." });
    const urls = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: "leasing-world/properties",
          resource_type: "auto",
          transformation: [
            { width: 1200, height: 800, crop: "limit", quality: "auto" },
          ],
        }),
      ),
    );
    res.json({ urls });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: cloudinaryMsg(err) });
  }
};

exports.getVideoUploadParams = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "leasing-world/videos";
  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET,
  );
  res.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
};

exports.uploadVideos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res
        .status(400)
        .json({ error: "No video files uploaded. Check file type or size." });
    const urls = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: "leasing-world/videos",
          resource_type: "video",
        }),
      ),
    );
    res.json({ urls });
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ error: cloudinaryMsg(err) });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res
        .status(400)
        .json({ error: "No documents uploaded. Only PDF files allowed." });
    const urls = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: "leasing-world/documents",
          resource_type: "raw",
          format: "pdf",
        }),
      ),
    );
    res.json({ urls });
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: cloudinaryMsg(err) });
  }
};
