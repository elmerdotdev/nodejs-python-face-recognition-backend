"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: "uploads/" }); // Temp upload dir
// Allow React frontend
app.use((0, cors_1.default)());
app.post("/recognize", upload.array("images", 5), (req, res, next) => {
    const files = req.files;
    if (!Array.isArray(files) || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
    }
    const imagePaths = files.map((file) => file.path);
    const pythonCommand = `python3 face_recognizer.py ${imagePaths.join(" ")}`;
    (0, child_process_1.exec)(pythonCommand, (error, stdout, stderr) => {
        // Delete uploaded files after face recognition
        files.forEach((file) => fs_1.default.unlinkSync(file.path));
        if (error) {
            console.error("Python error:", stderr);
            return res.status(500).json({ error: stderr.trim() });
        }
        try {
            const result = JSON.parse(stdout);
            return res.json({ result });
        }
        catch (parseError) {
            console.error("JSON error:", parseError);
            return res.status(500).json({ error: "Invalid response from face recognition script" });
        }
    });
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
