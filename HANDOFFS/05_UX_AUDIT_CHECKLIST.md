# EIS 75TH GAMES: UX/UI Audit Checklist for Claude Extension
## Visual Verification Against Design System

**Date:** January 12, 2026  
**Live URL:** https://eis-75th-games.vercel.app  
**Purpose:** Systematically verify each game's UI matches the Disease Detective design language

---

# AUDIT INSTRUCTIONS

For each game, navigate to the URL and visually verify:
1. Are cards using the `.panel` styling? (gradient background, 2px border, inset shadow, rounded-xl)
2. Are buttons using `.btn-emboss` styling? (3D raised effect, shadow underneath)
3. Are stats using `.stat-card` styling? (centered, uppercase label, large value)
4. Are section headers using `.section-header` pattern? (title + gradient line)
5. Are badges/pills using `.pill` styling? (rounded-full, subtle background)
6. Are progress bars using `.progress-bar` with gradient fill?
7. Are animations present? (slide-up on load, score-pop on results)

---

# REFERENCE: What Good Looks Like

## Disease Detective (The Gold Standard)
**URL:** https://eis-75th-games.vercel.app/detective

### Panel/Card Styling
```
- Background: linear-gradient from white to slightly off-white (#fefefe to #f9f8f6)
- Border: 2px solid with subtle tan/stone color (rgba(180, 170, 150, 0.25))
- Shadow: Layered - 2px offset + 6px blur + inset highlight at top
- Border-radius: 18px (--radius-lg)
```

### Button Styling (btn-emboss)
```
- Background: Gradient (gold for primary, white for secondary)
- Border-radius: Full (pill shape, 9999px)
- Shadow: 6px offset shadow underneath (creates 3D raised effect)
- On hover: translateY(-1px), shadow increases
- On click: translateY(2px), shadow decreases
```

### Stat Card Styling
```
- Centered text alignment
- Large bold value (26px, font-weight 700)
- Small uppercase label (11px, letter-spacing 0.06em)
- Subtle background gradient and border
- Inset shadow at top for depth
```

### Section Header Styling
```
- 14px uppercase text with 0.08em letter-spacing
- Color: var(--ink-muted)
- Followed by flex-1 gradient line that fades right
- Line: linear-gradient(90deg, rgba(15, 23, 42, 0.12), transparent)
```

---

# GAME-BY-GAME AUDIT CHECKLIST

## 1. PREDICT THE OUTBREAK

### Landing Page (/predict)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Live Challenge card | `.panel` - gradient bg, 2px border, layered shadow | ☐ |
| "Enter Challenge" button | `.btn-emboss-primary` - gold gradient, 3D shadow, pill shape | ☐ |
| "2x early bonus" badge | `.pill-gold` - amber bg, rounded-full | ☐ |
| Progress bar | `.progress-bar` + `.progress-fill` with theme gradient | ☐ |
| "HOW IT WORKS" header | `.section-header` - uppercase + gradient line | ☐ |
| How It Works card | `.panel` styling | ☐ |
| "PRACTICE SCENARIOS" header | `.section-header` - uppercase + gradient line | ☐ |
| Scenario cards | `.panel` with `:hover` lift effect | ☐ |
| Pathogen badges (Influenza, etc.) | `.pill-themed` - theme color bg | ☐ |
| Location badges | `.pill` - subtle gray bg | ☐ |

### Challenge Detail (/predict → Enter Challenge)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Live status bar | Styled with red dot indicator | ☐ |
| "Skip to Day 2" button | `.btn-emboss` secondary style | ☐ |
| Countdown timer | Monospace font, prominent | ☐ |
| Scenario info card | `.panel` with top accent bar | ☐ |
| Pathogen badge | `.pill-themed` red/orange | ☐ |
| Location badge | `.pill` gray | ☐ |
| "EPIDEMIOLOGICAL CONTEXT" header | `.section-header` with line | ☐ |
| Epi context panel | `.panel-themed` or contrasting bg | ☐ |
| Stat values (+112%, 2.1, etc.) | `.stat-card` layout - centered, large value, small label | ☐ |
| "DRAW YOUR PREDICTION" header | `.section-header` with line | ☐ |
| Drawing canvas | `.panel` with grid background | ☐ |
| Legend items | Consistent styling | ☐ |
| "YOUR PREDICTIONS" header | `.section-header` with line | ☐ |
| Predictions card | `.panel` | ☐ |
| Slider value displays | `.pill` with semantic colors | ☐ |
| Quick estimate buttons (3x, 5x, etc.) | `.btn-emboss-sm` | ☐ |
| "Submit Prediction" button | `.btn-emboss-primary btn-emboss-lg` full width | ☐ |
| "2x bonus" badge | `.pill-gold` with sparkle | ☐ |

### Results (after submit)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Results card | `.panel` centered | ☐ |
| Trophy/check icon | Appropriate size, colored | ☐ |
| Score value | `.animate-score-pop`, large, gold gradient text | ☐ |
| Bonus text | Smaller, amber color | ☐ |
| Breakdown items | Clear rows with alignment | ☐ |
| Predicted vs Actual | Clear labels, good contrast | ☐ |
| Points per category | Color-coded (green for earned) | ☐ |
| "Update Prediction" button | `.btn-emboss` full width | ☐ |

---

## 2. PATIENT ZERO

### Landing Page (/patient-zero)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Featured case banner | Gold/amber gradient, prominent "75th" badge | ☐ |
| Day/clue progress | Clear "Day X of Y" indicator | ☐ |
| Mystery cards | `.panel` with hover effect | ☐ |

### Case Detail (/patient-zero → select case)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Back link | Subtle, left-aligned | ☐ |
| Day progress indicator | "Day X of Y" with clue count | ☐ |
| Skip Day button (if demo) | `.btn-emboss` | ☐ |
| Featured case banner | Gold gradient bg, star icon | ☐ |
| Case title card | Centered, prominent title | ☐ |
| Clue count | "X of Y clues revealed" | ☐ |
| Detective board | `.panel` with board/cork aesthetic | ☐ |
| Clue cards - revealed | Yellow/cream bg, readable text, "Key clue" badges | ☐ |
| Clue cards - locked | Grayed out, lock icon, "Clue locked..." | ☐ |
| Day/time labels on clues | "DAY 1 MORNING", "DAY 2 - PM", etc. | ☐ |
| Stats bar | `.stat-card` grid - Cases, Deaths, States, Officers | ☐ |
| Investigators count | "X investigators have cracked this case" | ☐ |
| "Submit Your Theory" header | Clear section label | ☐ |
| Form labels | Clear, properly spaced | ☐ |
| Text inputs | Consistent borders, placeholders, focus states | ☐ |
| Helper text | Small, muted (e.g., "Hint: Within 2 years...") | ☐ |
| Confidence selector | 3 options, clear active state | ☐ |
| "Submit Theory" button | `.btn-emboss-primary` - **NOT flat red** | ☐ |
| "Show hints" link | Subtle, optional | ☐ |

### Missing Features

| Feature | Expected | Status |
|---------|----------|--------|
| World map with mystery locations | Interactive US/World map | ☐ |
| Pulsing red pins (unsolved) | Animated markers | ☐ |
| Green pins (solved) | Static markers | ☐ |
| Click pin to investigate | Navigation | ☐ |

---

## 3. OUTBREAK COMMAND

### Landing Page (/command)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Scenario cards | `.panel` or `.game-card` | ☐ |
| Difficulty indicators | Stars or badge | ☐ |
| Pathogen/location info | Clear labels | ☐ |

### Game Page (/command → select scenario)

| Element | Expected Style | Status |
|---------|---------------|--------|
| **CRITICAL: Scenario title** | White/light text, drop-shadow, readable | ☐ |
| **CRITICAL: Day counter** | Large (24px+), high contrast, amber bg | ☐ |
| Pause/resume controls | Clear buttons | ☐ |
| US Map | All states visible | ☐ |
| State abbreviation labels | On each state, readable | ☐ |
| Affected states | Red fill, clear boundary | ☐ |
| Highlighted states (events) | Pulse animation | ☐ |
| Case count on states | Visible numbers or markers | ☐ |
| Resources panel | Budget, Staff, Supplies with icons | ☐ |
| Action buttons | `.btn-emboss` styling | ☐ |
| In-progress actions | Progress bars, time remaining | ☐ |
| Event feed | `.panel`, scrollable | ☐ |
| State list sidebar | Sorted by cases (highest first) | ☐ |
| Objectives panel | Always visible | ☐ |
| Win/lose progress bars | Color-coded (green/amber/red) | ☐ |

### Missing Features

| Feature | Expected | Status |
|---------|----------|--------|
| Tutorial overlay (first visit) | 5-step walkthrough, progress dots | ☐ |
| localStorage "seen tutorial" | Skip on return visits | ☐ |
| Action feedback toasts | "Deployed to Texas!" confirmations | ☐ |
| Animated stat changes | Floating +/- numbers | ☐ |
| Map spread animation | Cases visually spreading | ☐ |

---

## 4. EPICONNECT

### Main Page (/connect)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Stats bar | `.stat-card` grid - Connections, Points, Challenges | ☐ |
| Tab buttons (Discover/Network/Challenges) | Clear active state, `.btn` styling | ☐ |
| Filter buttons | `.pill` or `.btn-emboss-sm` | ☐ |
| Topic filter dropdown | `.panel` with options | ☐ |
| Attendee cards | `.panel` with proper structure | ☐ |
| Avatar (initials) | Colored circle, centered text | ☐ |
| Name | Bold, prominent | ☐ |
| Role badges | Color-coded `.pill` (Incoming=blue, Alumni=purple, etc.) | ☐ |
| Class year | Small text with icon | ☐ |
| Location info | Icons + text | ☐ |
| Topic tags | `.pill` row | ☐ |
| Bio text | Truncated with expand | ☐ |
| "Connect" button | `.btn-emboss-primary` | ☐ |
| "Connected" state | Green check, disabled look | ☐ |
| Challenge cards | `.panel` with icon, progress bar | ☐ |
| Challenge progress | "X / Y" with `.progress-bar` | ☐ |
| Points badge | `.pill-gold` | ☐ |
| Completed challenge | Green bg, checkmark | ☐ |

### Missing Features (CRITICAL for Beth Lee)

| Feature | Expected | Status |
|---------|----------|--------|
| Profile setup wizard | /connect/profile - 4-step flow | ☐ |
| Step 1: Photo, name, role | Form with selections | ☐ |
| Step 2: Location, assignment, year | Dropdowns and inputs | ☐ |
| Step 3: Topic interests | Multi-select (max 3) | ☐ |
| Step 4: Bio, looking for, coffee | Text + toggles | ☐ |
| QR code display | /connect/qr - Show my code | ☐ |
| QR code scanner | Camera integration | ☐ |
| Connection celebration | Modal with animation, +50 pts | ☐ |
| Speed networking mode | /connect/speed | ☐ |
| 5-minute countdown timer | Large, color-changing | ☐ |
| Match profile card | Full details | ☐ |
| Conversation starters | Role-based suggestions | ☐ |
| "End & Connect" / "Skip" buttons | Clear actions | ☐ |
| Rating modal (1-5 stars) | After session | ☐ |
| Real attendee data | More than 10 mock profiles | ☐ |
| Smart matching | Recommendations based on interests | ☐ |

---

## 5. DISEASE DETECTIVE (Reference Standard)

### Landing Page (/detective)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Era cards | `.game-card` with era-specific accent | ☐ |
| Era badges | `.pill` with era colors (gold/blue/purple) | ☐ |
| Case count | Clear "X cases" indicator | ☐ |
| Hover effect | Lift + accent bar appears | ☐ |

### Case List (/detective/1950s)

| Element | Expected Style | Status |
|---------|---------------|--------|
| Case cards | `.case-card` with era styling | ☐ |
| Difficulty stars | Visual indicator | ☐ |
| Points value | Prominent | ☐ |

### Case Detail (/detective/1950s/{caseId})

| Element | Expected Style | Status |
|---------|---------------|--------|
| Phase plate image | Framed, era-appropriate | ☐ |
| Era badge | `.pill` with color | ☐ |
| Year | Text indicator | ☐ |
| Difficulty stars | Visual | ☐ |
| Briefing panel | `.panel` with email/memo styling | ☐ |
| From/Subject/Date | Metadata fields | ☐ |
| Briefing content | Readable text | ☐ |
| "Begin Investigation" button | `.btn-emboss-primary btn-emboss-lg` | ☐ |
| Time limit note | Small text | ☐ |
| Timer (during investigation) | Prominent, color-coded | ☐ |
| Points remaining | Clear display | ☐ |
| Progress bar | `.progress-bar` with time | ☐ |
| Clue cards | `.clue-card` with dashed border | ☐ |
| Locked clue | Grayed, point cost shown | ☐ |
| Revealed clue | Full content, icon | ☐ |
| "Ready to Diagnose" button | `.btn-emboss-primary` | ☐ |
| Diagnosis options | Clear selected state | ☐ |
| "Submit Diagnosis" button | `.btn-emboss-primary` | ☐ |
| Results - success | Green icon, "Case Solved!" | ☐ |
| Results - failure | Red icon, partial credit | ☐ |
| Score | `.animate-score-pop`, gold color | ☐ |
| "The Real Story" panel | `.panel` with explanation | ☐ |
| EIS Legacy section | Themed background | ☐ |
| Navigation buttons | `.btn-emboss` row | ☐ |

---

# QUICK VISUAL TESTS

Run these tests on each game:

## 1. The "Squint Test"
Squint at the page. Does it look:
- ✅ Premium, museum-quality, polished?
- ❌ Flat, generic, Bootstrap-default?

## 2. The "Button Test"
Do buttons have:
- ✅ 3D raised appearance with shadow underneath?
- ❌ Flat appearance like basic HTML buttons?

## 3. The "Card Test"
Do cards have:
- ✅ Subtle gradient, visible border, layered shadows?
- ❌ Plain white background with basic shadow?

## 4. The "Consistency Test"
Are similar elements styled the same way?
- ✅ All primary buttons look identical across games?
- ❌ Different button styles in different places?

---

# REPORT TEMPLATE

After completing audit, fill out:

```markdown
## UX/UI Audit Report - [Date]

### Overall Score: X/10

### PREDICT THE OUTBREAK
**Landing Page:** X/10
- ✅ [What's correct]
- ❌ [What needs fixing]

**Challenge Detail:** X/10
- ✅ [What's correct]
- ❌ [What needs fixing]

### PATIENT ZERO
**Score:** X/10
- ✅ [What's correct]
- ❌ [What needs fixing]
- ⚠️ Missing: World map

### OUTBREAK COMMAND
**Score:** X/10
- ✅ [What's correct]
- ❌ [What needs fixing]
- ⚠️ Missing: Tutorial, feedback

### EPICONNECT
**Score:** X/10
- ✅ [What's correct]
- ❌ [What needs fixing]
- ⚠️ Missing: Profile, QR, Speed networking

### DISEASE DETECTIVE (Reference)
**Score:** 10/10 (baseline)

---

### Priority Fixes

1. **CRITICAL:** [Item]
2. **HIGH:** [Item]
3. **MEDIUM:** [Item]

### Specific CSS Changes Needed

**File:** src/pages/Predict.tsx
- Line X: Change `className="bg-white..."` to `className="panel"`
- Line Y: Change `className="py-3 bg-blue-600..."` to `className="btn-emboss btn-emboss-primary"`

[Continue for each file...]
```

---

# SUCCESS CRITERIA

The audit passes when:
1. All games visually match Disease Detective's premium aesthetic
2. All buttons use `.btn-emboss` styling
3. All cards use `.panel` styling
4. All stats use `.stat-card` styling
5. All section headers use `.section-header` pattern
6. Animations are present (slide-up, score-pop)
7. No flat/generic UI elements remain
