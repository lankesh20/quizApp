// ------------------ VARIABLES ------------------
const reviewBox = document.getElementById("review-box");
const reviewData = JSON.parse(localStorage.getItem("reviewData")) || [];

// ------------------ LOAD REVIEW CARDS ------------------
reviewData.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "review-card fade-in";
    card.innerHTML = `
        <h3>Q${i + 1}: ${item.question}</h3>
        <p>Your Answer: <span style="color:${item.isCorrect ? 'green' : 'red'}">
            ${item.selected}
        </span></p>
        <p>Correct Answer: <b>${item.correct}</b></p>
    `;
    reviewBox.appendChild(card);
});

// ------------------ DARK MODE TOGGLE ------------------
document.getElementById("theme-btn").onclick = () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    document.getElementById("theme-btn").innerText =
        document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
};

// ------------------ BACK TO HOME ------------------
function goHome() {
    window.location.href = "index.html";
}
