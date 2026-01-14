# EIS 75th Anniversary Games - Project Manifest

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | eis-75th-games |
| **Version** | 0.0.0 |
| **Type** | Interactive Educational Gaming Platform |
| **Purpose** | Celebrate 75 years of the CDC Epidemic Intelligence Service (1951-2026) |
| **Live Demo** | https://eis-75th-games.vercel.app |
| **Repository** | https://github.com/terezinvites777/eis-75th-games |

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.0 | UI Library |
| React Router DOM | ^7.12.0 | Client-side Routing |
| TypeScript | ~5.9.3 | Type Safety |
| Vite | ^7.2.4 | Build Tool & Dev Server |

### State Management
| Technology | Version | Purpose |
|------------|---------|---------|
| Zustand | ^5.0.9 | Lightweight state management with localStorage persistence |

### Styling & Design
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | ^4.1.18 | Utility-first CSS framework |
| PostCSS | ^8.5.6 | CSS processing |
| Framer Motion | ^12.24.12 | Animation library |

### UI & Icons
| Technology | Version | Purpose |
|------------|---------|---------|
| Lucide React | ^0.562.0 | Icon library (200+ icons) |
| SVG Maps USA | ^2.0.0 | Interactive US map |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase JS | ^2.90.1 | PostgreSQL database client |

---

## Directory Structure

```
eis-75th-games/
├── public/
│   └── images/
│       ├── exhibits/          # Game card preview images
│       ├── plates/            # Decorative panels
│       └── textures/          # Wood, parchment textures
├── src/
│   ├── components/
│   │   ├── brand/             # Logos, badges
│   │   ├── command/           # Outbreak Command game
│   │   ├── connect/           # EpiConnect networking
│   │   ├── detective/         # Disease Detective game
│   │   ├── epiconnect/        # EpiConnect styling
│   │   ├── exhibit/           # Museum exhibit panels
│   │   ├── game/              # Timer, Score components
│   │   ├── layout/            # GameShell, Navigation
│   │   ├── patient-zero/      # Patient Zero game
│   │   ├── predict/           # Predict the Outbreak game
│   │   ├── stories/           # 75 Stories gallery
│   │   └── ui/                # Button, Card, Modal
│   ├── data/
│   │   ├── detective/         # Case data by era
│   │   ├── command-scenarios.ts
│   │   ├── connect-data.ts
│   │   ├── patient-zero-*.ts
│   │   ├── predict-*.ts
│   │   └── stories-data.ts
│   ├── hooks/                 # useTimer, useLeaderboard
│   ├── lib/                   # supabase, scoring, cn utilities
│   ├── pages/                 # Route page components
│   ├── store/                 # Zustand game store
│   ├── styles/                # CSS design system
│   └── types/                 # TypeScript definitions
├── supabase/                  # Supabase configuration
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home.tsx | Landing page with 6 game tiles |
| `/detective` | DetectiveHub.tsx | Era selection and case hub |
| `/detective/:era` | DetectiveHub.tsx | Cases for selected era |
| `/detective/:era/:caseId` | DetectiveGame.tsx | Active case gameplay |
| `/command` | Command.tsx | Outbreak Command scenarios |
| `/connect` | Connect.tsx | EpiConnect networking |
| `/patient-zero` | PatientZero.tsx | Multi-day mystery game |
| `/predict` | Predict.tsx | Epidemiological forecasting |
| `/stories` | Stories.tsx | 75 Stories video gallery |
| `/leaderboard` | Leaderboard.tsx | Score rankings |
| `/profile` | Profile.tsx | User profile |

---

## Games & Features

### 1. Disease Detective
**Type:** Investigation Puzzle

Solve real historical disease outbreaks using clues from epidemiological investigations.

**Features:**
- 10 cases across 3 historical eras (1950s, 1980s, 2010s)
- Multiple clue types: lab, epi, clinical, environmental, historical
- Point-based scoring with time and accuracy bonuses
- Difficulty levels: Easy/Medium/Hard
- Era-specific visual theming

**Cases Include:**
- 1950s: Oswego Church Supper, Cutter Incident
- 1980s: Toxic Shock Syndrome, Legionnaires' Disease
- 2010s: Peanut Butter Salmonella, Fungal Meningitis, Ebola in Dallas

---

### 2. Outbreak Command
**Type:** Strategy/Simulation

Lead epidemic response operations and manage resources during outbreaks.

**Features:**
- Multiple outbreak scenarios
- Real-time decision-making
- Resource management: Budget, Personnel, Public Trust, Time
- Interactive US map visualization
- Turn-based progression with probability-based outcomes

---

### 3. EpiConnect
**Type:** Speed Networking/Social

Meet fellow EIS officers with intelligent matching algorithms.

**Features:**
- Profile creation and discovery
- Smart matching based on role, topics, geography, mentor preferences
- Multiple connection methods: App (25pts), QR (50pts), Speed (35pts)
- 12 challenges with progression tracking
- 5 view modes: Discover, Speed, QR, Connections, Challenges

**Roles:** Incoming, Second Year, Alumni, Supervisor

**Topics:** Foodborne, Respiratory, Vector-borne, Chronic Disease, Injury Prevention, Environmental Health, Maternal/Child Health, AMR, Global Health

---

### 4. Patient Zero
**Type:** Multi-day Mystery Investigation

Solve outbreak mysteries with time-released clues over 3 days.

**Features:**
- Clues released twice daily (AM/PM)
- Early submission bonuses (Day 1: 2x, Day 2: 1.5x multiplier)
- Interactive world map
- Score breakdown by accuracy dimensions
- 3 active mysteries + 1 featured anniversary mystery

---

### 5. Predict the Outbreak
**Type:** Epidemiological Forecasting

Use partial data to predict outbreak outcomes.

**Features:**
- Practice scenarios with historical data
- Live conference challenge with real-time data release
- Prediction inputs: Peak week, Total cases, Peak cases, Duration, R0
- Interactive epidemic curve visualization
- Curve drawing tool for manual predictions

---

### 6. 75 Stories
**Type:** Video Archive/Gallery

Video gallery of EIS stories spanning 8 decades (1950s-2020s).

**Features:**
- Stories organized by decade
- Video player integration
- User memory submission system

---

## Design System

### Brand Colors
| Color | Hex | Usage |
|-------|-----|-------|
| CDC Blue | #005eaa | Primary brand |
| CDC Teal | #00a89b | Accent |
| Anniversary Gold | #D4AF37 | 75th Anniversary |
| Anniversary Bronze | #B8860B | Secondary gold |
| EIS Purple | #7A2A7E | EIS branding |

### Era Theming
| Era | Primary Color | Hex |
|-----|---------------|-----|
| 1950s | Gold/Amber | #f59e0b |
| 1980s | Blue | #3b82f6 |
| 2010s | Purple | #a855f7 |

### CSS Files
| File | Purpose |
|------|---------|
| `brand.css` | Master design system |
| `eis-brand.css` | EIS-specific styling |
| `detective-theme.css` | Detective game aesthetics |
| `epiconnect.css` | EpiConnect styling |
| `predict-outbreak.css` | Prediction game styling |
| `exhibit-panels.css` | Museum exhibit panels |
| `leaderboard.css` | Leaderboard styling |

---

## Scoring System

### Detective Mode
- Base points per case
- Time bonus (completion speed)
- Accuracy bonus (fewer clues revealed)
- Streak bonus (consecutive wins)
- Difficulty multiplier: Easy (1.0x), Medium (1.2x), Hard (1.5x)

### Rank Progression
| Rank | Score Required |
|------|----------------|
| Rookie | 0+ |
| Trainee | 1,000+ |
| Junior Detective | 2,500+ |
| Field Officer | 5,000+ |
| Senior Investigator | 7,500+ |
| Master Epidemiologist | 10,000+ |

---

## State Management

**Store:** `src/store/gameStore.ts` (Zustand)

### Player State
- Profile (ID, email, displayName, avatar)
- Statistics (scores, games completed, streak)
- Badges/achievements

### Game Session State
- Current game type, era, case/mission
- Game status, revealed clues, diagnosis
- Time remaining, score

### Persistence
- localStorage for player data
- Game sessions reset on reload

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # TypeScript check + production build
npm run lint     # ESLint code quality check
npm run preview  # Preview production build
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Optional | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anonymous key |

*Note: App runs in demo mode without Supabase configuration*

---

## Deployment

| Platform | Configuration |
|----------|---------------|
| Vercel | `vercel.json` |
| Build Command | `tsc -b && vite build` |
| Output Directory | `dist/` |

---

## Key Component Files

### Layout
- `GameShell.tsx` - Main page wrapper with theming
- `Navigation.tsx` - Navigation bar

### Games
- `DetectiveGame.tsx` - Detective gameplay
- `CommandGame.tsx` - Command gameplay
- `SpeedNetworking.tsx` - Speed networking carousel
- `TheoryForm.tsx` - Patient Zero submission
- `CurveDrawer.tsx` - Prediction curve tool

### UI
- `Button.tsx` - Styled buttons
- `Card.tsx` - Content cards
- `Modal.tsx` - Dialogs
- `Timer.tsx` - Countdown timer

---

## Type Definitions

Located in `src/types/`:

| File | Types |
|------|-------|
| `game.ts` | Era, GameType, GameStatus, Clue, Case, Mission |
| `player.ts` | Player, PlayerStats, Badge, LeaderboardEntry |
| `command.ts` | Pathogen, GameState, Action, Scenario |
| `connect.ts` | AttendeeProfile, Connection, Challenge |
| `patient-zero.ts` | MysteryDefinition, PlayerTheory, ClueSchedule |
| `predict.ts` | PredictionScenario, PlayerPrediction |

---

## Performance

- **Code Splitting:** Vite route-based automatic splitting
- **Tree Shaking:** Unused imports removed in build
- **Icons:** Tree-shakeable Lucide React SVGs
- **State:** Only essential data persisted
- **CSS:** Tailwind utility classes, no runtime generation

---

## Last Updated

**Date:** January 2026
**Branch:** main
**Status:** Active Development
