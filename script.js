// ------------------ VARIABLES ------------------
let quizData = {};
let currentCategory = "";
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let timer;
let timeLeft = 15;
let reviewArray = [];

// Sound effects
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const clickSound = document.getElementById("click-sound");

// ------------------ FETCH QUESTIONS ------------------
fetch("questions.json")
    .then(res => res.json())
    .then(data => quizData = data);

// ------------------ CATEGORY SELECTION ------------------
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => {
        clickSound.play();
        currentCategory = btn.dataset.cat;
        quizData[currentCategory] = shuffleArray(quizData[currentCategory]);

        document.getElementById("category-box").style.display = "none";
        document.getElementById("quiz-box").style.display = "block";

        currentQuestion = 0;
        score = 0;
        reviewArray = [];

        loadQuestion();
        startTimer();
        updateProgressBar();
    };
});

// ------------------ SHUFFLE FUNCTION ------------------
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ------------------ LOAD QUESTION ------------------
function loadQuestion() {
    const box = document.getElementById("quiz-box");
    box.classList.remove("fade-in");
    box.classList.add("fade-out");

    setTimeout(() => {
        box.classList.remove("fade-out");
        box.classList.add("fade-in");

        const q = quizData[currentCategory][currentQuestion];
        const optionButtons = document.querySelectorAll(".option-btn");
        const nextBtn = document.getElementById("next-btn");

        nextBtn.disabled = true;
        selectedOption = null;
        timeLeft = 15;
        document.getElementById("time").innerText = timeLeft;

        document.getElementById("question").innerText = q.question;

        optionButtons.forEach((btn, index) => {
            btn.innerText = q.options[index];
            btn.classList.remove("selected");
            btn.onclick = () => selectOption(btn, index);
        });

        updateProgressBar();
    }, 300);
}

// ------------------ TIMER ------------------
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoNext();
        }
    }, 1000);
}

// ------------------ AUTO NEXT IF TIMEOUT ------------------
function autoNext() {
    saveReview(null);
    nextQuestion();
}

// ------------------ SELECT OPTION ------------------
function selectOption(button, index) {
    selectedOption = index;
    document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    clickSound.play();

    document.getElementById("next-btn").disabled = false;
}

// ------------------ NEXT BUTTON ------------------
document.getElementById("next-btn").onclick = () => {
    clearInterval(timer);
    saveReview(selectedOption);
    nextQuestion();
};

// ------------------ SAVE REVIEW ------------------
function saveReview(selected) {
    const q = quizData[currentCategory][currentQuestion];
    reviewArray.push({
        question: q.question,
        options: q.options,
        selected: selected !== null ? q.options[selected] : "No Answer",
        correct: q.options[q.answer],
        isCorrect: selected === q.answer
    });

    if (selected === q.answer) score++;
}

// ------------------ MOVE TO NEXT QUESTION ------------------
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData[currentCategory].length) {
        loadQuestion();
        startTimer();
    } else {
        showScore();
    }
}

// ------------------ UPDATE PROGRESS BAR ------------------
function updateProgressBar() {
    let total = quizData[currentCategory].length;
    let percent = (currentQuestion / total) * 100;
    document.getElementById("progress-bar").style.width = percent + "%";
}

// ------------------ SHOW SCORE ------------------
function showScore() {
    clearInterval(timer);

    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("score-section").style.display = "block";

    document.getElementById("score").innerText =
        `Your Score: ${score} / ${quizData[currentCategory].length}`;

    // Save attempt to localStorage
    let attempts = JSON.parse(localStorage.getItem("attempts")) || [];
    attempts.push({
        category: currentCategory,
        score: score,
        total: quizData[currentCategory].length,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("attempts", JSON.stringify(attempts));

    // Save review data for review page
    localStorage.setItem("reviewData", JSON.stringify(reviewArray));

    // Save to leaderboard
    saveToLeaderboard(score);
}

// ------------------ SAVE TO LEADERBOARD ------------------
function saveToLeaderboard(score) {
    let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
    board.push({ score: score, date: new Date().toLocaleString() });
    board.sort((a,b) => b.score - a.score);
    board = board.slice(0,5); // Top 5
    localStorage.setItem("leaderboard", JSON.stringify(board));
}

// ------------------ LEADERBOARD PAGE ------------------
document.getElementById("leaderboard-btn").onclick = () => {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
    board.forEach(item => {
        let li = document.createElement("li");
        li.innerText = `${item.score} points — ${item.date}`;
        list.appendChild(li);
    });

    document.getElementById("score-section").style.display = "none";
    document.getElementById("leaderboard").style.display = "block";
};

// ------------------ REVIEW BUTTON ------------------
document.getElementById("review-btn").onclick = () => {
    window.location.href = "review.html";
};

// ------------------ RESTART QUIZ ------------------
document.getElementById("restart-btn").onclick = () => {
    location.reload();
};

// ------------------ DARK MODE TOGGLE ------------------
document.getElementById("theme-btn").onclick = () => {
    clickSound.play();

    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    document.getElementById("theme-btn").innerText =
        document.body.classList.contains("dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
};
