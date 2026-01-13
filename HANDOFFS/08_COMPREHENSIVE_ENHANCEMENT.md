# EIS 75TH GAMES: Comprehensive Enhancement Handoff
## CSS Fixes + Patient Zero Background + Predict Polish + EpiConnect Redesign

**Date:** January 13, 2026  
**Repo:** `D:\eis-75th-games`

---

# PRIORITY OVERVIEW

| Priority | Task | Est. Time |
|----------|------|-----------|
| 🔴 HIGH | Button color CSS fixes (gold not blue) | 30 min |
| 🔴 HIGH | Patient Zero background improvement | 30 min |
| 🟠 MEDIUM | Predict the Outbreak polish | 2-3 hrs |
| 🟠 MEDIUM | EpiConnect Instagram-style redesign | 3-4 hrs |

**Total: 6-8 hours**

---

# FIX 1: BUTTON COLORS (Add to brand.css)

```css
/* Gold buttons for Predict */
[data-theme="predict"] .btn-emboss-primary {
  background: linear-gradient(135deg, #D4AF37, #B8860B) !important;
  color: #0f0f0f !important;
}

/* Gold buttons for Patient Zero */
[data-theme="patient-zero"] .btn-emboss-primary {
  background: linear-gradient(135deg, #D4AF37, #B8860B) !important;
  color: #0f0f0f !important;
}

/* Gold progress bars for Predict */
[data-theme="predict"] .progress-fill {
  background: linear-gradient(90deg, #D4AF37, #B8860B) !important;
}
```

---

# FIX 2: PATIENT ZERO BACKGROUND

Replace dark brown with warm cork/parchment texture:

```css
[data-theme="patient-zero"] .app-bg {
  background: #d8c8b8;
  background-image:
    radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,240,230,0.7) 0%, transparent 60%),
    linear-gradient(180deg, #d4c4b4 0%, #c9b9a9 20%, #bfafa0 50%, #b5a595 100%);
}

[data-theme="patient-zero"] .app-bg::before {
  background-image: radial-gradient(circle, rgba(139,69,69,0.08) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

---

# FIX 3: PREDICT POLISH

1. Live Challenge card → Use `.panel` with red top accent bar
2. Section headers → Use `.section-header` pattern
3. Epi context → Use `.stat-card` grid
4. Cards → Add hover effects

---

# FIX 4: EPICONNECT REDESIGN

Adopt the Instagram-style feed layout from EIS Recruitment module:

### Three-Column Layout
- **Left sidebar:** User profile, activity feed, timeline
- **Center feed:** Filter tabs (All/Attendees/Challenges), Online Now carousel, cards
- **Right sidebar:** Tips, quick links

### Key Components
- `ConnectFeedPage.tsx` - Main Instagram-style feed
- `ConnectLeftSidebar.tsx` - User profile, activity
- `OnlineNowCarousel.tsx` - Horizontal scroll of online users
- `AttendeeCard.tsx` - Updated Instagram-style cards

### Benefits
1. Familiar UX from Recruitment module
2. Better content discovery
3. Surfaces online users
4. Mobile responsive
5. Future Convene integration

See full handoff document for complete component code.

---

# VERIFICATION

After fixes:
- [ ] All buttons gold (not blue/red)
- [ ] Patient Zero has warm textured background
- [ ] Predict looks polished like Detective
- [ ] EpiConnect has 3-column Instagram layout
