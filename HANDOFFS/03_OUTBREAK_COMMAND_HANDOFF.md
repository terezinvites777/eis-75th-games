# OUTBREAK COMMAND: Visibility & Feedback Fixes
## Making the Game Playable and Understandable

**Date:** January 12, 2026  
**Current Status:** Functional but poor UX  
**Estimated Time:** 6-8 hours

---

# CRITICAL ISSUES

1. **Title unreadable** - Dark blue on dark blue background
2. **Day counter invisible** - Dark text on dark background
3. **No gameplay instructions** - Players don't understand goals
4. **Map confusing** - Can't locate states mentioned in events
5. **No feedback** - Actions feel meaningless

---

# FIX 1: READABLE TEXT (30 min)

```tsx
// Title - add contrast
<h1 className="text-2xl font-bold text-white drop-shadow-lg">
  {scenario.title}
</h1>

// Day counter - make it HUGE and visible
<div className="bg-amber-500 text-white px-6 py-3 rounded-xl text-center">
  <div className="text-3xl font-bold">Day {currentDay}</div>
  <div className="text-sm opacity-80">of {totalDays}</div>
</div>
```

---

# FIX 2: TUTORIAL OVERLAY (2 hours)

Create `src/components/command/TutorialOverlay.tsx`:

```tsx
const TUTORIAL_STEPS = [
  { 
    title: 'Your Mission', 
    content: 'Stop the outbreak before it spreads nationwide', 
    icon: Target 
  },
  { 
    title: 'The Map', 
    content: 'Red states have active cases. Click to see details.', 
    icon: Map 
  },
  { 
    title: 'Resources', 
    content: 'You have limited budget, staff, and supplies', 
    icon: DollarSign 
  },
  { 
    title: 'Actions', 
    content: 'Deploy teams, issue advisories, request resources', 
    icon: Zap 
  },
  { 
    title: 'Time', 
    content: 'Each action takes days. The outbreak won\'t wait!', 
    icon: Clock 
  },
];
```

Store "tutorial seen" in localStorage. Show on first visit.

---

# FIX 3: MAP IMPROVEMENTS (2 hours)

Update `src/components/command/USMapInteractive.tsx`:

### Add State Labels
```tsx
// State abbreviation label on each state
<text
  x={centroid[0]}
  y={centroid[1]}
  textAnchor="middle"
  className="text-[8px] font-bold fill-slate-600 pointer-events-none"
>
  {stateAbbr}
</text>
```

### Highlight States in Events
```tsx
// When an event mentions "Louisiana", pulse that state
<Geography
  className={highlightedStates.includes(stateId) 
    ? 'animate-pulse stroke-amber-500 stroke-2' 
    : ''}
/>
```

### Sort State List by Cases
```tsx
// In the state list sidebar
const sortedStates = [...affectedStates].sort((a, b) => b.cases - a.cases);
```

---

# FIX 4: ACTION FEEDBACK (2 hours)

### AnimatedStat Component
```tsx
// src/components/command/AnimatedStat.tsx
<div className="relative">
  <span className="text-2xl font-bold">{value}</span>
  {change !== 0 && (
    <motion.span
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -20 }}
      className={change > 0 ? 'text-red-500' : 'text-green-500'}
    >
      {change > 0 ? '+' : ''}{change}
    </motion.span>
  )}
</div>
```

### Action Toast
```tsx
// src/components/command/ActionToast.tsx
<Toast>
  <CheckCircle className="text-green-500" />
  <span>Contact tracing deployed to Texas!</span>
  <span className="text-sm text-slate-500">Effect: -15% transmission</span>
</Toast>
```

---

# FIX 5: WIN/LOSE INDICATORS (1 hour)

Always show progress toward objectives:

```tsx
<div className="panel">
  <h3 className="font-semibold mb-3">Objectives</h3>
  
  <div className="space-y-2">
    <div>
      <div className="flex justify-between text-sm">
        <span>Contain to under 10 states</span>
        <span className={affectedStates > 7 ? 'text-red-500' : 'text-green-500'}>
          {affectedStates}/10
        </span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${(affectedStates / 10) * 100}%`,
            background: affectedStates > 7 ? '#ef4444' : '#22c55e'
          }} 
        />
      </div>
    </div>
    
    {/* Keep deaths under X */}
    {/* Resolve within Y days */}
  </div>
</div>
```

---

# IMPLEMENTATION CHECKLIST

## Immediate (1-2 hours)
- [ ] Fix title color to white with drop-shadow
- [ ] Make day counter large and amber-colored
- [ ] Add state abbreviation labels to map
- [ ] Sort state list by case count

## Feedback (2-3 hours)
- [ ] Create AnimatedStat component
- [ ] Create ActionToast component
- [ ] Add progress bars to in-progress actions
- [ ] Add case spread animations on map

## Tutorial (1-2 hours)
- [ ] Create TutorialOverlay component
- [ ] Add ObjectiveBanner always visible
- [ ] Create WinLoseIndicator component

---

# ESTIMATED TIME: 6-8 hours
