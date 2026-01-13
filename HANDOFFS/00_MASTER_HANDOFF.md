# EIS 75TH ANNIVERSARY GAMES: Master Enhancement Handoff
## Consolidated Development Priorities for Claude Code

**Date:** January 12, 2026  
**Repo:** `D:\eis-75th-games`  
**Live URL:** https://eis-75th-games.vercel.app  
**Conference Date:** April 28 - May 1, 2026

---

# EXECUTIVE SUMMARY

This document consolidates all UX/UI enhancements across the 6-game suite for the EIS 75th Anniversary celebration. Games are prioritized by:
1. **Branch Chief priority** (Beth Lee specifically requested EpiConnect)
2. **Conference readiness** (features needed for live event)
3. **Demo impact** (what will impress stakeholders)

---

# PRIORITY MATRIX

| Priority | Game | Status | Est. Time | Why |
|----------|------|--------|-----------|-----|
| 🔴 P0 | **EpiConnect** | Basic MVP | 12-16 hrs | Branch Chief requested; actual networking tool |
| 🔴 P0 | **Disease Detective** | ✅ Complete | Polish only | Flagship game, already polished |
| 🟠 P1 | **Predict the Outbreak** | 80% Done | 3-4 hrs | UX alignment with Detective style |
| 🟠 P1 | **Patient Zero** | 80% Done | 3-4 hrs | UX alignment + World Map |
| 🟡 P2 | **Outbreak Command** | Functional | 6-8 hrs | Visibility fixes, feedback systems |
| 🟡 P2 | **75 Years, 75 Stories** | Not Started | 4-6 hrs | Video gallery + memory wall |

---

# TOTAL ESTIMATED HOURS: 35-45 hours

| Game | Hours | Priority |
|------|-------|----------|
| EpiConnect | 12-16 | 🔴 P0 |
| Predict UX | 3-4 | 🟠 P1 |
| Patient Zero UX | 3-4 | 🟠 P1 |
| Outbreak Command | 6-8 | 🟡 P2 |
| 75 Stories | 4-6 | 🟡 P2 |
| Testing/Polish | 6-8 | All |

---

# IMPLEMENTATION ORDER

## Week 1: Critical Path
1. **EpiConnect Profile System** (4 hrs) - See `01_EPICONNECT_HANDOFF.md`
2. **EpiConnect QR Codes** (3 hrs)
3. **Predict/Patient Zero UX Alignment** (4 hrs) - See `02_PREDICT_UX_HANDOFF.md`

## Week 2: Enhancement
4. **EpiConnect Speed Networking** (3 hrs)
5. **EpiConnect Real Data Import** (2 hrs)
6. **Patient Zero World Map** (3 hrs)

## Week 3: Polish
7. **Outbreak Command Fixes** (6 hrs) - See `03_OUTBREAK_COMMAND_HANDOFF.md`
8. **75 Stories Build** (6 hrs)

## Week 4: Testing & Demo Prep
9. Cross-game testing
10. Mobile responsiveness
11. Demo data seeding

---

# DESIGN SYSTEM QUICK REFERENCE

All classes are defined in `src/styles/brand.css`

## CSS Classes to Use

### Cards & Surfaces
```css
.panel              /* White card with gradient, border, shadow */
.panel-themed       /* Themed background color */
.stat-card          /* Centered stat display */
```

### Buttons
```css
.btn-emboss                    /* Base 3D button */
.btn-emboss-primary            /* Gold/themed gradient */
.btn-emboss-sm / .btn-emboss-lg
```

### Typography
```css
.section-header + .section-title + .section-header-line
.pill / .pill-themed / .pill-gold
.text-gradient-gold
```

### Animations
```css
.animate-slide-up
.animate-score-pop
.animate-pulse-glow
```

---

# THEME TOKENS

Each game has a theme defined in brand.css:

```css
[data-theme="detective"]   /* Gold/Bronze - #B8860B, #D4AF37 */
[data-theme="command"]     /* Blue - #0057B8, #0077B6 */
[data-theme="connect"]     /* Purple - #7A2A7E, #A66BB6 */
[data-theme="patient-zero"] /* Red - #dc2626, #ef4444 */
[data-theme="predict"]     /* Blue - #2563eb, #3b82f6 */
```

Use `<GameShell theme="predict">` to apply theme throughout a game.

---

# SEE INDIVIDUAL HANDOFFS FOR DETAILS

- `01_EPICONNECT_HANDOFF.md` - Full EpiConnect specs (Profile, QR, Speed Networking)
- `02_PREDICT_UX_HANDOFF.md` - Predict the Outbreak UX alignment
- `03_OUTBREAK_COMMAND_HANDOFF.md` - Outbreak Command visibility fixes
- `04_PATIENT_ZERO_HANDOFF.md` - Patient Zero enhancements + World Map

---

# KEY SUCCESS METRICS

1. **EpiConnect adoption** - 200+ connections made at conference
2. **Game completion rates** - 50%+ of players finish at least one game
3. **Engagement time** - Average 10+ minutes per session
4. **Leaderboard participation** - 100+ unique players on boards

---

# FINAL NOTES

1. **Use existing CSS classes** - brand.css has everything you need
2. **Mobile-first** - Conference attendees will use phones
3. **Offline graceful** - Handle network drops during sessions
4. **Real data matters** - Import from Convene, not just mocks
5. **Beth Lee priority** - EpiConnect is the Branch Chief's request

Good luck! 🎉
