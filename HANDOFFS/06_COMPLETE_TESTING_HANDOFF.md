# EIS 75TH ANNIVERSARY GAMES: Complete Testing Handoff
## Comprehensive Functional & UX Testing for Claude Extension

**Date:** January 12, 2026  
**Live URL:** https://eis-75th-games.vercel.app  
**Purpose:** Test ALL functionality and UX across all 6 games, generate bug/fix list for Claude Code

---

# TESTING OVERVIEW

You will systematically test each game by:
1. **Navigating** through all screens and routes
2. **Interacting** with all buttons, forms, and interactive elements
3. **Verifying** UX styling matches the design system
4. **Documenting** any bugs, issues, or missing features

After testing, generate a comprehensive report with:
- ✅ What works correctly
- ❌ Bugs or broken functionality
- ⚠️ UX styling issues (not matching design system)
- 🔲 Missing features

---

# GAME 1: DISEASE DETECTIVE (Reference Standard)

## Test Routes
```
/detective                    → Landing page with era selection
/detective/1950s              → 1950s era case list
/detective/1980s              → 1980s era case list  
/detective/2010s              → 2010s era case list
/detective/1950s/{caseId}     → Individual case gameplay
```

## Test Scenarios

### Landing Page (/detective)
- [ ] Page loads without errors
- [ ] Stats display (Total Cases, Your Score, Rank)
- [ ] "How to Play" panel expands/collapses
- [ ] Era cards display with icons and case counts
- [ ] Clicking era card navigates to era page
- [ ] Hover effects on era cards

### Era Page (/detective/1950s)
- [ ] Back navigation works
- [ ] Case cards display with title, difficulty, points
- [ ] Difficulty stars render correctly
- [ ] Clicking case card navigates to case detail

### Case Gameplay (/detective/1950s/{caseId})
**Briefing Phase:**
- [ ] Case title and subtitle display
- [ ] Era badge shows correct era
- [ ] Briefing panel shows From/Subject/Date
- [ ] Briefing content is readable
- [ ] "Begin Investigation" button is embossed gold style
- [ ] Time limit displays correctly

**Investigation Phase:**
- [ ] Timer starts and counts down
- [ ] Timer changes color when low (<60s)
- [ ] Points display updates
- [ ] Progress bar animates
- [ ] Briefing can expand/collapse
- [ ] "Evidence (X/Y)" section header displays
- [ ] All clue cards render
- [ ] Locked clues show lock icon and point cost
- [ ] Clicking "Reveal" deducts points and shows content
- [ ] Revealed clues show category badge and content
- [ ] "Ready to Diagnose" button appears after revealing clues
- [ ] Button is disabled if no clues revealed

**Diagnosis Phase:**
- [ ] Pathogen options display with descriptions
- [ ] Source options display with descriptions
- [ ] Selecting option shows visual feedback (border change)
- [ ] "Submit Diagnosis" button is embossed style
- [ ] Button disabled until both selections made

**Results Phase:**
- [ ] Correct answer shows green checkmark, "Case Solved!"
- [ ] Incorrect answer shows red X, "Not Quite"
- [ ] Score displays with animation (score-pop)
- [ ] Time bonus calculated correctly
- [ ] "The Real Story" panel shows solution details
- [ ] EIS Legacy section displays
- [ ] "More Cases" button navigates back
- [ ] "Leaderboard" button navigates to leaderboard

### UX Verification
- [ ] All buttons use `.btn-emboss` styling (3D raised effect)
- [ ] All cards use `.panel` styling (gradient, border, shadow)
- [ ] Section headers use uppercase + gradient line
- [ ] Clue cards have paper texture and corner fold
- [ ] Color scheme matches era (gold for 1950s, blue for 1980s, purple for 2010s)

---

# GAME 2: PREDICT THE OUTBREAK

## Test Routes
```
/predict                      → Landing page with scenarios
/predict/scenario/{id}        → Practice scenario detail (if implemented)
/predict/challenge            → Live Mystery Outbreak 2026 (if separate route)
```

## Test Scenarios

### Landing Page (/predict)
- [ ] Page loads without errors
- [ ] Hero section with title displays
- [ ] Live Challenge card displays
- [ ] "Mystery Outbreak 2026" title visible
- [ ] Progress bar shows Day X of 4
- [ ] "Enter Challenge" button present and EMBOSSED GOLD style
- [ ] "2x early bonus!" badge displays (if Day 1)
- [ ] Countdown timer shows time to next data release
- [ ] "HOW IT WORKS" section displays with steps
- [ ] "PRACTICE SCENARIOS" section header displays
- [ ] Scenario cards display (Influenza, Norovirus, Measles)
- [ ] Each scenario shows pathogen badge, location, mini chart
- [ ] Clicking scenario navigates to detail
- [ ] All cards use `.panel` styling

### Challenge Detail (Mystery Outbreak 2026)
**Status Bar:**
- [ ] "LIVE" indicator with red dot
- [ ] "Day X of 4" displays correctly
- [ ] "X weeks available" shows data amount
- [ ] "Skip to Day 2" button works and uses `.btn-emboss` style
- [ ] Countdown timer displays

**Scenario Info:**
- [ ] Title "Mystery Outbreak 2026" displays
- [ ] Description text displays
- [ ] Pathogen badge uses `.pill` styling
- [ ] Location badge uses `.pill` styling

**Epidemiological Context:**
- [ ] Section header with uppercase + line
- [ ] GROWTH stat displays with color coding
- [ ] EST. R₀ stat displays
- [ ] TREND indicator displays
- [ ] DOUBLING TIME stat displays
- [ ] Uses `.stat-card` styling pattern
- [ ] Stats update when day changes

**Draw Your Prediction:**
- [ ] Section header with uppercase + line
- [ ] Canvas area with grid background in `.panel`
- [ ] Historical data line displays
- [ ] "NOW" marker visible
- [ ] Drawing with mouse/touch works
- [ ] Drawing connects to historical data
- [ ] Peak marker appears on drawn curve
- [ ] "Clear" button works and uses `.btn-emboss` style
- [ ] Stats update based on drawing

**Your Predictions (Sliders):**
- [ ] Section header displays
- [ ] Container uses `.panel` styling
- [ ] "2x bonus!" badge uses `.pill-gold` styling
- [ ] Peak Week slider works, value in `.pill` badge
- [ ] Peak Cases slider works, value in colored `.pill`
- [ ] Total Cases slider works, value in `.pill`
- [ ] Duration slider works, value in `.pill`
- [ ] Quick estimate buttons use `.btn-emboss-sm` styling
- [ ] "Show R₀ Estimate (+bonus)" expands advanced options

**Submit:**
- [ ] "Submit Prediction" button is `.btn-emboss .btn-emboss-primary .btn-emboss-lg`
- [ ] Button is GOLD/EMBOSSED, NOT flat blue
- [ ] Clicking submits prediction

**Results:**
- [ ] Results panel uses `.panel` styling
- [ ] Trophy/checkmark icon displays
- [ ] Score displays with `.animate-score-pop`
- [ ] Score uses `.text-gradient-gold` styling
- [ ] "Includes Xx early bonus!" shows if applicable
- [ ] Breakdown shows all categories
- [ ] "Update Prediction" button uses `.btn-emboss` styling

### UX Verification Checklist
- [ ] "Enter Challenge" button: EMBOSSED GOLD (not flat blue)
- [ ] "Skip to Day" button: EMBOSSED (not flat gray)
- [ ] Quick estimate buttons: EMBOSSED SMALL (not flat)
- [ ] "Submit Prediction" button: EMBOSSED GOLD LARGE (not flat blue)
- [ ] "Update Prediction" button: EMBOSSED (not flat)
- [ ] All cards use `.panel` (gradient bg, border, shadow)
- [ ] All section headers: uppercase + gradient line
- [ ] All badges use `.pill` styling

---

# GAME 3: PATIENT ZERO

## Test Routes
```
/patient-zero                 → Landing page with world map
/patient-zero/{mysteryId}     → Mystery case detail
```

## Test Scenarios

### Landing Page (/patient-zero)
- [ ] Page loads without errors
- [ ] World/US map displays
- [ ] Mystery pins display on map
- [ ] Unsolved mysteries show red/orange pulsing pins
- [ ] Solved mysteries show green pins
- [ ] Featured mystery highlighted (gold)
- [ ] Clicking pin navigates to mystery detail
- [ ] Featured case banner with gold styling
- [ ] "HOW TO PLAY" section displays
- [ ] "Investigate Case" button is EMBOSSED (not flat red)

### Mystery Detail (75th Anniversary Case)
**Header:**
- [ ] Back link works
- [ ] "Day X of 3" progress displays
- [ ] "Skip Day" button uses `.btn-emboss` styling
- [ ] Featured banner with gold styling

**Detective Board:**
- [ ] Board has cork/bulletin board aesthetic
- [ ] Uses `.panel` styling
- [ ] Clue cards appear as pinned notes
- [ ] Revealed clues show full text
- [ ] "Key clue" badges use `.pill` styling
- [ ] Locked clues show lock icon
- [ ] Clues unlock as days progress

**Stats Bar:**
- [ ] Uses `.stat-card` grid layout
- [ ] CASES stat: large value, uppercase label
- [ ] DEATHS stat: large value, uppercase label
- [ ] STATES stat: large value, uppercase label
- [ ] EIS OFFICERS stat: large value, uppercase label

**Submit Your Theory:**
- [ ] Section header with uppercase + line
- [ ] Form uses `.panel` styling
- [ ] All inputs have consistent styling
- [ ] Confidence selector has clear active state
- [ ] "Submit Theory" button is EMBOSSED GOLD (NOT flat red)

**Results:**
- [ ] Results panel uses `.panel` styling
- [ ] Score displays with animation
- [ ] Solution details display

### UX Verification Checklist
- [ ] "Investigate Case" button: EMBOSSED (not flat red)
- [ ] "Submit Theory" button: EMBOSSED GOLD (not flat red)
- [ ] "Skip Day" button: EMBOSSED (not flat)
- [ ] All cards use `.panel` styling
- [ ] Stats use `.stat-card` pattern
- [ ] All badges use `.pill` styling

---

# GAME 4: OUTBREAK COMMAND

## Test Routes
```
/command                      → Landing page with scenarios
/command/{scenarioId}         → Scenario gameplay
```

## Test Scenarios

### Landing Page (/command)
- [ ] Page loads without errors
- [ ] Scenario cards use `.panel` styling
- [ ] Difficulty indicators display
- [ ] Clicking scenario starts game

### Gameplay (/command/{scenarioId})
**CRITICAL VISIBILITY CHECKS:**
- [ ] Scenario title is READABLE (white/light text with shadow)
- [ ] Day counter is LARGE and HIGH CONTRAST
- [ ] All text is legible against backgrounds

**Header/Status:**
- [ ] Day counter prominent (large font, contrasting bg)
- [ ] Resource indicators display clearly

**US Map:**
- [ ] Map renders correctly
- [ ] State abbreviation labels visible on ALL states
- [ ] Affected states show red fill
- [ ] States mentioned in events pulse/highlight
- [ ] Case counts visible

**Actions:**
- [ ] Action buttons use `.btn-emboss` styling
- [ ] In-progress actions show progress bar
- [ ] Feedback when action completes

**Objectives:**
- [ ] Objectives always visible
- [ ] Progress bars use `.progress-bar` styling
- [ ] Color-coded progress (green/amber/red)

### UX Verification Checklist
- [ ] Title: READABLE (not dark on dark)
- [ ] Day counter: LARGE, HIGH CONTRAST
- [ ] Action buttons: EMBOSSED
- [ ] All panels use `.panel` styling
- [ ] Progress bars use gradient fill

---

# GAME 5: EPICONNECT

## Test Routes
```
/connect                      → Main hub with tabs
/connect/profile              → Profile setup (if exists)
/connect/qr                   → QR code display/scan (if exists)
/connect/speed                → Speed networking (if exists)
```

## Test Scenarios

### Main Hub (/connect)
- [ ] Page loads without errors
- [ ] Stats bar uses `.stat-card` styling
- [ ] Tab buttons have clear active state
- [ ] Filter buttons use `.btn-emboss` or `.pill` styling
- [ ] Attendee cards use `.panel` styling
- [ ] Role badges use colored `.pill` styling
- [ ] Topic tags use `.pill` styling
- [ ] "Connect" buttons use `.btn-emboss .btn-emboss-primary`
- [ ] Challenge cards use `.panel` styling
- [ ] Progress bars use `.progress-bar` styling

### Check for Missing Features
- [ ] Profile setup exists at /connect/profile
- [ ] QR codes exist at /connect/qr
- [ ] Speed networking exists at /connect/speed
- [ ] More than 10 attendee profiles (real data)
- [ ] Connection celebration animation

---

# GAME 6: 75 YEARS, 75 STORIES

## Test Routes
```
/stories                      → Check if exists
```

- [ ] Route exists or shows 404/Coming Soon
- [ ] If exists, test video gallery
- [ ] If exists, test timeline
- [ ] If exists, test memory wall

---

# CROSS-GAME TESTING

## Homepage
- [ ] All 6 game cards display
- [ ] Cards use `.game-card` styling with hover effect
- [ ] Each card links to correct game

## Global UX
- [ ] App background has stone texture
- [ ] All buttons site-wide use embossed styling
- [ ] All cards site-wide use panel styling
- [ ] Mobile responsive

---

# REPORT TEMPLATE

Generate a report in this format:

```markdown
# EIS 75th Games - Complete Test Report
**Date:** [Date]
**Tester:** Claude Extension

## Summary
- **Passed:** X ✅
- **Failed:** X ❌
- **UX Issues:** X ⚠️
- **Missing:** X 🔲

---

## DISEASE DETECTIVE: ✅ / ❌
[Details...]

## PREDICT THE OUTBREAK: ✅ / ❌
[Details...]

## PATIENT ZERO: ✅ / ❌
[Details...]

## OUTBREAK COMMAND: ✅ / ❌
[Details...]

## EPICONNECT: ✅ / ❌
[Details...]

## 75 STORIES: ✅ / 🔲
[Details...]

---

## Bug Fixes for Claude Code

### CRITICAL
1. [Bug + file path + fix]

### HIGH
1. [Issue + file path + fix]

### MEDIUM
1. [Issue + file path + fix]

---

## UX Fixes Needed
[Specific elements that need class changes]

---

## Missing Features
[Features that don't exist yet]
```

---

# SUCCESS CRITERIA

✅ All 6 games tested
✅ All interactive elements clicked
✅ All forms submitted
✅ All UX styling verified
✅ Comprehensive report generated
