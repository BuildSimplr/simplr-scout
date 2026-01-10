# Simplr Scout

AI-powered business problem solver that helps identify challenges and delivers actionable, domain-specific recommendations.

**Live Demo:** [simplr-scout.vercel.app](https://simplr-scout.vercel.app)

## Features

- **3-Step Discovery Flow** - Problem input → Clarifying questions → Personalized recommendations
- **Domain-Specific AI** - Recommends actual tools, vendors, and pricing (not generic advice)
- **Lead Capture** - Email gate before showing results + consultation booking form
- **Real-time Analysis** - Powered by Claude AI (Haiku 4.5)

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Framer Motion, Lucide Icons
- **AI:** Claude Haiku 4.5 (Anthropic API)
- **Backend:** Vercel Serverless Functions
- **Email:** Resend
- **Deployment:** Vercel

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SIMPLR SCOUT STATE MACHINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   App.js     │
│              │
│ showDiscovery│───── false ────►┌─────────────────┐
│   (state)    │                 │   LandingPage   │
│              │◄── onBack ──────│                 │
└──────┬───────┘                 │  • Hero         │
       │                         │  • How it works │
       │ true                    │  • CTA section  │
       │                         └────────┬────────┘
       ▼                                  │
┌──────────────┐                 onStartAnalysis()
│ DiscoveryFlow│◄─────────────────────────┘
│              │
│  step (1-3)  │
│  problem     │
│  questions   │
│  answers     │
│  recommendations
│  showEmailCapture
│  isLoading   │
└──────┬───────┘
       │
       ▼

     STEP 1                    STEP 2                      STEP 3
┌─────────────┐          ┌──────────────────┐        ┌─────────────────┐
│ ProblemInput│          │ClarifyingQuestions│        │ Recommendations │
│             │          │                  │        │                 │
│ [textarea]  │          │ Q1: [input]      │        │ • Summary       │
│             │          │ Q2: [input]      │        │ • #1 Next Step  │
│ Examples:   │          │ Q3: [input]      │        │ • Quick Wins    │
│ • VOIP      │          │ Q4: [input]      │        │ • Strategic     │
│ • CRM       │          │ Q5: [input]      │        │ • Long-term     │
│ • Website   │          │                  │        │                 │
└──────┬──────┘          └────────┬─────────┘        └────────┬────────┘
       │                          │                           │
       │ onSubmit(problem)        │ onSubmit(answers)         │ "Book Free
       ▼                          ▼                           │  Consultation"
┌─────────────┐          ┌─────────────────┐                  ▼
│  LOADING    │          │  EmailCapture   │         ┌─────────────────┐
│             │          │     MODAL       │         │ Consultation    │
│ POST /api/  │          │                 │         │     MODAL       │
│   analyze   │          │ [email input]   │         │                 │
│             │          │                 │         │ • Name *        │
│ type:       │          │ "Your Solutions │         │ • Email *       │
│ "questions" │          │  Are Ready!"    │         │ • Phone         │
└──────┬──────┘          └────────┬────────┘         │ • Message       │
       │                          │                  └────────┬────────┘
       │ success                  │ onSubmit(email)           │
       ▼                          ▼                           │ onSubmit
   step = 2              ┌─────────────┐                      ▼
                         │  LOADING    │             ┌─────────────────┐
                         │             │             │ POST /api/      │
                         │ POST /api/  │             │   submit-lead   │
                         │   analyze   │             │                 │
                         │             │             │ → Resend email  │
                         │ type:       │             │ → Console log   │
                         │ "recommend" │             └────────┬────────┘
                         └──────┬──────┘                      │
                                │                             │ success
                                │ success                     ▼
                                ▼                    ┌─────────────────┐
                            step = 3                 │ "Request        │
                                                     │  Submitted!"    │
                                                     └─────────────────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Generate clarifying questions or recommendations via Claude AI |
| `/api/submit-lead` | POST | Submit consultation request, sends email via Resend |

### Component Tree

```
App
 ├── LandingPage
 │
 └── DiscoveryFlow
      ├── StepIndicator
      ├── ProblemInput (step 1)
      ├── ClarifyingQuestions (step 2)
      ├── Recommendations (step 3)
      │    └── ConsultationModal
      └── EmailCapture (modal overlay)
```

## Setup

### Prerequisites

- Node.js 18+
- Anthropic API key
- Resend API key (for email notifications)

### Installation

```bash
git clone https://github.com/BuildSimplr/simplr-scout.git
cd simplr-scout
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=your-email@example.com
```

### Development

```bash
npm start
```

Note: API routes only work when deployed to Vercel. For local development, the app uses fallback mock data.

### Deployment

```bash
npx vercel --prod
```

Add environment variables in Vercel dashboard under Project Settings → Environment Variables.

## License

MIT

---

Part of the [BuildSimplr](https://buildsimplr.github.io) portfolio.
