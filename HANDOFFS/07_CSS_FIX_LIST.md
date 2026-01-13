# EIS 75TH GAMES: CSS Fix List for Claude Code
## Based on Claude Extension Test Report - January 12, 2026

---

# EXECUTIVE SUMMARY

✅ **All 6 games are FUNCTIONALLY COMPLETE**
✅ **All gameplay mechanics work correctly**
⚠️ **Only CSS color adjustments needed**

**Estimated Fix Time:** 1-2 hours

---

# THE CORE ISSUE

The `.btn-emboss-primary` class uses **BLUE** gradient instead of **GOLD** in Predict and Patient Zero themes.

Disease Detective (the reference) has correct gold styling.

---

# QUICK FIX

Add this to the END of `src/styles/brand.css`:

```css
/* ============================================
   BUTTON COLOR FIXES - January 12, 2026
   Force gold styling on primary buttons for
   Predict and Patient Zero games
   ============================================ */

/* Gold buttons for Predict the Outbreak */
[data-theme="predict"] .btn-emboss-primary {
  background: linear-gradient(135deg, #D4AF37, #B8860B) !important;
  color: #0f0f0f !important;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.30);
}

/* Gold buttons for Patient Zero */
[data-theme="patient-zero"] .btn-emboss-primary {
  background: linear-gradient(135deg, #D4AF37, #B8860B) !important;
  color: #0f0f0f !important;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.30);
}

/* Gold progress bars for Predict */
[data-theme="predict"] .progress-fill {
  background: linear-gradient(90deg, #D4AF37, #B8860B) !important;
}
```

---

# DETAILED FIXES

## HIGH PRIORITY

### 1. Patient Zero "Submit Theory" Button
**File:** Component with theory form  
**Current:** Flat red button  
**Fix:** Change class to `btn-emboss btn-emboss-primary`

### 2. Patient Zero "Investigate Case" Button
**File:** Patient Zero landing  
**Current:** Flat red button  
**Fix:** Change class to `btn-emboss btn-emboss-primary`

## MEDIUM PRIORITY

### 3. Predict Live Challenge Card
**Current:** Red left border only  
**Fix:** Add full `.panel` class

### 4. Predict Progress Bar
**Current:** Blue  
**Fix:** Gold gradient (see CSS above)

## LOW PRIORITY

### 5. Outbreak Command Action Buttons
**Current:** Gray outline  
**Fix:** Add `.btn-emboss btn-emboss-sm` class

---

# VERIFICATION AFTER FIX

- [ ] Predict "Enter Challenge" button is GOLD
- [ ] Predict "Submit Prediction" button is GOLD
- [ ] Patient Zero "Investigate Case" button is GOLD
- [ ] Patient Zero "Submit Theory" button is GOLD (not flat red)
- [ ] Predict progress bar is gold/amber

---

# WHAT'S ALREADY PERFECT ✅

- Disease Detective (gold standard)
- EpiConnect (purple theme works great)
- 75 Years, 75 Stories (complete)
- Outbreak Command (visibility fixed)
- Patient Zero world map
- All gameplay mechanics
- Leaderboard
- Navigation
- Mobile responsive

**Games are demo-ready - these are polish items only!**
