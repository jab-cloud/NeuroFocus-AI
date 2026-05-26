if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('Service Worker registered');
            
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateToast();
                    }
                });
            });
        }).catch(err => console.log('Service Worker registration failed', err));
    });
}

function showUpdateToast() {
    const toast = document.createElement('div');
    toast.className = 'toast update-toast';
    toast.style.cursor = 'pointer';
    toast.style.backgroundColor = '#2c5282';
    toast.innerHTML = '✨ New version available! Click to update.';
    
    document.getElementById('toast-container').appendChild(toast);
    
    toast.addEventListener('click', () => {
        window.location.reload();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const focusToggle = document.getElementById('focus-toggle');
    const timerDisplay = document.getElementById('timer-display');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');
    const streakEl = document.getElementById('streak-count');
    const scoreEl = document.getElementById('productivity-score');
    const blockInput = document.getElementById('block-input');
    const addBlockBtn = document.getElementById('add-block-btn');
    const blockedList = document.getElementById('blocked-list');
    const challengeDiv = document.getElementById('protection-challenge');
    const mathProblemEl = document.getElementById('math-problem');
    const challengeAnswerEl = document.getElementById('challenge-answer');
    const verifyChallengeBtn = document.getElementById('verify-challenge');
    const toastContainer = document.getElementById('toast-container');
    const safeGuardToggle = document.getElementById('safe-guard-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const goalInput = document.getElementById('goal-input');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalsList = document.getElementById('goals-list');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const customMinutesInput = document.getElementById('custom-minutes-input');
    const applyCustomDurationBtn = document.getElementById('apply-custom-duration-btn');
    const soundToggle = document.getElementById('sound-toggle');
    const pauseToggle = document.getElementById('pause-toggle');
    const analyticsSummaryEl = document.getElementById('analytics-summary');
    const recommendationSummaryEl = document.getElementById('recommendation-summary');
    const recommendationsList = document.getElementById('recommendations-list');
    const refreshRecommendationsBtn = document.getElementById('refresh-recommendations-btn');
    const todaySessionsEl = document.getElementById('today-sessions');
    const weekSessionsEl = document.getElementById('week-sessions');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const lockHoursInput = document.getElementById('lock-hours-input');
    const activateLockBtn = document.getElementById('activate-lock-btn');
    const lockStatusEl = document.getElementById('lock-status');
    const verseReferenceInput = document.getElementById('verse-reference-input');
    const verseTranslationSelect = document.getElementById('verse-translation');
    const getVerseBtn = document.getElementById('get-verse-btn');
    const randomVerseBtn = document.getElementById('random-verse-btn');
    const bibleOutput = document.getElementById('bible-output');
    
    // Verses Database
    const verses = [
        { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23", tags: ["diligence", "work", "focus"] },
        { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13", tags: ["strength", "tired", "motivation"] },
        { text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", ref: "2 Timothy 1:7", tags: ["peace", "mind", "anxiety"] },
        { text: "Let your eyes look straight ahead; fix your gaze directly before you.", ref: "Proverbs 4:25", tags: ["focus", "distracted"] },
        { text: "The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied.", ref: "Proverbs 13:4", tags: ["diligence", "productivity"] },
        { text: "Commit your work to the Lord, and your plans will be established.", ref: "Proverbs 16:3", tags: ["work", "planning"] },
        { text: "Flee from sexual immorality. All other sins a person commits are outside the body, but whoever sins sexually, sins against their own body.", ref: "1 Corinthians 6:18", tags: ["purity"] },
        { text: "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.", ref: "Philippians 4:8", tags: ["purity"] },
        { text: "I made a covenant with my eyes not to look lustfully at a young woman.", ref: "Job 31:1", tags: ["purity"] }
    ];

    // State
    let isFocusMode = false;
    let currentChallenge = null;
    let blockedApps = JSON.parse(localStorage.getItem('blockedApps')) || ['facebook.com', 'youtube.com'];
    let userStats = JSON.parse(localStorage.getItem('userStats')) || { streak: 1, score: 0, lastActiveDate: new Date().toISOString() };
    let isSafeGuardActive = JSON.parse(localStorage.getItem('isSafeGuardActive')) || false;
    let currentTheme = localStorage.getItem('theme') || 'light';
    let isSoundEnabled = JSON.parse(localStorage.getItem('isSoundEnabled')) ?? true;
    let isPaused = false;
    const offlineCoachMode = Boolean(window.FOCUSMIND_CONFIG?.offlineCoachMode);
    const configuredApiBase = (window.FOCUSMIND_CONFIG?.apiBaseUrl || '').trim().replace(/\/+$/, '');
    const aiApiEndpoint = !offlineCoachMode && configuredApiBase
        ? `${configuredApiBase}/ai-chat`
        : '';
    let sessionDurationMinutes = Number(localStorage.getItem('sessionDurationMinutes')) || 25;
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    let focusSessions = JSON.parse(localStorage.getItem('focusSessions')) || [];
    let strictLockUntil = Number(localStorage.getItem('strictLockUntil') || 0);
    let isCoachLoading = false;
    
    // Timer State
    let timerInterval = null;
    let timeLeft = sessionDurationMinutes * 60;
    let isBreak = false;

    // Initialize UI
    safeGuardToggle.checked = isSafeGuardActive;
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (customMinutesInput) {
        customMinutesInput.value = String(sessionDurationMinutes);
    }
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    updateStatsUI();
    renderBlockedList();
    renderGoals();
    renderSessionHistory();
    renderStrictLockStatus();
    renderTimerPresetState();
    renderAnalyticsSummary();
    renderRecommendations();
    updateTimerDisplay();
    updateSoundButton();
    updatePauseButton();
    checkAndUpdateStreak();
    if (offlineCoachMode) {
        addMessage('coach', 'Offline Coach Mode is active. You are using free built-in guidance.');
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', currentTheme);
    });

    // Safe Guard Toggle
    safeGuardToggle.addEventListener('change', () => {
        isSafeGuardActive = safeGuardToggle.checked;
        localStorage.setItem('isSafeGuardActive', JSON.stringify(isSafeGuardActive));
        if (isSafeGuardActive) {
            addMessage('coach', 'AI Safe-Search Guard active. I will now monitor and block restricted content.');
            showToast('Safe-Search Guard Enabled');
        } else {
            addMessage('coach', 'Safe-Search Guard disabled. Be careful out there.');
        }
        renderRecommendations();
    });

    // Sound Toggle
    soundToggle.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('isSoundEnabled', JSON.stringify(isSoundEnabled));
        updateSoundButton();
        showToast(isSoundEnabled ? 'Timer sound enabled' : 'Timer sound muted');
    });

    // Pause Toggle
    pauseToggle.addEventListener('click', () => {
        if (!isFocusMode) {
            showToast('Start Focus Mode before using pause.');
            return;
        }
        isPaused = !isPaused;
        updatePauseButton();
        if (isPaused) {
            stopTimer();
            addMessage('coach', 'Timer paused. Ready when you are.');
        } else {
            startTimer();
            addMessage('coach', 'Timer resumed. Stay focused!');
        }
    });

    presetButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const minutes = Number(button.getAttribute('data-minutes'));
            setSessionDuration(minutes);
        });
    });

    if (applyCustomDurationBtn) {
        applyCustomDurationBtn.addEventListener('click', () => {
            const minutes = Number(customMinutesInput?.value || sessionDurationMinutes);
            setSessionDuration(minutes);
        });
    }

    if (customMinutesInput) {
        customMinutesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const minutes = Number(customMinutesInput.value || sessionDurationMinutes);
                setSessionDuration(minutes);
            }
        });
    }

    // Focus Mode Toggle
    focusToggle.addEventListener('click', () => {
        if (isFocusMode) {
            if (isStrictLockActive()) {
                const remaining = formatDuration(getStrictLockRemainingMs());
                showToast(`Strict Lock active. Remaining: ${remaining}`);
                addMessage('coach', `Strict Lock is active. Keep going for ${remaining} before you can exit Focus Mode.`);
                renderStrictLockStatus();
                return;
            }
            showChallenge();
        } else {
            enterFocusMode();
        }
    });

    function enterFocusMode() {
        isFocusMode = true;
        isBreak = false;
        timeLeft = sessionDurationMinutes * 60;
        focusToggle.textContent = 'Exit Focus Mode';
        focusToggle.classList.add('active');
        focusToggle.setAttribute('aria-pressed', 'true');
        document.body.style.backgroundColor = currentTheme === 'light' ? '#fff5f5' : '#4a2c2c';
        updateTimerDisplay();
        
        const focusVerse = getRandomVerseByTag('focus');
        addMessage('coach', `Focus Mode activated. ${focusVerse.text} (${focusVerse.ref})`);
        showToast(`Motivation: "${focusVerse.text}" - ${focusVerse.ref}`);
        
        startTimer();
        
        userStats.score = Math.min(100, userStats.score + 1);
        saveStats();
    }

    function exitFocusMode() {
        isFocusMode = false;
        focusToggle.textContent = 'Enter Focus Mode';
        focusToggle.classList.remove('active');
        focusToggle.setAttribute('aria-pressed', 'false');
        document.body.style.backgroundColor = ''; 
        challengeDiv.classList.add('hidden');
        addMessage('coach', 'Focus Mode deactivated. Great work! Take a short break.');
        
        stopTimer();
        timeLeft = sessionDurationMinutes * 60;
        isBreak = false;
        updateTimerDisplay();
    }

    // Timer Logic
    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        document.title = `${timerDisplay.textContent} - FocusMind`;
    }

    function startTimer() {
        if (timerInterval || isPaused) return;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                handleTimerComplete();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function updatePauseButton() {
        pauseToggle.textContent = isPaused ? '▶️' : '⏸️';
        pauseToggle.setAttribute('aria-pressed', isPaused.toString());
        pauseToggle.setAttribute('aria-label', isPaused ? 'Resume timer' : 'Pause timer');
        pauseToggle.classList.toggle('paused', isPaused);
    }

    function handleTimerComplete() {
        stopTimer();
        if (!isBreak) {
            isBreak = true;
            timeLeft = 5 * 60;
            addMessage('coach', 'Pomodoro complete! Take a 5-minute break. You earned it.');
            showToast('Time for a break!');
            userStats.score = Math.min(100, userStats.score + 5);
            saveStats();
            logFocusSession('focus');
            playTimerSound();
        } else {
            isBreak = false;
            timeLeft = sessionDurationMinutes * 60;
            addMessage('coach', 'Break over! Ready for another focused session?');
            logFocusSession('break');
            showToast('Back to work!');
            playTimerSound();
        }
        updateTimerDisplay();
        if (isFocusMode) startTimer();
    }

    function setSessionDuration(minutes) {
        const normalized = Math.max(5, Math.min(180, Math.round(Number(minutes) || sessionDurationMinutes)));
        sessionDurationMinutes = normalized;
        localStorage.setItem('sessionDurationMinutes', String(sessionDurationMinutes));
        if (customMinutesInput) {
            customMinutesInput.value = String(sessionDurationMinutes);
        }
        if (!isFocusMode) {
            isBreak = false;
            timeLeft = sessionDurationMinutes * 60;
            updateTimerDisplay();
        }
        renderTimerPresetState();
        renderAnalyticsSummary();
        renderRecommendations();
        if (isFocusMode) {
            showToast(`Saved ${sessionDurationMinutes}-minute session for the next round.`);
        } else {
            showToast(`Timer set to ${sessionDurationMinutes} minutes.`);
        }
    }

    function renderTimerPresetState() {
        presetButtons.forEach((button) => {
            const minutes = Number(button.getAttribute('data-minutes'));
            button.classList.toggle('active', minutes === sessionDurationMinutes);
        });
    }

    function getFocusSessionCounts() {
        const now = new Date();
        const focusOnly = focusSessions.filter((entry) => entry.type === 'focus');
        return {
            today: focusOnly.filter((entry) => isSameLocalDay(new Date(entry.completedAt), now)).length,
            week: focusOnly.filter((entry) => isWithinLast7Days(new Date(entry.completedAt), now)).length
        };
    }

    function renderAnalyticsSummary() {
        if (!analyticsSummaryEl) return;
        const completedGoals = goals.filter((goal) => goal.completed).length;
        const counts = getFocusSessionCounts();
        const goalsText = goals.length > 0
            ? `${completedGoals}/${goals.length} goals completed`
            : 'no goals set yet';
        analyticsSummaryEl.textContent = `Today: ${counts.today} focus session(s), ${goalsText}, ${blockedApps.length} blocker(s), and a ${userStats.streak}-day streak.`;
    }

    function renderRecommendations() {
        if (!recommendationsList || !recommendationSummaryEl) return;

        const counts = getFocusSessionCounts();
        const completedGoals = goals.filter((goal) => goal.completed).length;
        const openGoals = goals.length - completedGoals;
        const recommendations = [];

        if (counts.today === 0) {
            recommendations.push({
                title: 'Start with a short sprint',
                detail: `Use the ${Math.min(sessionDurationMinutes, 25)}-minute timer to build momentum before chasing a longer session.`,
                action: sessionDurationMinutes > 25 ? { type: 'set-timer-25', label: 'Use 25 min now' } : null
            });
        }

        if (goals.length === 0) {
            recommendations.push({
                title: 'Write one clear target',
                detail: 'Add a single top goal before you start. Clear goals reduce drift faster than motivation does.'
            });
        } else if (openGoals > 0) {
            recommendations.push({
                title: 'Finish before adding more',
                detail: `${openGoals} goal(s) are still open. Completing one current target will sharpen the rest of the day.`
            });
        }

        if (!isSafeGuardActive) {
            recommendations.push({
                title: 'Turn on Safe-Search Guard',
                detail: 'Enable it on harder days so your environment supports your focus instead of testing it.',
                action: { type: 'enable-safe-guard', label: 'Enable Guard' }
            });
        }

        if (blockedApps.length < 3) {
            recommendations.push({
                title: 'Block your top distractions',
                detail: 'Add at least three high-risk sites or apps so friction appears before impulse does.',
                action: { type: 'add-suggested-blockers', label: 'Add Suggested Blockers' }
            });
        }

        if (!isStrictLockActive()) {
            recommendations.push({
                title: 'Use a timed lock for deep work',
                detail: 'A 1-hour strict lock is a strong default when willpower feels thin.',
                action: { type: 'enable-strict-lock-1h', label: 'Activate 1h Lock' }
            });
        }

        if (userStats.streak >= 3) {
            recommendations.push({
                title: 'Protect your streak',
                detail: 'You already have momentum. Set tomorrow\'s first task before you stop for the day.'
            });
        }

        if (sessionDurationMinutes > 60) {
            recommendations.push({
                title: 'Trim long sessions if needed',
                detail: 'If resistance is high, step down to 50 minutes and win consistency first.',
                action: { type: 'set-timer-50', label: 'Use 50 min now' }
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                title: 'Keep your current system',
                detail: 'Your setup looks solid right now. Repeat today\'s routine and protect the next session start time.'
            });
        }

        const visibleRecommendations = recommendations.slice(0, 5);
        recommendationSummaryEl.textContent = `Advice based on ${counts.today} session(s) today, a ${userStats.streak}-day streak, ${blockedApps.length} blocker(s), and your current timer settings.`;
        recommendationsList.innerHTML = '';

        visibleRecommendations.forEach((recommendation) => {
            const li = document.createElement('li');
            const title = document.createElement('strong');
            const detail = document.createElement('span');
            title.textContent = recommendation.title;
            detail.textContent = recommendation.detail;
            li.appendChild(title);
            li.appendChild(detail);

            if (recommendation.action?.type && recommendation.action?.label) {
                const actionBtn = document.createElement('button');
                actionBtn.type = 'button';
                actionBtn.className = 'recommendation-action-btn';
                actionBtn.setAttribute('data-action', recommendation.action.type);
                actionBtn.textContent = recommendation.action.label;
                li.appendChild(actionBtn);
            }

            recommendationsList.appendChild(li);
        });
    }

    function runRecommendationAction(actionType) {
        if (!actionType) return;

        if (actionType === 'set-timer-25') {
            setSessionDuration(25);
            return;
        }

        if (actionType === 'set-timer-50') {
            setSessionDuration(50);
            return;
        }

        if (actionType === 'enable-safe-guard') {
            if (!isSafeGuardActive) {
                isSafeGuardActive = true;
                safeGuardToggle.checked = true;
                localStorage.setItem('isSafeGuardActive', JSON.stringify(true));
                addMessage('coach', 'Safe-Search Guard enabled from recommendations.');
                showToast('Safe-Search Guard enabled.');
                renderRecommendations();
            }
            return;
        }

        if (actionType === 'add-suggested-blockers') {
            const suggestions = ['tiktok.com', 'instagram.com', 'youtube.com', 'x.com', 'reddit.com'];
            let added = 0;
            suggestions.forEach((site) => {
                if (!blockedApps.includes(site)) {
                    blockedApps.push(site);
                    added += 1;
                }
            });

            if (added > 0) {
                saveBlockedApps();
                renderBlockedList();
                showToast(`Added ${added} suggested blockers.`);
                addMessage('coach', `Added ${added} recommended blockers to reduce impulse browsing.`);
            } else {
                showToast('Suggested blockers are already in your list.');
            }
            return;
        }

        if (actionType === 'enable-strict-lock-1h') {
            strictLockUntil = Date.now() + (60 * 60 * 1000);
            localStorage.setItem('strictLockUntil', String(strictLockUntil));
            renderStrictLockStatus();
            renderRecommendations();
            showToast('Strict Lock activated for 1 hour.');
            addMessage('coach', 'Strict Lock enabled for 1 hour from recommendations.');
        }
    }

    // Goals Logic
    addGoalBtn.addEventListener('click', () => {
        const text = goalInput.value.trim();
        if (text && goals.length < 3) {
            goals.push({ text, completed: false });
            goalInput.value = '';
            saveGoals();
            renderGoals();
        }
    });

    function renderGoals() {
        goalsList.innerHTML = '';
        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            li.className = goal.completed ? 'completed' : '';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = goal.completed;
            checkbox.setAttribute('data-index', index);
            
            const span = document.createElement('span');
            span.textContent = goal.text;
            
            const btn = document.createElement('button');
            btn.className = 'remove-block';
            btn.setAttribute('data-index', index);
            btn.style.marginLeft = 'auto';
            btn.textContent = '×';
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(btn);
            goalsList.appendChild(li);
        });
    }

    goalsList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = e.target.getAttribute('data-index');
            goals[index].completed = e.target.checked;
            if (goals[index].completed) {
                showToast('Goal achieved! Great job.');
                userStats.score = Math.min(100, userStats.score + 2);
                saveStats();
            }
            saveGoals();
            renderGoals();
        }
    });

    goalsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-block')) {
            const index = e.target.getAttribute('data-index');
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        }
    });

    // Protection Challenge
    function generateChallenge() {
        const difficulty = Math.random();
        let a, b, op, answer;
        
        if (difficulty < 0.4) {
            // Addition: easier
            a = Math.floor(Math.random() * 15) + 1;
            b = Math.floor(Math.random() * 15) + 1;
            op = '+';
            answer = a + b;
        } else if (difficulty < 0.7) {
            // Subtraction: medium
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 10) + 1;
            op = '−';
            answer = a - b;
        } else {
            // Multiplication: harder
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            op = '×';
            answer = a * b;
        }
        
        return { a, b, op, answer, problem: `${a} ${op} ${b}` };
    }
    
    function showChallenge() {
        const challenge = generateChallenge();
        currentChallenge = challenge.answer;
        mathProblemEl.textContent = `${challenge.problem} = ?`;
        challengeDiv.classList.remove('hidden');
        challengeAnswerEl.value = '';
        challengeAnswerEl.focus();
    }

    verifyChallengeBtn.addEventListener('click', () => {
        if (isStrictLockActive()) {
            const remaining = formatDuration(getStrictLockRemainingMs());
            addMessage('coach', `Strict Lock is active. Exit is blocked for ${remaining}.`);
            showToast(`Strict Lock active: ${remaining} left`);
            renderStrictLockStatus();
            return;
        }

        if (parseInt(challengeAnswerEl.value) === currentChallenge) {
            exitFocusMode();
        } else {
            addMessage('coach', "Wrong answer! I'm keeping Focus Mode active to protect your productivity.");
            showChallenge();
        }
    });

    // App Blocker
    addBlockBtn.addEventListener('click', () => {
        const app = blockInput.value.trim();
        if (app && !blockedApps.includes(app)) {
            blockedApps.push(app);
            saveBlockedApps();
            renderBlockedList();
            blockInput.value = '';
        }
    });

    function renderBlockedList() {
        blockedList.innerHTML = '';
        blockedApps.forEach((app, index) => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = app;
            const btn = document.createElement('button');
            btn.className = 'remove-block';
            btn.setAttribute('data-index', index);
            btn.setAttribute('aria-label', `Remove ${app}`);
            btn.textContent = '×';
            li.appendChild(span);
            li.appendChild(btn);
            blockedList.appendChild(li);
        });
    }

    blockedList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-block')) {
            const index = e.target.getAttribute('data-index');
            blockedApps.splice(index, 1);
            saveBlockedApps();
            renderBlockedList();
        }
    });

    if (activateLockBtn) {
        activateLockBtn.addEventListener('click', () => {
            const hours = Number(lockHoursInput?.value || 24);
            if (!Number.isFinite(hours) || hours < 1 || hours > 168) {
                showToast('Set lock duration between 1 and 168 hours.');
                return;
            }
            strictLockUntil = Date.now() + (hours * 60 * 60 * 1000);
            localStorage.setItem('strictLockUntil', String(strictLockUntil));
            renderStrictLockStatus();
            renderRecommendations();
            addMessage('coach', `Strict Lock enabled for ${hours} hour(s). Stay focused and finish strong.`);
            showToast(`Strict Lock enabled for ${hours} hour(s).`);
        });
    }

    function getStrictLockRemainingMs() {
        return Math.max(0, strictLockUntil - Date.now());
    }

    function isStrictLockActive() {
        return getStrictLockRemainingMs() > 0;
    }

    function formatDuration(ms) {
        const totalMinutes = Math.ceil(ms / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours <= 0) return `${minutes}m`;
        return `${hours}h ${minutes}m`;
    }

    function renderStrictLockStatus() {
        if (!lockStatusEl) return;
        const remaining = getStrictLockRemainingMs();
        if (remaining <= 0) {
            lockStatusEl.textContent = 'No active lock.';
            strictLockUntil = 0;
            localStorage.removeItem('strictLockUntil');
            renderRecommendations();
            return;
        }
        lockStatusEl.textContent = `Strict Lock active. Exit is blocked for ${formatDuration(remaining)}.`;
    }

    setInterval(() => {
        if (isStrictLockActive()) {
            renderStrictLockStatus();
        }
    }, 30000);

    // AI Coach Chat
    const handleSendMessage = () => {
        const text = chatInput.value.trim().toLowerCase();
        if (text) {
            addMessage('user', text);
            chatInput.value = '';
            isCoachLoading = true;
            addMessage('coach', '💭 Thinking...');
            
            setTimeout(() => {
                const messages = chatWindow.querySelectorAll('.message.coach');
                if (messages.length > 0 && messages[messages.length - 1].textContent === '💭 Thinking...') {
                    messages[messages.length - 1].remove();
                }
                isCoachLoading = false;

                const restrictedKeywords = ['porn', 'sex', 'adult', 'pussy', 'nude'];
                const containsRestricted = restrictedKeywords.some(kw => text.includes(kw));

                if (containsRestricted) {
                    const relevantVerse = getRandomVerseByTag('purity');
                    const response = `I'm sorry, I cannot discuss that. Focus on what is pure and good. "${relevantVerse.text}" (${relevantVerse.ref})`;
                    addMessage('coach', response);
                    return;
                }

                if (aiApiEndpoint) {
                    fetchAiResponse(text).then(aiResponse => {
                        if (aiResponse) {
                            addMessage('coach', aiResponse);
                        } else {
                            addMessage('coach', getFallbackResponse(text));
                        }
                    }).catch(() => {
                        addMessage('coach', getFallbackResponse(text));
                    });
                } else {
                    addMessage('coach', getFallbackResponse(text));
                }
            }, 800);
        }
    };

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    if (getVerseBtn) {
        getVerseBtn.addEventListener('click', loadRequestedPassage);
    }

    if (verseReferenceInput) {
        verseReferenceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadRequestedPassage();
        });
    }

    if (randomVerseBtn) {
        randomVerseBtn.addEventListener('click', loadRandomVerse);
    }

    if (refreshRecommendationsBtn) {
        refreshRecommendationsBtn.addEventListener('click', () => {
            renderAnalyticsSummary();
            renderRecommendations();
            showToast('Recommendations refreshed.');
        });
    }

    if (recommendationsList) {
        recommendationsList.addEventListener('click', (e) => {
            const actionButton = e.target.closest('.recommendation-action-btn');
            if (!actionButton) return;
            runRecommendationAction(actionButton.getAttribute('data-action'));
        });
    }

    async function loadRequestedPassage() {
        const reference = verseReferenceInput?.value?.trim();
        const translation = (verseTranslationSelect?.value || 'kjv').toLowerCase();
        if (!reference) {
            showToast('Enter a Bible reference first.');
            return;
        }
        setBibleOutput('Loading passage...');
        try {
            const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${encodeURIComponent(translation)}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Unable to fetch this reference.');
            }
            const data = await res.json();
            const heading = `${data.reference || reference} (${String(data.translation_name || translation).toUpperCase()})`;
            const text = (data.text || '').trim();
            setBibleOutput(`${heading}\n\n${text}`);
        } catch (err) {
            console.warn('Bible lookup failed', err);
            setBibleOutput('Unable to load passage right now. Check your reference and internet connection.');
        }
    }

    async function loadRandomVerse() {
        const translation = (verseTranslationSelect?.value || 'kjv').toLowerCase();
        setBibleOutput('Loading random verse...');
        try {
            const url = `https://bible-api.com/data/${encodeURIComponent(translation)}/random`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Unable to fetch random verse');
            }
            const data = await res.json();
            const ref = data.reference || `${data.book_name || data.book || 'Bible'} ${data.chapter || ''}:${data.verse || ''}`.trim();
            const text = (data.text || '').trim();
            setBibleOutput(`${ref} (${translation.toUpperCase()})\n\n${text}`);
        } catch (err) {
            console.warn('Random verse failed', err);
            setBibleOutput('Unable to load a random verse right now.');
        }
    }

    function setBibleOutput(text) {
        if (!bibleOutput) return;
        bibleOutput.textContent = text;
    }

    function getFallbackResponse(text) {
        let response = "";
        let relevantVerse = null;

        if (text.includes('tired') || text.includes('weak')) {
            relevantVerse = getRandomVerseByTag('strength');
        } else if (text.includes('distracted') || text.includes('focus')) {
            relevantVerse = getRandomVerseByTag('focus');
        } else if (text.includes('lazy') || text.includes('work')) {
            relevantVerse = getRandomVerseByTag('diligence');
        } else if (text.includes('stress') || text.includes('anxious')) {
            relevantVerse = getRandomVerseByTag('peace');
        }

        if (relevantVerse) {
            response = `I understand. Remember this: "${relevantVerse.text}" (${relevantVerse.ref})`;
        } else {
            const coachResponses = [
                "You're doing great! Keep it up.",
                "Remember your goal: a focused mind is a happy mind.",
                "Need a break? A 5-minute walk can recharge your dopamine levels naturally.",
                "I'm here to keep you accountable. What's your next task?"
            ];
            response = coachResponses[Math.floor(Math.random() * coachResponses.length)];
        }

        return response;
    }

    async function fetchAiResponse(message) {
        if (!aiApiEndpoint) return null;
        try {
            const res = await fetch(aiApiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            return data.response || null;
        } catch (err) {
            console.warn('AI fetch failed', err);
            return null;
        }
    }

    // Helpers
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        if (sender === 'coach' && text.includes('Thinking...')) {
            msgDiv.classList.add('thinking');
        }
        msgDiv.textContent = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function updateStatsUI() {
        streakEl.textContent = `🔥 ${userStats.streak} Day Streak`;
        scoreEl.textContent = `📈 Score: ${userStats.score}`;
    }

    function saveStats() {
        localStorage.setItem('userStats', JSON.stringify(userStats));
        updateStatsUI();
        renderAnalyticsSummary();
        renderRecommendations();
    }

    function saveBlockedApps() {
        localStorage.setItem('blockedApps', JSON.stringify(blockedApps));
        renderAnalyticsSummary();
        renderRecommendations();
    }

    function saveGoals() {
        localStorage.setItem('goals', JSON.stringify(goals));
        renderAnalyticsSummary();
        renderRecommendations();
    }

    function saveSessions() {
        localStorage.setItem('focusSessions', JSON.stringify(focusSessions));
        renderAnalyticsSummary();
        renderRecommendations();
    }

    function logFocusSession(type) {
        const session = {
            type,
            completedAt: new Date().toISOString()
        };
        focusSessions.unshift(session);
        if (focusSessions.length > 50) {
            focusSessions = focusSessions.slice(0, 50);
        }
        saveSessions();
        renderSessionHistory();
    }

    function isSameLocalDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    function isWithinLast7Days(date, now) {
        const diffMs = now - date;
        return diffMs >= 0 && diffMs <= (7 * 24 * 60 * 60 * 1000);
    }

    function renderSessionHistory() {
        if (!todaySessionsEl || !weekSessionsEl || !historyList) return;

        const now = new Date();
        const focusOnly = focusSessions.filter((entry) => entry.type === 'focus');
        const todayCount = focusOnly.filter((entry) => isSameLocalDay(new Date(entry.completedAt), now)).length;
        const weekCount = focusOnly.filter((entry) => isWithinLast7Days(new Date(entry.completedAt), now)).length;

        todaySessionsEl.textContent = String(todayCount);
        weekSessionsEl.textContent = String(weekCount);

        historyList.innerHTML = '';
        if (focusOnly.length === 0) {
            const emptyRow = document.createElement('li');
            emptyRow.textContent = 'No completed focus sessions yet.';
            historyList.appendChild(emptyRow);
            return;
        }

        focusOnly.slice(0, 10).forEach((entry) => {
            const li = document.createElement('li');
            const date = new Date(entry.completedAt);
            li.textContent = `Completed focus session on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            historyList.appendChild(li);
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            focusSessions = [];
            saveSessions();
            renderSessionHistory();
            showToast('Focus history cleared.');
        });
    }

    function updateSoundButton() {
        soundToggle.textContent = isSoundEnabled ? '🔔' : '🔕';
        soundToggle.setAttribute('aria-pressed', isSoundEnabled.toString());
        soundToggle.setAttribute('aria-label', isSoundEnabled ? 'Mute timer sound' : 'Enable timer sound');
    }

    function playTimerSound() {
        if (!isSoundEnabled || typeof window.AudioContext === 'undefined') return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.01);
            oscillator.connect(gain).connect(audioCtx.destination);
            oscillator.start();
            oscillator.frequency.setValueAtTime(660, audioCtx.currentTime + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (err) {
            console.warn('Audio alert failed', err);
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 7000);
    }
    
    function checkAndUpdateStreak() {
        const lastDateStr = localStorage.getItem('lastActiveDate');
        const lastDate = lastDateStr ? new Date(lastDateStr) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!lastDate) {
            userStats.streak = 1;
        } else {
            const lastDateNorm = new Date(lastDate);
            lastDateNorm.setHours(0, 0, 0, 0);
            const diffMs = today - lastDateNorm;
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            
            if (diffDays === 1) {
                userStats.streak++; // Consecutive day
            } else if (diffDays > 1) {
                userStats.streak = 1; // Streak broken, restart
            }
        }
        
        userStats.lastActiveDate = today.toISOString();
        saveStats();
    }

    function getRandomVerseByTag(tag) {
        const filtered = verses.filter(v => v.tags.includes(tag));
        return filtered[Math.floor(Math.random() * filtered.length)];
    }
});
