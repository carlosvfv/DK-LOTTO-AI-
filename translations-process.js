// Add Process Description Translations
const processTranslations = {
    da: {
        processTitle: '🧠 Hvordan Vores AI Premium Fungerer',
        processStep1Title: '1️⃣ Web Scraping af Rigtige Data',
        processStep1Desc: 'Vi downloader de seneste 100 trækninger fra LotteryGuru.com - INGEN simulerede data.',
        processStep2Title: '2️⃣ Avanceret Statistisk Analyse',
        processStep2Desc: 'Frekvensanalyse, Chi²-test, Parkorrelationer, Gap-analyse, Entropimåling og mere.',
        processStep3Title: '3️⃣ DeepSeek AI Ræsonnement',
        processStep3Desc: 'AI modtager alle statistikker og bruger "Regression til Mean" teori til at generere intelligente kombinationer.',
        processStep4Title: '4️⃣ Smart Filtrering',
        processStep4Desc: 'Undgår varme par, prioriterer kolde kombinationer, balancerer lige/ulige og ranges.',
        processTechniquesTitle: '📐 Anvendte Teknikker',
        processTechnique1: 'Chi-kvadrat uafhængighedstest',
        processTechnique2: 'Betinget sandsynlighedsanalyse',
        processTechnique3: 'Entropi & standardafvigelsesberegning',
        processTechnique4: 'Regression til middelværdi (Mean Reversion)',
        processTechnique5: 'Kolde/Varme nummerfiltrering',
    },
    en: {
        processTitle: '🧠 How Our AI Premium Works',
        processStep1Title: '1️⃣ Web Scraping Real Data',
        processStep1Desc: 'We download the last 100 real draws from LotteryGuru.com - NO simulated data.',
        processStep2Title: '2️⃣ Advanced Statistical Analysis',
        processStep2Desc: 'Frequency analysis, Chi² test, Pair correlations, Gap analysis, Entropy measurement and more.',
        processStep3Title: '3️⃣ DeepSeek AI Reasoning',
        processStep3Desc: 'AI receives all statistics and uses "Regression to Mean" theory to generate smart combinations.',
        processStep4Title: '4️⃣ Smart Filtering',
        processStep4Desc: 'Avoids hot pairs, prioritizes cold combinations, balances even/odd and ranges.',
        processTechniquesTitle: '📐 Applied Techniques',
        processTechnique1: 'Chi-square independence test',
        processTechnique2: 'Conditional probability analysis',
        processTechnique3: 'Entropy & standard deviation calculation',
        processTechnique4: 'Regression to Mean theory',
        processTechnique5: 'Hot/Cold number filtering',
    }
};

// Merge with existing translations
Object.keys(processTranslations).forEach(lang => {
    Object.assign(translations[lang], processTranslations[lang]);
});
