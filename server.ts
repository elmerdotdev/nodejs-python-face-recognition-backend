import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" }); // Temp upload dir

// Allow React frontend
app.use(cors());

app.post("/recognize", upload.array("images", 5), (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!Array.isArray(files) || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return
    }

    const imagePaths = files.map((file) => file.path);
    const pythonCommand = `python3 face_recognizer.py ${imagePaths.join(" ")}`;

    exec(pythonCommand, (error, stdout, stderr) => {
        // Delete uploaded files after face recognition
        files.forEach((file) => fs.unlinkSync(file.path));

        if (error) {
            console.error("Python error:", stderr);
            return res.status(500).json({ error: stderr.trim() });
        }

        try {
            const result = JSON.parse(stdout);
            return res.json({ result });
        } catch (parseError) {
            console.error("JSON error:", parseError);
            return res.status(500).json({ error: "Invalid response from face recognition script" });
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
});