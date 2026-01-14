// ========================
// MULTILINGUAL TRANSLATIONS
// Danish & English
// ========================

const translations = {
    da: {
        // Header
        appTitle: 'Danish Lottery Pro',
        appSubtitle: 'Intelligent Nummergenerator',

        // Game Selection
        selectGame: 'Vælg dit spil',
        lotto: 'Lotto',
        lottoDesc: '7 numre (1-36)',
        lottoBadge: 'Lørdag 20:00',
        vikinglotto: 'Vikinglotto',
        vikinglottoDesc: '6 numre (1-48) + Viking',
        vikinglottoBadge: 'Onsdag 20:00',
        eurojackpot: 'Eurojackpot',
        eurojackpotDesc: '5 numre (1-50) + 2 stjerner',
        eurojackpotBadge: 'Tirsdag/Fredag 20:00',

        // Strategy Selection
        selectStrategy: 'Genereringsstrategi',
        balanced: 'Balanceret',
        balancedDesc: 'Mix varme/kolde',
        hotNumbers: 'Varme Numre',
        hotNumbersDesc: 'Mest hyppige',
        coldNumbers: 'Kolde Numre',
        coldNumbersDesc: 'Mindst hyppige',
        random: 'Tilfældig',
        randomDesc: '100% Tilfældig',
        aiPremium: 'AI Premium',
        aiPremiumDesc: 'Neural AI + Analyse',
        premiumBadge: '✨ PRO',

        // Generate Section
        generateButton: 'Generer Numre',
        generatingAI: 'Analyserer med AI...',
        combinationsGenerated: 'Kombinationer genereret:',

        // Results Section
        yourCombination: 'Din Kombination',
        mainNumbers: 'Hovedtal',
        vikingNumber: 'Viking-nummer',
        starNumbers: 'Stjernenumre',

        // Display Labels (Missing keys fixed)
        mainNumbersLabel: 'Hovedtal',
        vikingNumberLabel: 'Viking-nummer',
        starNumbersLabel: 'Stjernenumre',

        // Stats Labels
        strategyLabel: 'Strategi',
        hotColdLabel: 'Varme / Kolde',
        evenOddLabel: 'Lige / Ulige',
        averageLabel: 'Gennemsnit',

        // Strategy Names
        strat_balanced: 'Balanceret',
        strat_hot: 'Varme Numre',
        strat_cold: 'Kolde Numre',
        strat_random: 'Tilfældig',
        strat_ai: 'AI Premium',

        // Strategy Info
        currentStrategy: 'Aktiv Strategi',
        learnMore: 'Lær mere',

        // Stats
        strategy: 'Strategi',
        hotCold: 'Varme / Kolde',
        evenOdd: 'Lige / Ulige',
        average: 'Gennemsnit',

        // Actions
        saveCombination: 'Gem Kombination',
        downloadPDF: 'Download PDF',
        saved: 'Gemt!',

        // Saved Combinations
        savedCombinations: 'Gemte Kombinationer',
        noSavedCombinations: 'Ingen gemte kombinationer',
        noSavedHint: 'Generer og gem dine yndlingskombinationer',

        // AI Analysis Section
        aiAnalysis: '🤖 AI Analyse - Neural Ræsonneringsmotor',
        confidenceLevel: 'Tillidsniveau:',
        aiReasoning: '💡 AI Ræsonnement',
        analyzingPatterns: 'Analyserer statistiske mønstre...',
        patternsDetected: '📊 Mønstre Opdaget',
        noPatterns: 'Ingen specifikke mønstre opdaget.',
        strategicRecommendation: '🎯 Strategisk Anbefaling',
        preparingRecommendations: 'Forbereder anbefalinger...',
        detailedAnalysis: '📈 Detaljeret Statistisk Analyse',
        top5Hot: '🔥 Top 5 Varme',
        top5Cold: '❄️ Top 5 Kolde',
        drawsAnalyzed: '📊 Trækninger Analyseret',
        commonPairs: '🔗 Almindelige Par',

        // Info Section
        statisticalInfo: 'Statistisk Information',
        hotNumbersInfo: 'Varme Numre',
        hotNumbersText: 'Baseret på reel frekvensanalyse af historiske trækninger. Disse numre er forekommet statistisk oftere.',
        coldNumbersInfo: 'Kolde Numre',
        coldNumbersText: 'Numre der historisk set er forekommet sjældnere. Nogle spillere mener, de er "på vej" til at komme.',
        balancedStrategyInfo: 'Balanceret Strategi',
        balancedStrategyText: 'Kombinerer varme og kolde numre for en afbalanceret tilgang baseret på reel statistisk fordeling.',

        // Footer
        footerWarning: '<strong>Advarsel:</strong> Denne generator er kun til underholdning. Lotterinumre er fuldstændig tilfældige. Spil ansvarligt. +18',
        footerCredit: 'Data baseret på officiel statistik fra Danske Spil',

        // Modal - Learn More
        modalTitle: 'Statistiske Beregninger & Metoder',
        modalClose: 'Luk',
        calcFrequency: '📊 Frekvensanalyse',
        calcFrequencyDesc: 'Absolut og relativ frekvens af hvert nummer gennem {draws} trækninger. Identificerer varme (høj frekvens) og kolde (lav frekvens) numre.',
        calcPairs: '🔗 Parkorrelationer',
        calcPairsDesc: 'Analyse af hvilke numre der oftest vises sammen. Beregner sandsynligheden for konsekutive par.',
        calcConditional: '📈 Betinget Sandsynlighed',
        calcConditionalDesc: 'Overgangssandsynligheder mellem positioner: position 1→2, 2→3, osv. Identificerer positionsafhængigheder.',
        calcChiSquare: '🧮 Chi-kvadrat Uafhængighedstest',
        calcChiSquareDesc: 'Statistisk test for at afgøre, om fordelingen er virkelig tilfældig eller har bias. Chi² værdi: {value}',
        calcGaps: '📉 Gap-analyse',
        calcGapsDesc: 'Antal trækninger siden hvert nummer sidst viste sig. Analyseres uden at falde for "spillerens fejlslutning".',
        calcCold: '❄️ Kolde Kombinationer',
        calcColdDesc: 'Identificerer talkombinationer der IKKE er set sammen i de sidste 100 trækninger. Prioriterer unikke mønstre.',
        calcAvoidHot: '🔥 Undgå Varme Par',
        calcAvoidHotDesc: 'Begrænser maksimalt 2 numre fra top 10 mest hyppige. Reducerer afhængighed af "populære" numre.',
        calcEntropy: '🌡️ Entropi & Standardafvigelse',
        calcEntropyDesc: 'Måler fordelingens randomisering (entropi: {entropy}) og variation (std: {std}).',

        // Error Messages
        errorConnecting: 'Kunne ikke oprette forbindelse til AI-serveren. Sørg for at backend kører på http://localhost:3001',
        errorFallback: 'Genererer numre på standardmåde...',

        // Loading Steps (AI Analysis)
        loading_frequency: '📊 Udfører Frekvensanalyse...',
        loading_pairs: '🔗 Analyserer Parkorrelationer...',
        loading_conditional: '📈 Beregner Betinget Sandsynlighed...',
        loading_chi: '🧮 Kører Chi-kvadrat Test...',
        loading_gaps: '📉 Udfører Gap-analyse...',
        loading_cold: '❄️ Identificerer Kolde Kombinationer...',
        loading_hot: '🔥 Filtrerer Varme Par...',
        loading_entropy: '🌡️ Måler Entropi & Standardafvigelse...',

        // Premium Modal & Pricing
        premiumAccessTitle: '💎 Premium AI Adgang',
        modalBenefitAI: 'Neural AI Motor',
        modalBenefitStats: 'Statistisk Analyse',
        pricingTryHeader: 'PREMIUM X1',
        pricingPack5Header: 'PREMIUM X5',
        pricingVIPHeader: 'PREMIUM VIP UNLIMITED',
        pricingPopularBadge: 'POPULÆR',
        pricing1Prediction: '1 Forudsigelse',
        pricing5Predictions: '5 Forudsigelser',
        pricingUnlimited: '∞ UBEGRÆNSET / Måned',
        pricingSave35: 'Spar 35%',
        pricingBuyButton: 'Køb',
        pricingBuyPackButton: 'Køb Pakke',
        pricingTotalAccessButton: 'Total Adgang',
        pricingAlreadyHaveKey: 'HAR ALLEREDE NØGLE',
        pricingActivateButton: 'Aktiver Nøgle',
        pricingKeyPlaceholder: 'VIP-XXXX-XXXX',
        pricingPaymentNote: 'VIP-nøglen vil ankomme til din e-mail efter betaling.',

        // License Errors
        errorMissingKey: 'Licensnøgle påkrævet',
        errorInvalidKey: 'Ugyldig licensnøgle',
        errorNoCredits: 'Ingen kreditter tilbage. Opgradering påkrævet.',
        errorInactiveKey: 'Licensen er inaktiv eller udløbet',

        // AI Process Description
        processTitle: '🧠 Sådan Fungerer Vores AI-Drevne Analyse',
        processStep1Title: '1️⃣ Indsamling af Historiske Lotteri-Data',
        processStep1Desc: 'Realtids-ekstraktion af de seneste 100 officielle trækninger fra verificerede dataudbydere. 100% autentiske resultater, ingen simulerede værdier.',
        processStep2Title: '2️⃣ Multivariant Statistisk Analyse',
        processStep2Desc: 'Avanceret frekvensanalyse, Chi²-uafhængighedstest, parkorrelationsmatricer, gap-analyse, entropimåling og standardafvigelsesberegninger.',
        processStep3Title: '3️⃣ Neuralt Ræsonneringsmotor',
        processStep3Desc: 'Vores proprietære AI-motor anvender "Mean Reversion Theory" og stokastiske modeller til at identificere statistiske anomalier og generere højsandsynlige kombinationer.',
        processStep4Title: '4️⃣ Intelligent Anti-Bias Algoritme',
        processStep4Desc: 'Automatisk filtrering af over-repræsenterede mønstre, prioritering af under-udnyttede kombinationer og dynamisk balancering af paritet og numeriske intervaller.',
        processTechniquesTitle: '📐 Anvendte Matematiske Teknikker',
        processTechnique1: 'Pearson Chi-kvadrat uafhængighedstest (α=0.05)',
        processTechnique2: 'Bayesiansk betinget sandsynlighedsanalyse',
        processTechnique3: 'Shannon-entropi & Welch standardafvigelse',
        processTechnique4: 'Mean Reversion Theory (Ornstein-Uhlenbeck)',
        processTechnique5: 'Adaptiv Hot/Cold Gradient Filtering',

        // Authentication
        authTitle: 'Log Ind / Tilmeld',
        signInWithGoogle: 'Fortsæt med Google',
        orEmail: 'Eller med email',
        emailPlaceholder: 'email@eksempel.com',
        passwordPlaceholder: '••••••••',
        signUpButton: 'Tilmeld',
        signInButton: 'Log Ind',
        logoutButton: 'Log Ud',
    },

    en: {
        // Header
        appTitle: 'Danish Lottery Pro',
        appSubtitle: 'Intelligent Number Generator',

        // Game Selection
        selectGame: 'Select your Game',
        lotto: 'Lotto',
        lottoDesc: '7 numbers (1-36)',
        lottoBadge: 'Saturday 8:00 PM',
        vikinglotto: 'Vikinglotto',
        vikinglottoDesc: '6 numbers (1-48) + Viking',
        vikinglottoBadge: 'Wednesday 8:00 PM',
        eurojackpot: 'Eurojackpot',
        eurojackpotDesc: '5 numbers (1-50) + 2 stars',
        eurojackpotBadge: 'Tuesday/Friday 8:00 PM',

        // Strategy Selection
        selectStrategy: 'Generation Strategy',
        balanced: 'Balanced',
        balancedDesc: 'Mix hot/cold',
        hotNumbers: 'Hot Numbers',
        hotNumbersDesc: 'Most frequent',
        coldNumbers: 'Cold Numbers',
        coldNumbersDesc: 'Least frequent',
        random: 'Random',
        randomDesc: '100% Random',
        aiPremium: 'AI Premium',
        aiPremiumDesc: 'Neural AI + Analysis',
        premiumBadge: '✨ PRO',

        // Generate Section
        generateButton: 'Generate Numbers',
        generatingAI: 'Analyzing with AI...',
        combinationsGenerated: 'Combinations generated:',

        // Results Section
        yourCombination: 'Your Combination',
        mainNumbers: 'Main Numbers',
        vikingNumber: 'Viking Number',
        starNumbers: 'Star Numbers',

        // Display Labels
        mainNumbersLabel: 'Main Numbers',
        vikingNumberLabel: 'Viking Number',
        starNumbersLabel: 'Star Numbers',

        // Stats Labels
        strategyLabel: 'Strategy',
        hotColdLabel: 'Hot / Cold',
        evenOddLabel: 'Even / Odd',
        averageLabel: 'Average',

        // Strategy Names
        strat_balanced: 'Balanced',
        strat_hot: 'Hot Numbers',
        strat_cold: 'Cold Numbers',
        strat_random: 'Random',
        strat_ai: 'AI Premium',

        // Strategy Info
        currentStrategy: 'Active Strategy',
        learnMore: 'Learn more',

        // Stats
        strategy: 'Strategy',
        hotCold: 'Hot / Cold',
        evenOdd: 'Even / Odd',
        average: 'Average',

        // Actions
        saveCombination: 'Save Combination',
        downloadPDF: 'Download PDF',
        saved: 'Saved!',

        // Saved Combinations
        savedCombinations: 'Saved Combinations',
        noSavedCombinations: 'No saved combinations',
        noSavedHint: 'Generate and save your favorite combinations',

        // AI Analysis Section
        aiAnalysis: '🤖 AI Analysis - Neural Reasoning Engine',
        confidenceLevel: 'Confidence Level:',
        aiReasoning: '💡 AI Reasoning',
        analyzingPatterns: 'Analyzing statistical patterns...',
        patternsDetected: '📊 Detected Patterns',
        noPatterns: 'No specific patterns detected.',
        strategicRecommendation: '🎯 Strategic Recommendation',
        preparingRecommendations: 'Preparing recommendations...',
        detailedAnalysis: '📈 Detailed Statistical Analysis',
        top5Hot: '🔥 Top 5 Hot',
        top5Cold: '❄️ Top 5 Cold',
        drawsAnalyzed: '📊 Draws Analyzed',
        commonPairs: '🔗 Common Pairs',

        // Info Section
        statisticalInfo: 'Statistical Information',
        hotNumbersInfo: 'Hot Numbers',
        hotNumbersText: 'Based on real frequency analysis of historical draws. These numbers have appeared statistically more often.',
        coldNumbersInfo: 'Cold Numbers',
        coldNumbersText: 'Numbers that have appeared less frequently historically. Some players believe they are "due" to appear.',
        balancedStrategyInfo: 'Balanced Strategy',
        balancedStrategyText: 'Combines hot and cold numbers for a balanced approach based on real statistical distribution.',

        // Footer
        footerWarning: '<strong>Warning:</strong> This generator is for entertainment only. Lottery numbers are completely random. Play responsibly. +18',
        footerCredit: 'Data based on official statistics from Danske Spil',

        // Modal - Learn More
        modalTitle: 'Statistical Calculations & Methods',
        modalClose: 'Close',
        calcFrequency: '📊 Frequency Analysis',
        calcFrequencyDesc: 'Absolute and relative frequency of each number across {draws} draws. Identifies hot (high frequency) and cold (low frequency) numbers.',
        calcPairs: '🔗 Pair Correlations',
        calcPairsDesc: 'Analysis of which numbers appear together most often. Calculates probability of consecutive pairs.',
        calcConditional: '📈 Conditional Probability',
        calcConditionalDesc: 'Transition probabilities between positions: position 1→2, 2→3, etc. Identifies positional dependencies.',
        calcChiSquare: '🧮 Chi-Square Independence Test',
        calcChiSquareDesc: 'Statistical test to determine if distribution is truly random or has bias. Chi² value: {value}',
        calcGaps: '📉 Gap Analysis',
        calcGapsDesc: 'Number of draws since each number last appeared. Analyzed without falling for "gambler\'s fallacy".',
        calcCold: '❄️ Cold Combinations',
        calcColdDesc: 'Identifies number combinations NOT seen together in the last 100 draws. Prioritizes unique patterns.',
        calcAvoidHot: '🔥 Avoid Hot Pairs',
        calcAvoidHotDesc: 'Limits maximum 2 numbers from top 10 most frequent. Reduces dependency on "popular" numbers.',
        calcEntropy: '🌡️ Entropy & Standard Deviation',
        calcEntropyDesc: 'Measures distribution randomness (entropy: {entropy}) and variation (std: {std}).',

        // Error Messages
        errorConnecting: 'Could not connect to AI server. Make sure backend is running on http://localhost:3001',
        errorFallback: 'Generating numbers in standard mode...',

        // Loading Steps (AI Analysis)
        loading_frequency: '📊 Performing Frequency Analysis...',
        loading_pairs: '🔗 Analyzing Pair Correlations...',
        loading_conditional: '📈 Calculating Conditional Probability...',
        loading_chi: '🧮 Running Chi-Square Test...',
        loading_gaps: '📉 Performing Gap Analysis...',
        loading_cold: '❄️ Identifying Cold Combinations...',
        loading_hot: '🔥 Filtering Hot Pairs...',
        loading_entropy: '🌡️ Measuring Entropy & Deviation...',

        // Premium Modal & Pricing
        premiumAccessTitle: '💎 Premium AI Access',
        modalBenefitAI: 'Neural AI Engine',
        modalBenefitStats: 'Real Statistics',
        pricingTryHeader: 'PREMIUM X1',
        pricingPack5Header: 'PREMIUM X5',
        pricingVIPHeader: 'PREMIUM VIP UNLIMITED',
        pricingPopularBadge: 'POPULAR',
        pricing1Prediction: '1 Prediction',
        pricing5Predictions: '5 Predictions',
        pricingUnlimited: '∞ UNLIMITED / Month',
        pricingSave35: 'Save 35%',
        pricingBuyButton: 'Buy',
        pricingBuyPackButton: 'Buy Pack',
        pricingTotalAccessButton: 'Total Access',
        pricingAlreadyHaveKey: 'ALREADY HAVE KEY',
        pricingActivateButton: 'Activate Key',
        pricingKeyPlaceholder: 'VIP-XXXX-XXXX',
        pricingPaymentNote: 'VIP key will arrive to your email after payment.',

        // License Errors
        errorMissingKey: 'License key required',
        errorInvalidKey: 'Invalid license key',
        errorNoCredits: 'No credits remaining. Top-up required.',
        errorInactiveKey: 'License is inactive or expired',

        // AI Process Description
        processTitle: '🧠 How Our AI-Powered Analysis Works',
        processStep1Title: '1️⃣ Historical Lottery Data Acquisition',
        processStep1Desc: 'Real-time extraction of the last 100 official draws from verified data providers. 100% authentic results, no simulated values.',
        processStep2Title: '2️⃣ Multivariate Statistical Analysis',
        processStep2Desc: 'Advanced frequency analysis, Chi² independence test, pair correlation matrices, gap analysis, entropy measurement and standard deviation calculations.',
        processStep3Title: '3️⃣ Neural Reasoning Engine',
        processStep3Desc: 'Our proprietary AI engine applies Mean Reversion Theory and stochastic models to identify statistical anomalies and generate high-probability combinations.',
        processStep4Title: '4️⃣ Intelligent Anti-Bias Algorithm',
        processStep4Desc: 'Automatic filtering of over-represented patterns, prioritization of under-exploited combinations and dynamic balancing of parity and numeric ranges.',
        processTechniquesTitle: '📐 Applied Mathematical Techniques',
        processTechnique1: 'Pearson Chi-square independence test (α=0.05)',
        processTechnique2: 'Bayesian conditional probability analysis',
        processTechnique3: 'Shannon entropy & Welch standard deviation',
        processTechnique4: 'Mean Reversion Theory (Ornstein-Uhlenbeck)',
        processTechnique5: 'Adaptive Hot/Cold Gradient Filtering',

        // Authentication
        authTitle: 'Sign In / Sign Up',
        signInWithGoogle: 'Continue with Google',
        orEmail: 'Or with email',
        emailPlaceholder: 'email@example.com',
        passwordPlaceholder: '••••••••',
        signUpButton: 'Sign Up',
        signInButton: 'Sign In',
        logoutButton: 'Logout',
    }
};

// Current language (default Danish)
let currentLang = 'da';

// Translation function
function t(key) {
    return translations[currentLang][key] || key;
}

// Switch language
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lottery-language', lang);
    updateAllTexts();
}

// Update all texts in the page
function updateAllTexts() {
    // Will be implemented in script.js
    console.log('Updating texts to:', currentLang);
}

// Load saved language
function loadSavedLanguage() {
    const saved = localStorage.getItem('lottery-language');
    if (saved && (saved === 'da' || saved === 'en')) {
        currentLang = saved;
    }
}
