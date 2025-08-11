document.addEventListener('DOMContentLoaded', () => {
    const WORK_MINUTES = 25;
    const SHORT_BREAK_MINUTES = 5;
    const LONG_BREAK_MINUTES = 15;

    let timerInterval = null;
    let secondsRemaining = WORK_MINUTES * 60;
    let sessionCount = 0;
    let isPaused = true;
    let currentSession = 'work'; // 'work', 'shortBreak', 'longBreak'

    const timerDisplay = document.getElementById('timer-display');
    const sessionTitle = document.getElementById('session-title');
    const pomodoroCountDisplay = document.getElementById('pomodoro-count');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const alarmSound = document.getElementById('alarm-sound');
    const body = document.body;

    function updateTimerDisplay() {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `${timerDisplay.textContent} - ${sessionTitle.textContent}`;
    }

    function startTimer() {
        if (isPaused) {
            isPaused = false;
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';

            timerInterval = setInterval(() => {
                secondsRemaining--;
                updateTimerDisplay();

                if (secondsRemaining < 0) {
                    clearInterval(timerInterval);
                    alarmSound.play();
                    switchSession();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        isPaused = true;
        clearInterval(timerInterval);
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }

    function switchSession() {
        if (currentSession === 'work') {
            sessionCount++;
            pomodoroCountDisplay.textContent = sessionCount;
            if (sessionCount % 4 === 0) {
                currentSession = 'longBreak';
                secondsRemaining = LONG_BREAK_MINUTES * 60;
                sessionTitle.textContent = 'Long Break';
                body.className = 'break-session';
            } else {
                currentSession = 'shortBreak';
                secondsRemaining = SHORT_BREAK_MINUTES * 60;
                sessionTitle.textContent = 'Short Break';
                body.className = 'break-session';
            }
        } else {
            currentSession = 'work';
            secondsRemaining = WORK_MINUTES * 60;
            sessionTitle.textContent = 'Work';
            body.className = 'work-session';
        }
        updateTimerDisplay();
        // Automatically start the next session
        isPaused = true; // Reset pause state
        startTimer();
    }

    function resetTimer() {
        pauseTimer();
        currentSession = 'work';
        sessionCount = 0;
        secondsRemaining = WORK_MINUTES * 60;
        pomodoroCountDisplay.textContent = sessionCount;
        sessionTitle.textContent = 'Work';
        body.className = 'work-session';
        updateTimerDisplay();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initial display
    updateTimerDisplay();
});