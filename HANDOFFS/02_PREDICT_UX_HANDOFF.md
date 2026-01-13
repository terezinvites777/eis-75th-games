# PREDICT THE OUTBREAK: UX Alignment Handoff
## Aligning Design with Disease Detective Visual Language

**Date:** January 12, 2026  
**Current Status:** 80% Complete - Functionality done, needs styling  
**Estimated Time:** 3-4 hours

---

# CURRENT STATE

Claude Code has built excellent functionality:
- ✅ Live Challenge banner with countdown
- ✅ Day progression (Day 1 of 4)
- ✅ Epidemiological Context panel (R₀, growth, trend)
- ✅ Draw Your Prediction canvas
- ✅ Enhanced sliders (Peak Week, Peak Cases, Total Cases, Duration)
- ✅ Quick estimates (3x, 5x, 8x, 12x)
- ✅ Scoring breakdown with early bonus

**But the visual style doesn't match Disease Detective's premium feel.**

---

# CSS CLASS REPLACEMENTS

The `brand.css` already has all needed classes. Just apply them:

| Current Style | Replace With |
|--------------|--------------|
| `bg-white rounded-xl shadow` | `.panel` |
| `bg-slate-800 rounded-xl` | `.panel-themed` |
| `py-3 bg-blue-600 text-white rounded-xl` | `.btn-emboss .btn-emboss-primary` |
| Plain stat displays | `.stat-card` with `.stat-value` and `.stat-label` |
| Colored badges | `.pill .pill-themed` or `.pill-gold` |
| Section text | `.section-header` with `.section-header-line` |

---

# COMPONENT-SPECIFIC UPDATES

## LiveChallengeBanner
```tsx
// Add pulse animation to live indicator
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
</span>

// Use progress-bar class
<div className="progress-bar">
  <div className="progress-fill" style={{ width: `${(day / totalDays) * 100}%` }} />
</div>
```

## EpiContext Panel
```tsx
// Use stat-card grid
<div className="grid grid-cols-2 gap-3">
  <div className="stat-card">
    <div className="stat-label">Weekly Growth</div>
    <div className="stat-value text-red-500">+112%</div>
  </div>
  // ... more stat-cards
</div>
```

## PredictionForm
```tsx
// Use embossed buttons for quick estimates
<button className="btn-emboss btn-emboss-sm">
  5x current (1,245)
</button>

// Use pill for slider values
<span className="pill pill-themed">Week 13</span>
```

## Results Display
```tsx
// Add score pop animation
<div className="text-4xl font-bold text-gradient-gold animate-score-pop">
  40 points
</div>
```

---

# ANIMATIONS TO ADD

From brand.css:
- `animate-slide-up` - Main content on load
- `animate-score-pop` - Score display (bouncy scale)
- `animate-pulse-glow` - Live challenge indicator

---

# IMPLEMENTATION CHECKLIST

- [ ] Ensure `<GameShell theme="predict">` is used
- [ ] Replace all card styles with `.panel`
- [ ] Replace all buttons with `.btn-emboss`
- [ ] Replace stat displays with `.stat-card`
- [ ] Use `.section-header` for section labels
- [ ] Use `.pill` and `.pill-themed` for badges
- [ ] Use `.progress-bar` for progress indicators
- [ ] Add `animate-score-pop` to results
- [ ] Add `animate-slide-up` to page load

---

# ESTIMATED TIME: 3-4 hours

This is primarily a CSS class replacement exercise. The functionality is already built.
