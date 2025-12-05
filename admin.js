    let questions = {};

// ------------------ FETCH EXISTING QUESTIONS ------------------
fetch("questions.json")
    .then(res => res.json())
    .then(data => questions = data)
    .catch(err => {
        console.log("Could not load questions.json, initializing empty structure.");
        questions = { web: [], javascript: [] }; // Default categories
    });

// ------------------ ADD QUESTION ------------------
document.getElementById("add-btn").onclick = () => {
    const cat = document.getElementById("category").value;
    const qText = document.getElementById("question").value.trim();
    const options = [
        document.getElementById("opt1").value.trim(),
        document.getElementById("opt2").value.trim(),
        document.getElementById("opt3").value.trim(),
        document.getElementById("opt4").value.trim()
    ];
    const answerIndex = parseInt(document.getElementById("answer").value);

    if (!qText || options.includes("") || isNaN(answerIndex) || answerIndex < 0 || answerIndex > 3) {
        alert("Please fill all fields correctly!");
        return;
    }

    if (!questions[cat]) questions[cat] = [];

    questions[cat].push({
        question: qText,
        options: options,
        answer: answerIndex
    });

    alert("Question added successfully!");
    clearInputs();
};

// ------------------ DOWNLOAD JSON ------------------
document.getElementById("download-btn").onclick = () => {
    const a = document.createElement("a");
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 4));
    a.download = "questions.json";
    a.click();
};

// ------------------ CLEAR INPUT FIELDS ------------------
function clearInputs() {
    document.getElementById("question").value = "";
    document.getElementById("opt1").value = "";
    document.getElementById("opt2").value = "";
    document.getElementById("opt3").value = "";
    document.getElementById("opt4").value = "";
    document.getElementById("answer").value = "";
}

// ------------------ DARK MODE TOGGLE ------------------
document.getElementById("theme-btn").onclick = () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    document.getElementById("theme-btn").innerText =
        document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
};
