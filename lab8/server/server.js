const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const originalTextPath = path.join(__dirname, "originalText.txt");
const modifiedTextPath = path.join(__dirname, "modifiedText.txt");

const readFileAsync = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf8", (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
};

const writeFileAsync = (filePath, content) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, content, "utf8", (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
};

app.post("/save-text", async (req, res) => {
	const { text, type } = req.body;
	if (!text || !type) {
		return res.status(400).json({ error: "Text and type are required" });
	}

	const filePath = type === "original" ? originalTextPath : modifiedTextPath;

	try {
		await writeFileAsync(filePath, text);
		return res.status(200).json({ message: "Text saved successfully" });
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Failed to save text", details: err.message });
	}
});

app.get("/load-text", async (req, res) => {
	const { type } = req.query;

	if (!type) {
		return res.status(400).json({ error: "Type query parameter is required" });
	}

	const filePath = type === "original" ? originalTextPath : modifiedTextPath;

	try {
		const data = await readFileAsync(filePath);
		return res.status(200).json({ text: data });
	} catch (err) {
		return res
			.status(500)
			.json({ error: `Failed to load ${type} text`, details: err.message });
	}
});

app.post("/modify-text", async (req, res) => {
	const { action } = req.body;
	if (!action) {
		return res.status(400).json({ error: "Action is required" });
	}

	try {
		const originalText = await readFileAsync(originalTextPath);

		const lines = originalText.split("\n").filter((line) => line.trim() !== "");

		let modifiedText = "";

		switch (action) {
			case "even":
				modifiedText = lines.filter((_, index) => index % 2 !== 0).join("\n"); //array's zero index for user is 1 thats why checking vice versa
				break;
			case "odd":
				modifiedText = lines.filter((_, index) => index % 2 === 0).join("\n");
				break;
			case "all":
				modifiedText = lines.join("\n");
				break;
			default:
				return res.status(400).json({ error: "Invalid action" });
		}

		await writeFileAsync(modifiedTextPath, modifiedText);
		res.status(200).json({ message: "Text modified and saved successfully" });
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Failed to modify and save text", details: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
