let isTextareaValid = false;

function showSaveTextBtn() {
	const saveBtn = document.getElementById("save-text-btn");

	if (isTextareaValid) {
		saveBtn.disabled = false;
	} else {
		saveBtn.disabled = true;
	}
}

function checkLineCount() {
	const textArea = document.getElementById("text-input");
	const lineCountWarning = document.getElementById("line-count-warning");

	const lines = textArea.value.trim().split("\n");

	if (lines.length === 20) {
		lineCountWarning.style.display = "none";
		isTextareaValid = true;
	} else {
		lineCountWarning.style.display = "block";
		isTextareaValid = false;
	}

	showSaveTextBtn();
}

async function saveText(type) {
	const text = document.getElementById("text-input").value;
	const response = await fetch("http://localhost:3000/save-text", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text, type }),
	});
	const result = await response.json();
	alert(result.message);
}

async function modifyText() {
	const action = document.getElementById("modify-option").value;
	const response = await fetch("http://localhost:3000/modify-text", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ action }),
	});
	const result = await response.json();
	alert(result.message);
}

async function loadText(type) {
	const response = await fetch(`http://localhost:3000/load-text?type=${type}`);
	const result = await response.json();
	document.getElementById("output").innerText = result.text;
}

document
	.getElementById("save-text-btn")
	.addEventListener("click", () => saveText("original"));
document
	.getElementById("modify-text-btn")
	.addEventListener("click", modifyText);
document
	.getElementById("load-original-btn")
	.addEventListener("click", () => loadText("original"));
document
	.getElementById("load-modified-btn")
	.addEventListener("click", () => loadText("modified"));

document.getElementById("text-input").addEventListener("input", checkLineCount);
