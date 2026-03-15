class QuizApplication {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"],
                correct: 2
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                correct: 3
            },
            {
                question: "In which year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correct: 1
            },
            {
                question: "What is the smallest prime number?",
                options: ["0", "1", "2", "3"],
                correct: 2
            },
            {
                question: "Which animal is known as the 'King of the Jungle'?",
                options: ["Tiger", "Elephant", "Lion", "Giraffe"],
                correct: 2
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Platinum"],
                correct: 2
            }
        ];

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.answeredQuestions = new Array(this.questions.length).fill(false);
        this.timer = null;
        this.timeLeft = 30;
        this.totalTime = 0;
        this.startTime = null;
        this.timerActive = true; // Flag to control timer
        
        // DOM Elements
        this.startScreen = document.getElementById('start-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        this.startBtn = document.getElementById('start-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.newQuizBtn = document.getElementById('new-quiz-btn');
        
        this.questionElement = document.getElementById('question');
        this.optionsContainer = document.getElementById('options-container');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.progressFill = document.getElementById('progress-fill');
        this.timerElement = document.getElementById('timer');
        
        this.finalScore = document.getElementById('final-score');
        this.correctCount = document.getElementById('correct-count');
        this.incorrectCount = document.getElementById('incorrect-count');
        this.timeTaken = document.getElementById('time-taken');
        this.answersReview = document.getElementById('answers-review');
        
        this.init();
    }
    
    init() {
        // Event Listeners
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.prevBtn.addEventListener('click', () => this.prevQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        this.newQuizBtn.addEventListener('click', () => this.resetToStart());
        
        // Set total questions
        this.totalQuestionsSpan.textContent = this.questions.length;
    }
    
    startQuiz() {
        this.startScreen.classList.remove('active');
        this.quizScreen.classList.add('active');
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers.fill(null);
        this.answeredQuestions.fill(false);
        this.startTime = Date.now();
        this.timerActive = true;
        this.loadQuestion();
    }
    
    loadQuestion() {
        // Clear existing timer
        this.clearTimer();
        
        // Reset timer for new question
        this.timeLeft = 30;
        this.timerActive = true;
        this.updateTimerDisplay();
        
        const question = this.questions[this.currentQuestionIndex];
        this.questionElement.textContent = question.question;
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Generate options
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => this.selectOption(index));
            
            // Check if this option was previously selected
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                button.classList.add('selected');
            }
            
            this.optionsContainer.appendChild(button);
        });
        
        // Update navigation buttons
        this.updateNavButtons();
        
        // Start timer for this question
        this.startTimer();
    }
    
    selectOption(index) {
        // Save user's answer
        this.userAnswers[this.currentQuestionIndex] = index;
        this.answeredQuestions[this.currentQuestionIndex] = true;
        
        // Update UI
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[index].classList.add('selected');
        
        // Update navigation buttons (enable next/finish)
        this.updateNavButtons();
        
        // Timer continues running - we don't stop it here
    }
    
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            if (this.timerActive && this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimerDisplay();
                
                if (this.timeLeft <= 0) {
                    this.handleTimeOut();
                }
            }
        }, 1000);
    }
    
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    stopTimer() {
        this.timerActive = false;
    }
    
    resumeTimer() {
        this.timerActive = true;
    }
    
    updateTimerDisplay() {
        this.timerElement.textContent = `${this.timeLeft}s`;
        
        // Add warning class when time is low
        if (this.timeLeft <= 10) {
            this.timerElement.classList.add('warning');
        } else {
            this.timerElement.classList.remove('warning');
        }
    }
    
    handleTimeOut() {
        // Stop timer when time runs out
        this.stopTimer();
        
        // Auto-mark as incorrect if not answered
        if (this.userAnswers[this.currentQuestionIndex] === null) {
            this.userAnswers[this.currentQuestionIndex] = -1;
            this.answeredQuestions[this.currentQuestionIndex] = true;
            
            // Visual feedback for timeout
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.style.opacity = '0.7';
            });
        }
        
        // Update navigation buttons
        this.updateNavButtons();
        
        // Automatically move to next question after timeout
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.showResults();
            }
        }, 1000);
    }
    
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            // Stop timer for current question before leaving
            this.stopTimer();
            
            // Move to previous question
            this.currentQuestionIndex--;
            
            // Load the question (which will start a new timer)
            this.loadQuestion();
        }
    }
    
    nextQuestion() {
        // Stop timer for current question before leaving
        this.stopTimer();
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }
    
    updateNavButtons() {
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        
        // Check if current question is answered
        const isAnswered = this.answeredQuestions[this.currentQuestionIndex];
        
        // Update next button state and text
        if (this.currentQuestionIndex === this.questions.length - 1) {
            this.nextBtn.textContent = 'Finish';
            // Enable finish button always (even if not answered)
            this.nextBtn.disabled = false;
        } else {
            this.nextBtn.textContent = 'Next';
            // Enable next button always (even if not answered)
            this.nextBtn.disabled = false;
        }
    }
    
    calculateScore() {
        this.score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.questions[index].correct) {
                this.score++;
            }
        });
    }
    
    showResults() {
        this.clearTimer();
        this.stopTimer();
        this.quizScreen.classList.remove('active');
        this.resultsScreen.classList.add('active');
        
        // Calculate total time
        const endTime = Date.now();
        const totalSeconds = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.timeTaken.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Calculate and display score
        this.calculateScore();
        this.finalScore.textContent = this.score;
        
        const correct = this.score;
        const incorrect = this.questions.length - this.score;
        
        this.correctCount.textContent = correct;
        this.incorrectCount.textContent = incorrect;
        
        // Generate review answers
        this.generateReview();
    }
    
    generateReview() {
        this.answersReview.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const questionText = document.createElement('div');
            questionText.className = 'review-question';
            questionText.textContent = `Q${index + 1}: ${question.question}`;
            
            const answerDiv = document.createElement('div');
            answerDiv.className = `review-answer ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const userAnswerText = userAnswer !== -1 && userAnswer !== null 
                ? question.options[userAnswer] 
                : 'Not answered';
            
            const correctAnswer = question.options[question.correct];
            
            answerDiv.innerHTML = `
                <span>Your answer: ${userAnswerText}</span>
                <span>Correct: ${correctAnswer}</span>
            `;
            
            reviewItem.appendChild(questionText);
            reviewItem.appendChild(answerDiv);
            this.answersReview.appendChild(reviewItem);
        });
    }
    
    restartQuiz() {
        this.resultsScreen.classList.remove('active');
        this.quizScreen.classList.add('active');
        this.currentQuestionIndex = 0;
        this.userAnswers.fill(null);
        this.answeredQuestions.fill(false);
        this.startTime = Date.now();
        this.timerActive = true;
        this.loadQuestion();
    }
    
    resetToStart() {
        this.resultsScreen.classList.remove('active');
        this.startScreen.classList.add('active');
        this.currentQuestionIndex = 0;
        this.userAnswers.fill(null);
        this.answeredQuestions.fill(false);
        this.clearTimer();
    }
}

// Initialize the quiz application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApplication();
});