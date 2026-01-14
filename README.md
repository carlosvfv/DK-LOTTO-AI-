# 🎰 DK Lotto AI

**Advanced AI-powered lottery number generator for Danish lottery games**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## 📋 Overview

DK Lotto AI is an intelligent lottery number generator that uses advanced statistical analysis and AI to generate optimized number combinations for:

- 🎲 **Lotto** (7 numbers, 1-36)
- ⚔️ **Vikinglotto** (6 numbers + Viking number)
- ⭐ **Eurojackpot** (5 numbers + 2 stars)

### ✨ Key Features

- 🤖 **AI-Powered Analysis**: DeepSeek AI with Mean Reversion Theory
- 📊 **Real Statistical Data**: Web scraping from official lottery sources
- 🔬 **Advanced Calculations**: Chi² test, entropy, pair correlations, gap analysis
- 👤 **User Accounts**: Supabase authentication with credit system
- 💳 **Stripe Integration**: Automated payment processing
- 🌍 **Multilingual**: Danish & English support
- 📱 **Responsive Design**: Works on desktop and mobile

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (HTML/CSS/JS)            │
│  ├─ Authentication UI                               │
│  ├─ Game Selection                                  │
│  ├─ Number Display                                  │
│  └─ Credit Counter                                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Supabase Edge Functions                │
│  ├─ generate-premium-v2 (AI predictions)           │
│  ├─ check-license (validation)                     │
│  └─ stripe-webhook (payment handler)               │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                 Supabase Database                   │
│  ├─ user_credits (credit management)               │
│  ├─ lottery_cache (scraped data)                   │
│  └─ prediction_history (user predictions)          │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- DeepSeek API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/carlosvfv/DK-LOTTO-AI-.git
cd DK-LOTTO-AI-
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**

Follow the complete guide in `GUIA_COMPLETA_ACTIVACION.md`

Quick setup:
- Create tables: Run `CREATE_USER_CREDITS_TABLE.sql` in Supabase SQL Editor
- Enable Auth: Supabase Dashboard → Authentication → Enable Email provider
- Deploy Edge Functions (see below)

4. **Populate cache**
```bash
# Edit update-cache.mjs with your Supabase service key
node update-cache.mjs
```

5. **Open the app**
```bash
# Simply open index.html in your browser
# Or use a local server
```

---

## 📁 Project Structure

```
DK-LOTTO-AI-/
├── index.html                 # Main application
├── script.js                  # Frontend logic
├── auth-logic.js             # Authentication handler
├── translations.js           # i18n (Danish/English)
├── style.css                 # Main styles
├── auth-styles.css          # Auth UI styles
├── ai-process-styles.css    # Process info styles
│
├── supabase/
│   └── functions/
│       ├── generate-premium-v2/    # AI number generation
│       ├── check-license/          # License validation
│       └── stripe-webhook/         # Payment processing
│
├── update-cache.mjs          # Data scraping script
├── CREATE_USER_CREDITS_TABLE.sql
├── GUIA_COMPLETA_ACTIVACION.md
└── README.md
```

---

## 🧠 How It Works

### 1️⃣ Statistical Analysis (Offline - Every 6 hours)

```javascript
// update-cache.mjs
├─ Web Scraping → 100 recent draws
├─ Frequency Analysis
├─ Chi-Square Test (α=0.05)
├─ Pair Correlation Matrices
├─ Gap Analysis
├─ Shannon Entropy Calculation
└─ Save to Supabase → lottery_cache
```

### 2️⃣ AI Prediction (Online - Per Request)

```javascript
// Edge Function
├─ Read cached statistical analysis
├─ Prepare prompt with analysis data
├─ Call DeepSeek AI API
│   ├─ Model: deepseek-reasoner
│   ├─ Theory: Mean Reversion (Ornstein-Uhlenbeck)
│   └─ Timeout: 30s (fallback to smart random)
├─ Process AI response
├─ Deduct user credit
└─ Save to prediction_history
```

---

## 💳 Pricing Tiers

| Plan | Price | Credits | Description |
|------|-------|---------|-------------|
| **PREMIUM X1** | 13 kr | 1 | Try it out |
| **PREMIUM X5** | 49 kr | 5 | Most popular |
| **VIP UNLIMITED** | 170 kr/month | ∞ | Unlimited predictions |

New users receive **1 free credit** upon registration.

---

## 🔧 Configuration

### Environment Variables (Supabase Secrets)

```bash
# Deploy secrets to Supabase
supabase secrets set DEEPSEEK_API_KEY=sk_your_key_here
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### Frontend Configuration

**`auth-logic.js`** (Lines 5-6):
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key';
```

---

## 🚢 Deployment

### Edge Functions

**Option 1: Manual Deploy**
```bash
supabase login
supabase link --project-ref your-project-id
supabase functions deploy generate-premium-v2
supabase functions deploy check-license
supabase functions deploy stripe-webhook
```

**Option 2: GitHub Actions (Automated)**

Push to `main` branch → Auto-deploy via GitHub Actions

---

## 📊 Database Schema

### `user_credits`
```sql
id UUID PRIMARY KEY
email TEXT UNIQUE
credits INTEGER
subscription_type TEXT
subscription_expires_at TIMESTAMP
```

### `lottery_cache`
```sql
game TEXT UNIQUE
data JSONB          -- 100 recent draws
analysis JSONB      -- Statistical analysis
updated_at TIMESTAMP
```

### `prediction_history`
```sql
user_id UUID
game TEXT
numbers INTEGER[]
confidence DECIMAL
ai_reasoning TEXT
created_at TIMESTAMP
```

---

## 🧪 Testing

### Test User Registration
```bash
1. Open index.html
2. Click "AI Premium"
3. Sign up with test email
4. Verify 1 free credit appears
```

### Test Payment (Stripe Test Mode)
```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
```

---

## 📈 Analytics & Monitoring

- **Edge Function Logs**: Supabase Dashboard → Edge Functions → Logs
- **Database Activity**: Supabase Dashboard → Database → Activity
- **Stripe Payments**: Stripe Dashboard → Payments

---

## 🛡️ Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ DeepSeek API key stored in Supabase secrets
- ✅ Stripe webhook signature verification
- ✅ CORS headers configured
- ✅ User authentication required for premium features

---

## 🌐 Localization

Supported languages:
- 🇩🇰 Danish (Dansk)
- 🇬🇧 English

Translations managed in `translations.js`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **DeepSeek AI** for advanced reasoning capabilities
- **Supabase** for backend infrastructure
- **Stripe** for payment processing
- **LotteryGuru** for historical lottery data

---

## 📞 Support

For issues and questions:
- 🐛 [Report a Bug](https://github.com/carlosvfv/DK-LOTTO-AI-/issues)
- 💡 [Request a Feature](https://github.com/carlosvfv/DK-LOTTO-AI-/issues)

---

## ⚠️ Disclaimer

This application is for **entertainment purposes only**. Lottery numbers are inherently random, and no system can guarantee winning outcomes. Please play responsibly. 18+

---

**Made with ❤️ in Denmark** 🇩🇰
