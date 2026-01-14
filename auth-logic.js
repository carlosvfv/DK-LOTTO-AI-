// ===================================
// SUPABASE AUTH INITIALIZATION
// ===================================

const SUPABASE_URL = 'https://dtyckxrqyyvcitmityzv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eWNreHJxeXl2Y2l0bWl0eXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MDUzNjYsImV4cCI6MjA1MjM4MTM2Nn0.t-2YfuR9gywh73eNx-JYBMnmN4i_mAcEaPMNaO-xBNU';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const authModal = document.getElementById('authModal');
const authModalClose = document.getElementById('authModalClose');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authError = document.getElementById('authError');
const userDisplay = document.getElementById('userDisplay');
const userName = document.getElementById('userName');
const userCredits = document.getElementById('userCredits');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;
let currentCredits = 0;

// ===================================
// AUTH STATE MANAGEMENT
// ===================================

// Check for existing session on load
async function initAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        currentUser = session.user;
        await loadUserCredits();
        updateUIForLoggedInUser();
    }

    // Listen for auth changes
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            currentUser = session.user;
            await loadUserCredits();
            updateUIForLoggedInUser();
            authModal.style.display = 'none';
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            currentCredits = 0;
            updateUIForLoggedOutUser();
        }
    });
}

// Load user credits from database
async function loadUserCredits() {
    if (!currentUser) return;

    try {
        const { data, error } = await supabaseClient
            .from('user_credits')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (error) throw error;

        if (data) {
            currentCredits = data.credits;
            updateCreditsDisplay(data.credits);
        }
    } catch (error) {
        console.error('Error loading credits:', error);
    }
}

// Update UI when logged in
function updateUIForLoggedInUser() {
    const displayName = currentUser.user_metadata?.full_name ||
        currentUser.email?.split('@')[0] ||
        'Usuario';

    userName.textContent = displayName;
    userCredits.textContent = currentCredits;
    userDisplay.style.display = 'flex';
}

// Update UI when logged out
function updateUIForLoggedOutUser() {
    userDisplay.style.display = 'none';
}

// Update credits display
function updateCreditsDisplay(credits) {
    currentCredits = credits;
    userCredits.textContent = credits === 999999 ? '∞' : credits;
}

// ===================================
// AUTH ACTIONS
// ===================================

// Google Sign In
googleSignInBtn.addEventListener('click', async () => {
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Email Sign Up
signUpBtn.addEventListener('click', async () => {
    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
        authError.textContent = t('errorMissingFields') || 'Por favor completa todos los campos';
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        authError.textContent = '';
        alert(t('checkEmailConfirmation') || '¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Email Sign In
signInBtn.addEventListener('click', async () => {
    const email = authEmail.value.trim();
    const password = authPassword.value;

    if (!email || !password) {
        authError.textContent = t('errorMissingFields') || 'Por favor completa todos los campos';
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        authError.textContent = '';
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
});

// Close modal
authModalClose.addEventListener('click', () => {
    authModal.style.display = 'none';
});

// ===================================
// MODIFIED AI GENERATION FUNCTION
// ===================================

async function generateAIPremiumNumbers() {
    // Check if user is authenticated
    if (!currentUser) {
        authModal.style.display = 'flex';
        return;
    }

    // Check if user has credits
    if (currentCredits <= 0) {
        // Show payment modal instead
        licenseModal.style.display = 'flex';
        return;
    }

    // Show loading
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span class="generate-icon">🤖</span><span class="generate-text">${t('generatingAI')}</span>`;

    try {
        // Get session token
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session) {
            throw new Error('No session found');
        }

        // Call Edge Function
        const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-premium`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                game: currentGame
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Generation failed');
        }

        const data = await response.json();

        // Update credits display
        updateCreditsDisplay(data.remainingCredits);

        // Display results (reuse existing display logic)
        displayResults(data);

    } catch (error) {
        console.error('AI Generation Error:', error);
        alert(error.message);
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<span class="generate-icon">✨</span><span class="generate-text">${t('generateButton')}</span>`;
    }
}

// Initialize auth on page load
initAuth();

console.log('✅ Auth system initialized');
