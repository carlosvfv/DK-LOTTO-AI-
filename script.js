// ========================
// STATISTICAL DATA - Based on Real Danish Lottery Frequencies
// ========================

const lotteryData = {
    lotto: {
        range: 36,
        count: 7,
        // Hot numbers (most frequent historically)
        hot: [21, 36, 11, 12, 15, 33, 18, 24, 7, 28, 31, 14, 9, 23, 6],
        // Cold numbers (less frequent)
        cold: [1, 2, 5, 10, 13, 17, 19, 20, 22, 25, 27, 29, 30, 32, 34, 35],
        name: 'Lotto',
        draw: 'Sábado 20:00'
    },
    vikinglotto: {
        range: 48,
        count: 6,
        vikingRange: 5,
        hot: [15, 28, 42, 11, 33, 21, 38, 7, 44, 19, 27, 31, 9, 18, 24],
        cold: [1, 2, 4, 8, 10, 13, 17, 20, 23, 26, 29, 32, 35, 37, 40, 43, 46, 48],
        name: 'Vikinglotto',
        draw: 'Miércoles 20:00'
    },
    eurojackpot: {
        range: 50,
        count: 5,
        starRange: 12,
        starCount: 2,
        hot: [19, 27, 35, 21, 33, 38, 15, 42, 7, 11, 28, 31, 44, 18, 9],
        cold: [1, 2, 4, 6, 8, 10, 13, 16, 20, 23, 26, 29, 32, 36, 40, 43, 46, 48, 50],
        starHot: [5, 8, 3, 9, 10],
        starCold: [1, 2, 4, 6, 7, 11, 12],
        name: 'Eurojackpot',
        draw: 'Martes/Viernes 20:00'
    }
};


// ========================
// STATE MANAGEMENT
// ========================

// Backend API Configuration
// Backend API Configuration
// DEPLOYMENT: Uncomment the line below for production
const API_BASE_URL = 'https://dtyckxrqyyvcitmityzv.supabase.co/functions/v1';
// const API_BASE_URL = 'http://localhost:3001/api';

let currentGame = 'lotto';
let currentStrategy = 'balanced';
let generatedCount = 0;
let savedCombinations = [];
let lastGenerated = null;
let lastAIAnalysis = null;

// ========================
// DOM ELEMENTS
// ========================

const gameCards = document.querySelectorAll('.game-card');
const strategyButtons = document.querySelectorAll('.strategy-btn');
const generateBtn = document.getElementById('generateBtn');
const counterValue = document.getElementById('counterValue');
const resultsSection = document.getElementById('resultsSection');
const numbersDisplay = document.getElementById('numbersDisplay');
const statsGrid = document.getElementById('statsGrid');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const savedList = document.getElementById('savedList');

// AI Analysis Elements
const aiAnalysisSection = document.getElementById('aiAnalysisSection');
const confidenceFill = document.getElementById('confidenceFill');
const confidenceValue = document.getElementById('confidenceValue');
const aiReasoning = document.getElementById('aiReasoning');
const patternsList = document.getElementById('patternsList');
const aiRecommendation = document.getElementById('aiRecommendation');
const detailedStatsGrid = document.getElementById('detailedStatsGrid');

// Language & Modal Elements
const langButtons = document.querySelectorAll('.lang-btn');
const calculationsModal = document.getElementById('calculationsModal');
const modalClose = document.getElementById('modalClose');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const strategyValue = document.getElementById('strategyValue');

// License & Payment Elements
const licenseModal = document.getElementById('licenseModal');
const licenseModalClose = document.getElementById('licenseModalClose');
const licenseKeyInput = document.getElementById('licenseKeyInput');
const activateKeyBtn = document.getElementById('activateKeyBtn');
const keyError = document.getElementById('keyError');
const stripePaymentLink = document.getElementById('stripePaymentLink');

// Stripe Configuration
const STRIPE_LINK = 'https://buy.stripe.com/TU_LINK_DE_STRIPE_AQUI'; // REPLACE THIS WITH USER LINK
if (stripePaymentLink) stripePaymentLink.href = STRIPE_LINK;

// ========================
// MULTILINGUAL SYSTEM
// ========================

// Load saved language or default to Danish
loadSavedLanguage();

// Update all texts on page load
function updateAllTexts() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    // Update elements with data-i18n-html (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        element.innerHTML = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });

    // Update generate button text if needed
    if (generateBtn) {
        const icon = generateBtn.querySelector('.generate-icon');
        const text = generateBtn.querySelector('.generate-text');
        if (text) text.textContent = t('generateButton');
    }

    // Update strategy display
    if (typeof updateStrategyDisplay === 'function') {
        updateStrategyDisplay();
    }

    // Update dynamic dates (overrides static translations)
    if (typeof updateDrawDates === 'function') {
        updateDrawDates();
    }

    console.log(`✅ UI updated to ${currentLang.toUpperCase()}`);
}

// Language switcher
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== currentLang) {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchLanguage(lang);
        }
    });
});

// Modal controls
if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
        calculationsModal.style.display = 'flex';
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        calculationsModal.style.display = 'none';
    });
}

// Close modal when clicking outside
if (calculationsModal) {
    calculationsModal.addEventListener('click', (e) => {
        if (e.target === calculationsModal) {
            calculationsModal.style.display = 'none';
        }
    });
}

// ========================
// HELPER FUNCTIONS
// ========================

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Generate random number in range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate next draw date
function getNextDrawDate(game) {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, ... 6=Sat
    let targetDays = [];

    // Define draw days (0-6)
    if (game === 'lotto') targetDays = [6]; // Saturday
    if (game === 'vikinglotto') targetDays = [3]; // Wednesday
    if (game === 'eurojackpot') targetDays = [2, 5]; // Tuesday, Friday

    let minDiff = 8;

    // Find closest upcoming draw day
    targetDays.forEach(tDay => {
        let diff = tDay - day;
        // If today is the day but it's past 19:55, move to next week
        if (diff === 0 && (now.getHours() > 19 || (now.getHours() === 19 && now.getMinutes() >= 55))) {
            diff = 7;
        } else if (diff < 0) {
            diff += 7; // Next week
        }
        if (diff < minDiff) minDiff = diff;
    });

    const nextDraw = new Date();
    nextDraw.setDate(now.getDate() + minDiff);

    // Format date localized
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const locale = currentLang === 'da' ? 'da-DK' : 'en-US';
    let dateStr = nextDraw.toLocaleDateString(locale, options);

    // Capitalize first letter (important for Danish)
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    return `${dateStr} - 20:00`;
}

// Update draw date badges in UI
function updateDrawDates() {
    const badges = {
        lotto: document.querySelector('[data-i18n="lottoBadge"]'),
        vikinglotto: document.querySelector('[data-i18n="vikinglottoBadge"]'),
        eurojackpot: document.querySelector('[data-i18n="eurojackpotBadge"]')
    };

    if (badges.lotto) badges.lotto.textContent = getNextDrawDate('lotto');
    if (badges.vikinglotto) badges.vikinglotto.textContent = getNextDrawDate('vikinglotto');
    if (badges.eurojackpot) badges.eurojackpot.textContent = getNextDrawDate('eurojackpot');
}

// Generate numbers based on strategy
function generateNumbers(game, strategy) {
    const config = lotteryData[game];
    let numbers = [];

    switch (strategy) {
        case 'hot':
            // Use hot numbers with some randomness
            numbers = shuffleArray(config.hot).slice(0, config.count);
            break;

        case 'cold':
            // Use cold numbers with some randomness
            numbers = shuffleArray(config.cold).slice(0, config.count);
            break;

        case 'balanced':
            // Mix hot and cold numbers
            const hotCount = Math.ceil(config.count / 2);
            const coldCount = config.count - hotCount;
            const hotNums = shuffleArray(config.hot).slice(0, hotCount);
            const coldNums = shuffleArray(config.cold).slice(0, coldCount);
            numbers = shuffleArray([...hotNums, ...coldNums]);
            break;

        case 'random':
        default:
            // Completely random
            const allNumbers = Array.from({ length: config.range }, (_, i) => i + 1);
            numbers = shuffleArray(allNumbers).slice(0, config.count);
            break;
    }

    // Sort numbers
    numbers.sort((a, b) => a - b);

    // Generate additional numbers if needed
    let result = { main: numbers };

    if (game === 'vikinglotto') {
        result.viking = getRandomInt(1, config.vikingRange);
    }

    if (game === 'eurojackpot') {
        let stars = [];
        if (strategy === 'hot') {
            stars = shuffleArray(config.starHot).slice(0, config.starCount);
        } else if (strategy === 'cold') {
            stars = shuffleArray(config.starCold).slice(0, config.starCount);
        } else if (strategy === 'balanced') {
            const starHot = shuffleArray(config.starHot)[0];
            const starCold = shuffleArray(config.starCold)[0];
            stars = [starHot, starCold];
        } else {
            const allStars = Array.from({ length: config.starRange }, (_, i) => i + 1);
            stars = shuffleArray(allStars).slice(0, config.starCount);
        }
        result.stars = stars.sort((a, b) => a - b);
    }

    return result;
}

// Calculate statistics
function calculateStats(numbers, game, strategy) {
    const config = lotteryData[game];
    const hotCount = numbers.main.filter(n => config.hot.includes(n)).length;
    const coldCount = numbers.main.filter(n => config.cold.includes(n)).length;
    const sum = numbers.main.reduce((a, b) => a + b, 0);
    const avg = (sum / numbers.main.length).toFixed(1);

    const evenCount = numbers.main.filter(n => n % 2 === 0).length;
    const oddCount = numbers.main.length - evenCount;

    return {
        hotCount,
        coldCount,
        sum,
        avg,
        evenCount,
        oddCount
    };
}

// ========================
// DISPLAY FUNCTIONS
// ========================

// ========================
// DISPLAY FUNCTIONS
// ========================

function displayNumbers(numbers, game, strategy) {
    const config = lotteryData[game];
    let html = '';

    // Main numbers
    html += `
        <div class="numbers-group">
            <div class="numbers-label">${t('mainNumbersLabel')}</div>
            <div class="numbers-grid">
                ${numbers.main.map((num, index) => {
        const classes = ['number-ball', 'main'];
        if (strategy === 'hot' && config.hot.includes(num)) classes.push('hot');
        if (strategy === 'cold' && config.cold.includes(num)) classes.push('cold');
        if (strategy === 'balanced') classes.push('balanced');

        return `<div class="${classes.join(' ')}" style="animation-delay: ${index * 0.1}s">${num}</div>`;
    }).join('')}
            </div>
        </div>
    `;

    // Viking number
    if (game === 'vikinglotto') {
        html += `
            <div class="numbers-group">
                <div class="numbers-label">${t('vikingNumberLabel')}</div>
                <div class="numbers-grid">
                    <div class="number-ball viking" style="animation-delay: ${numbers.main.length * 0.1}s">${numbers.viking}</div>
                </div>
            </div>
        `;
    }

    // Star numbers
    if (game === 'eurojackpot') {
        html += `
            <div class="numbers-group">
                <div class="numbers-label">${t('starNumbersLabel')}</div>
                <div class="numbers-grid">
                    ${numbers.stars.map((num, index) =>
            `<div class="number-ball star" style="animation-delay: ${(numbers.main.length + index) * 0.1}s">${num}</div>`
        ).join('')}
                </div>
            </div>
        `;
    }

    numbersDisplay.innerHTML = html;
}

function displayStats(stats, game, strategy) {
    const strategyEmoji = {
        hot: '🔥',
        cold: '❄️',
        balanced: '⚖️',
        random: '🎲',
        ai: '🤖'
    };

    const strategyName = {
        hot: t('strat_hot'),
        cold: t('strat_cold'),
        balanced: t('strat_balanced'),
        random: t('strat_random'),
        ai: t('strat_ai')
    };

    const displayStrategy = strategyName[strategy] || strategy;

    const html = `
        <div class="stat-item">
            <div class="stat-label">${t('strategyLabel')}</div>
            <div class="stat-value">${strategyEmoji[strategy] || '✨'} ${displayStrategy}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">${t('hotColdLabel')}</div>
            <div class="stat-value">${stats.hotCount} / ${stats.coldCount}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">${t('evenOddLabel')}</div>
            <div class="stat-value">${stats.evenCount} / ${stats.oddCount}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">${t('averageLabel')}</div>
            <div class="stat-value">${stats.avg}</div>
        </div>
    `;

    statsGrid.innerHTML = html;
}

// ========================
// AI PREMIUM FUNCTIONS
// ========================

/**
 * Generate numbers using standard local algorithm
 */
function generateStandardNumbers() {
    // Generate numbers
    const numbers = generateNumbers(currentGame, currentStrategy);
    const stats = calculateStats(numbers, currentGame, currentStrategy);

    // Update state
    generatedCount++;
    lastGenerated = {
        numbers,
        game: currentGame,
        strategy: currentStrategy,
        stats,
        timestamp: new Date()
    };

    // Update display
    counterValue.textContent = generatedCount;
    displayNumbers(numbers, currentGame, currentStrategy);
    displayStats(stats, currentGame, currentStrategy);

    // Hide AI analysis section
    aiAnalysisSection.style.display = 'none';

    // Show results section
    resultsSection.classList.add('visible');

    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // Save to localStorage
    localStorage.setItem('lottery-counter', generatedCount);

    // Vibration feedback if available
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

/**
 * Generate numbers using AI Premium (Backend + DeepSeek)
 */
async function generateAIPremiumNumbers() {
    // 1. Check for License Key OR Free Trial
    let licenseKey = localStorage.getItem('lottery-license-key');
    const trialUsed = localStorage.getItem('lottery-trial-used-v2');

    // LOGIC: IF NO KEY AND NO TRIAL USED -> GIVE FREE TRIAL
    if (!licenseKey) {
        if (!trialUsed) {
            // Activate Free Trial Mode
            licenseKey = 'FREE-TRIAL-GIFT';
            localStorage.removeItem('lottery-license-key'); // Ensure no bad key is sent

            // Notify user
            // We can show a toast or just let them be surprised
            // But we mark it as used immediately to prevent abuse on refresh
            localStorage.setItem('lottery-trial-used-v2', 'true');

            // Optional: Alert the user they are using their free shot
            // alert("🎁 ¡Regalo de Bienvenida! Tienes 1 predicción GRATIS.");
        } else {
            // No key and Trial used -> Show Paywall
            licenseModal.style.display = 'flex';
            return;
        }
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span class="generate-icon">🤖</span><span class="generate-text">${t('generatingAI')}</span>`;

    // Setup Loading Steps Container
    const stepsContainer = document.getElementById('aiLoadingSteps');
    stepsContainer.style.display = 'flex';
    stepsContainer.innerHTML = ''; // Clear previous

    const loadingSteps = [
        'loading_frequency',
        'loading_pairs',
        'loading_conditional',
        'loading_chi',
        'loading_gaps',
        'loading_cold',
        'loading_hot',
        'loading_entropy'
    ];

    // Create step elements
    loadingSteps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'step-item';
        div.id = `step-${index}`;
        div.innerHTML = `
            <span class="step-check">${index === 0 ? '🔄' : '○'}</span>
            <span class="step-text">${t(step)}</span>
        `;
        stepsContainer.appendChild(div);
    });

    let currentStep = 0;
    document.getElementById(`step-0`).className = 'step-item active';

    // Animate steps
    const stepInterval = setInterval(() => {
        // Mark current as completed
        if (currentStep < loadingSteps.length) {
            const currentEl = document.getElementById(`step-${currentStep}`);
            if (currentEl) {
                currentEl.className = 'step-item completed';
                currentEl.querySelector('.step-check').textContent = '✅';
            }
        }

        currentStep++;

        // Mark next as active
        if (currentStep < loadingSteps.length) {
            const nextEl = document.getElementById(`step-${currentStep}`);
            if (nextEl) {
                nextEl.className = 'step-item active';
                nextEl.querySelector('.step-check').textContent = '🔄';
            }
        }
    }, 1200); // 1.2s per step

    try {
        // Call backend API
        const response = await fetch(`${API_BASE_URL}/generate-premium`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                game: currentGame,
                strategy: 'ai',
                licenseKey: licenseKey || 'FREE-TRIAL-GIFT' // Force trial key if empty
            })
        });

        // HANDLE LICENSE ERRORS
        if (response.status === 401 || response.status === 403 || response.status === 402) {
            const errData = await response.json();

            // If invalid key, clear it
            if (response.status !== 402) { // 402 is just no credits, key is okay
                localStorage.removeItem('lottery-license-key');
            }

            // Show Modal with Error
            licenseModal.style.display = 'flex';

            let displayError = errData.error || 'Licensfejl (Ukendt årsag)';

            if (errData.code === 'INVALID_KEY') displayError = '❌ Ugyldig licensnøgle. Prøv igen.';
            if (errData.code === 'NO_CREDITS') displayError = '⚠️ Ingen klip tilbage på denne licens.';
            if (errData.code === 'INACTIVE_KEY') displayError = '⛔ Denne licens er deaktiveret.';

            // If it's still the generic error, append the technical detail for debugging
            if (displayError.startsWith('Licensfejl')) {
                displayError += `: ${errData.error} (Code: ${errData.code})`;
            }

            if (keyError) keyError.textContent = displayError;

            throw new Error(errData.error || 'License Invalid');
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Extract numbers from AI response
        const numbers = {
            main: data.numbers || []
        };

        // Add special numbers if needed
        if (currentGame === 'vikinglotto') {
            numbers.viking = getRandomInt(1, lotteryData[currentGame].vikingRange);
        }

        if (currentGame === 'eurojackpot') {
            // Use stars from API if available, otherwise generate random
            if (data.stars && data.stars.length > 0) {
                numbers.stars = data.stars;
            } else if (data.numbers.length > 5) {
                numbers.stars = data.numbers.slice(5, 7);
                numbers.main = data.numbers.slice(0, 5);
            } else {
                // Fallback for stars
                const config = lotteryData.eurojackpot;
                const allStars = Array.from({ length: config.starRange }, (_, i) => i + 1);
                numbers.stars = shuffleArray(allStars).slice(0, config.starCount).sort((a, b) => a - b);
            }
        }

        const stats = calculateStats(numbers, currentGame, 'ai');

        // Update state
        generatedCount++;
        lastGenerated = {
            numbers,
            game: currentGame,
            strategy: 'ai',
            stats,
            timestamp: new Date()
        };

        lastAIAnalysis = data.ai;

        // Update display
        counterValue.textContent = generatedCount;
        displayNumbers(numbers, currentGame, 'ai');
        displayStats(stats, currentGame, 'ai');
        displayAIAnalysis(data);

        // Show results and AI analysis
        resultsSection.classList.add('visible');
        aiAnalysisSection.style.display = 'block';

        // Smooth scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        // Save to localStorage
        localStorage.setItem('lottery-counter', generatedCount);

        // Vibration feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50]);
        }

    } catch (error) {
        console.error('AI Generation Error:', error);

        // Fallback to standard generation
        // Fallback to standard generation
        // alert(`${t('errorConnecting') || 'Connection Error'}\n\nFalling back to local generation...`);
        console.warn('Falling back to local strategy due to AI error');


        currentStrategy = 'balanced';
        strategyButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.strategy === 'balanced');
        });

        generateStandardNumbers();
    } finally {
        // Clear step interval
        clearInterval(stepInterval);

        // Hide steps container after short delay to show completion
        setTimeout(() => {
            document.getElementById('aiLoadingSteps').style.display = 'none';
        }, 1500);

        // Restore button state
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<span class="generate-icon">✨</span><span class="generate-text">${t('generateButton')}</span>`;
    }
}

/**
 * Display AI analysis in the UI
 */
function displayAIAnalysis(data) {
    if (!data.ai) return;

    const ai = data.ai;

    // Update confidence bar
    const confidence = Math.round(ai.confidence * 100);
    confidenceValue.textContent = `${confidence}%`;
    confidenceFill.style.width = `${confidence}%`;
    confidenceFill.style.background = confidence > 70 ?
        'linear-gradient(90deg, #10b981, #059669)' :
        confidence > 40 ?
            'linear-gradient(90deg, #f59e0b, #d97706)' :
            'linear-gradient(90deg, #ef4444, #dc2626)';

    // Update reasoning
    aiReasoning.textContent = ai.reasoning || 'Análisis basado en patrones estadísticos avanzados.';

    // Update patterns
    if (ai.patterns && ai.patterns.length > 0) {
        patternsList.innerHTML = ai.patterns.map(pattern =>
            `<div class="pattern-item">
                <span class="pattern-bullet">📌</span>
                <span class="pattern-text">${pattern}</span>
            </div>`
        ).join('');
    } else {
        patternsList.innerHTML = '<p class="no-patterns">No se detectaron patrones específicos.</p>';
    }

    // Update recommendation
    aiRecommendation.textContent = ai.recommendation || 'Juega responsablemente y con moderación.';

    // Update detailed stats
    if (data.analysis) {
        const analysis = data.analysis;
        detailedStatsGrid.innerHTML = `
            <div class="detail-stat">
                <div class="detail-label">🔥 Top 5 Calientes</div>
                <div class="detail-value">${analysis.hotNumbers.slice(0, 5).join(', ')}</div>
            </div>
            <div class="detail-stat">
                <div class="detail-label">❄️ Top 5 Fríos</div>
                <div class="detail-value">${analysis.coldNumbers.slice(0, 5).join(', ')}</div>
            </div>
            <div class="detail-stat">
                <div class="detail-label">📊 Sorteos Analizados</div>
                <div class="detail-value">${analysis.totalDrawsAnalyzed}</div>
            </div>
            <div class="detail-stat">
                <div class="detail-label">🔗 Pares Comunes</div>
                <div class="detail-value">${analysis.commonPairs.slice(0, 3).map(p => `[${p.numbers.join(',')}]`).join(' ')}</div>
            </div>
        `;
    }
}

// ========================
// EVENT HANDLERS
// ========================

// Update strategy display text
function updateStrategyDisplay() {
    const strategyNames = {
        balanced: t('strat_balanced'),
        hot: t('strat_hot'),
        cold: t('strat_cold'),
        random: t('strat_random'),
        ai: t('strat_ai')
    };

    if (strategyValue) {
        strategyValue.textContent = strategyNames[currentStrategy] || currentStrategy;
    }
}

// Game selection
gameCards.forEach(card => {
    card.addEventListener('click', () => {
        gameCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentGame = card.dataset.game;
    });
});

// Strategy selection
strategyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        strategyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStrategy = btn.dataset.strategy;
        updateStrategyDisplay(); // Update display on change

        // Show/Hide AI Process Info Modal
        const aiProcessInfo = document.getElementById('aiProcessInfo');
        const generateSection = document.querySelector('.generate-section');

        if (aiProcessInfo) {
            if (currentStrategy === 'ai') {
                aiProcessInfo.style.display = 'flex';
                // Fix generate button at bottom of screen above modal
                if (generateSection) {
                    generateSection.style.position = 'fixed';
                    generateSection.style.bottom = '30px';
                    generateSection.style.left = '50%';
                    generateSection.style.transform = 'translateX(-50%)';
                    generateSection.style.zIndex = '10000';
                    generateSection.style.width = 'auto';
                }
            } else {
                aiProcessInfo.style.display = 'none';
                // Reset generate button positioning
                if (generateSection) {
                    generateSection.style.position = '';
                    generateSection.style.bottom = '';
                    generateSection.style.left = '';
                    generateSection.style.transform = '';
                    generateSection.style.zIndex = '';
                    generateSection.style.width = '';
                }
            }
        }
    });
});

// Close AI Process Modal
const aiProcessClose = document.getElementById('aiProcessClose');
if (aiProcessClose) {
    aiProcessClose.addEventListener('click', () => {
        const aiProcessInfo = document.getElementById('aiProcessInfo');
        const generateSection = document.querySelector('.generate-section');

        if (aiProcessInfo) {
            aiProcessInfo.style.display = 'none';
        }
        // Reset generate button positioning
        if (generateSection) {
            generateSection.style.position = '';
            generateSection.style.bottom = '';
            generateSection.style.left = '';
            generateSection.style.transform = '';
            generateSection.style.zIndex = '';
            generateSection.style.width = '';
        }
    });
}

// Close AI modal when clicking outside
const aiProcessModal = document.getElementById('aiProcessInfo');
if (aiProcessModal) {
    aiProcessModal.addEventListener('click', (e) => {
        if (e.target === aiProcessModal) {
            const generateSection = document.querySelector('.generate-section');

            aiProcessModal.style.display = 'none';
            // Reset generate button positioning
            if (generateSection) {
                generateSection.style.position = '';
                generateSection.style.bottom = '';
                generateSection.style.left = '';
                generateSection.style.transform = '';
                generateSection.style.zIndex = '';
                generateSection.style.width = '';
            }
        }
    });
}

// Generate numbers
generateBtn.addEventListener('click', async () => {
    try {
        // Check if AI strategy is selected
        if (currentStrategy === 'ai') {
            await generateAIPremiumNumbers();
        } else {
            generateStandardNumbers();
        }
    } catch (error) {
        console.error('Error generating numbers:', error);
        alert('Error al generar números. Por favor, intenta de nuevo.');
    }
});

// Save combination
saveBtn.addEventListener('click', () => {
    if (!lastGenerated) return;

    const combination = {
        ...lastGenerated,
        id: Date.now(),
        name: `${lotteryData[lastGenerated.game].name} - ${formatDate(lastGenerated.timestamp)}`
    };

    savedCombinations.unshift(combination);
    localStorage.setItem('lottery-saved', JSON.stringify(savedCombinations));

    displaySavedCombinations();

    // Show feedback
    saveBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6L9 17L4 12" stroke-width="2"/>
        </svg>
        ¡Guardado!
    `;

    setTimeout(() => {
        saveBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H15L21 9V19C21 20.1046 20.1046 21 19 21Z" stroke-width="2"/>
                <path d="M7 3V8H15" stroke-width="2"/>
                <path d="M12 11V21" stroke-width="2"/>
            </svg>
            Guardar Combinación
        `;
    }, 2000);
});

// License Modal Logic
if (licenseModalClose) {
    licenseModalClose.addEventListener('click', () => {
        licenseModal.style.display = 'none';
        keyError.textContent = '';
    });
}

// Activate Key Button (Click & Enter)
if (activateKeyBtn) {
    // Basic Click Handler
    activateKeyBtn.addEventListener('click', handleActivation);

    // Enter Key Handler
    if (licenseKeyInput) {
        licenseKeyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleActivation();
            }
        });
    }

    async function handleActivation() {
        const key = licenseKeyInput.value.trim();
        if (!key) return;

        activateKeyBtn.disabled = true;
        activateKeyBtn.textContent = 'Activating...';

        // Optimistic Activation (Skip Check, Validate on Generate)
        setTimeout(() => {
            // Save Key
            localStorage.setItem('lottery-license-key', key);

            // Close modal
            licenseModal.style.display = 'none';
            activateKeyBtn.textContent = 'Activate';
            activateKeyBtn.disabled = false;

            // Clear previous errors
            if (keyError) keyError.textContent = '';

            // Trigger AI Generation (This will validate the key for real)
            generateAIPremiumNumbers();

            // Show toast/alert
            // alert('Key saved! Starting generation...');
        }, 500);
    }
}

// Download PDF
downloadBtn.addEventListener('click', () => {
    if (!lastGenerated) return;

    const text = formatCombinationText(lastGenerated);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loteria-${lotteryData[lastGenerated.game].name}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});

// Share
shareBtn.addEventListener('click', async () => {
    if (!lastGenerated) return;

    const text = formatCombinationText(lastGenerated);

    if (navigator.share) {
        try {
            await navigator.share({
                title: `Mi combinación de ${lotteryData[lastGenerated.game].name}`,
                text: text
            });
        } catch (err) {
            console.log('Error sharing:', err);
            copyToClipboard(text);
        }
    } else {
        copyToClipboard(text);
    }
});

// ========================
// SAVED COMBINATIONS
// ========================

function displaySavedCombinations() {
    if (savedCombinations.length === 0) {
        savedList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No hay combinaciones guardadas</p>
                <p class="empty-hint">Genera y guarda tus combinaciones favoritas</p>
            </div>
        `;
        return;
    }

    const html = savedCombinations.map(combo => `
        <div class="saved-item">
            <div class="saved-item-info">
                <div class="saved-item-title">${combo.name}</div>
                <div class="saved-item-date">${formatDateTime(combo.timestamp)}</div>
                <div class="saved-item-numbers">
                    ${combo.numbers.main.map(n =>
        `<div class="number-ball main">${n}</div>`
    ).join('')}
                    ${combo.numbers.viking ? `<div class="number-ball viking">${combo.numbers.viking}</div>` : ''}
                    ${combo.numbers.stars ? combo.numbers.stars.map(n =>
        `<div class="number-ball star">${n}</div>`
    ).join('') : ''}
                </div>
            </div>
            <div class="saved-item-actions">
                <button class="icon-btn" onclick="loadCombination(${combo.id})" title="Cargar">
                    ↻
                </button>
                <button class="icon-btn delete" onclick="deleteCombination(${combo.id})" title="Eliminar">
                    ✕
                </button>
            </div>
        </div>
    `).join('');

    savedList.innerHTML = html;
}

function loadCombination(id) {
    const combo = savedCombinations.find(c => c.id === id);
    if (!combo) return;

    // Set game and strategy
    currentGame = combo.game;
    currentStrategy = combo.strategy;

    // Update UI
    gameCards.forEach(card => {
        card.classList.toggle('active', card.dataset.game === currentGame);
    });

    strategyButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.strategy === currentStrategy);
    });

    // Display the combination
    lastGenerated = combo;
    displayNumbers(combo.numbers, combo.game, combo.strategy);
    displayStats(combo.stats, combo.game, combo.strategy);
    resultsSection.classList.add('visible');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteCombination(id) {
    savedCombinations = savedCombinations.filter(c => c.id !== id);
    localStorage.setItem('lottery-saved', JSON.stringify(savedCombinations));
    displaySavedCombinations();
}

// ========================
// UTILITY FUNCTIONS
// ========================

function formatDate(date) {
    const d = new Date(date);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return d.toLocaleDateString('es-ES', options);
}

function formatDateTime(date) {
    const d = new Date(date);
    const dateStr = formatDate(d);
    const timeStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} - ${timeStr}`;
}

function formatCombinationText(combo) {
    const config = lotteryData[combo.game];
    let text = `=== ${config.name} ===\n`;
    text += `Generado: ${formatDateTime(combo.timestamp)}\n`;
    text += `Estrategia: ${combo.strategy}\n\n`;
    text += `Números principales: ${combo.numbers.main.join(', ')}\n`;

    if (combo.numbers.viking) {
        text += `Número Viking: ${combo.numbers.viking}\n`;
    }

    if (combo.numbers.stars) {
        text += `Números Estrella: ${combo.numbers.stars.join(', ')}\n`;
    }

    text += `\nEstadísticas:\n`;
    text += `- Calientes/Fríos: ${combo.stats.hotCount}/${combo.stats.coldCount}\n`;
    text += `- Pares/Impares: ${combo.stats.evenCount}/${combo.stats.oddCount}\n`;
    text += `- Promedio: ${combo.stats.avg}\n`;
    text += `\n¡Buena suerte! 🍀`;

    return text;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        shareBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 6L9 17L4 12" stroke-width="2"/>
            </svg>
        `;

        setTimeout(() => {
            shareBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke-width="2"/>
                    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke-width="2"/>
                    <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke-width="2"/>
                    <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke-width="2"/>
                </svg>
            `;
        }, 2000);
    });
}

// ========================
// INITIALIZATION
// ========================

function init() {
    // Apply translations (Danish by default)
    updateAllTexts();
    // Update strategy display
    updateStrategyDisplay();

    // Load counter from localStorage
    const savedCounter = localStorage.getItem('lottery-counter');
    if (savedCounter) {
        generatedCount = parseInt(savedCounter, 10);
        counterValue.textContent = generatedCount;
    }

    // Load saved combinations
    const savedData = localStorage.getItem('lottery-saved');
    if (savedData) {
        try {
            savedCombinations = JSON.parse(savedData);
            displaySavedCombinations();
        } catch (err) {
            console.error('Error loading saved combinations:', err);
            savedCombinations = [];
        }
    }

    // Add keyboard shortcut (Enter to generate)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            generateBtn.click();
        }
    });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
