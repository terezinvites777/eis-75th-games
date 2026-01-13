# PATIENT ZERO: Critical Bug Fixes
## Issues Discovered January 13, 2026

**Priority:** 🔴 HIGH - Game is broken

---

# BUGS IDENTIFIED

## Bug 1: Map Popup Card - Empty/No Content
**Screenshot 1:** Popup when hovering map pin shows NOTHING - completely blank

**Fix:** Ensure popup component receives and displays mystery data
```tsx
<MapPopup mystery={selectedMystery}>
  <h3>{mystery.title}</h3>
  <p>{mystery.description}</p>
</MapPopup>
```

---

## Bug 2: Map Popup Card - Content Cut Off  
**Screenshot 2:** "Menstrual Mystery" text is cut off

**Fix:** Remove overflow constraints on popup container
```css
.map-popup {
  min-width: 250px;
  max-width: 350px;
  overflow: visible;
}
```

---

## Bug 3: Solution/Score Not Revealing 🔴 CRITICAL
**Description:** After submitting theory, NO results shown. Was working before!

**Check:**
1. Browser console for errors on submit
2. State management (`setShowResults(true)`)
3. Results panel conditional render

**Fix Pattern:**
```tsx
const handleSubmitTheory = async (theory) => {
  const results = calculateScore(theory, mystery.solution);
  setResults(results);
  setShowResults(true); // <-- Ensure this is set
};
```

---

## Bug 4: Hero Title Not Legible
**Issue:** "Where in the World is Patient Zero?" - dark text on red, can't read

**Fix:**
```tsx
<h1 className="text-3xl font-bold text-white drop-shadow-lg">
  Where in the World is Patient Zero?
</h1>
```

---

# PRIORITY ORDER

1. **🔴 CRITICAL:** Solution/Score not revealing (game unplayable)
2. **🔴 HIGH:** Map popup cards empty/cut off
3. **🟠 MEDIUM:** Hero title legibility

---

# VERIFICATION CHECKLIST

- [ ] Hover any map pin → Full popup content visible
- [ ] Submit theory → Results panel appears
- [ ] Score displays correctly
- [ ] "The Real Story" shows solution
- [ ] Hero title is white/readable

---

# ESTIMATED FIX TIME: 2 hours
