# PATIENT ZERO: UX Alignment + World Map
## "Where in the World is Patient Zero?"

**Date:** January 12, 2026  
**Current Status:** 80% Complete - Missing world map  
**Estimated Time:** 5-6 hours

---

# CURRENT STATE (From Screenshots)

Claude Code has built:
- ✅ Detective board with pinned clue cards
- ✅ Progressive clue reveal (Day 1 AM/PM, Day 2/3 locked)
- ✅ Stats bar (Cases, Deaths, States)
- ✅ Theory submission form
- ✅ Red theme applied

---

# CRITICAL MISSING: WORLD MAP

The game is called "Where in the World is Patient Zero?" but has NO MAP!

## Add World Map Component

```tsx
// src/components/patient-zero/WorldMap.tsx
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface Mystery {
  id: string;
  title: string;
  coordinates: [number, number]; // [lng, lat]
  solved: boolean;
}

const mysteries: Mystery[] = [
  { 
    id: 'philadelphia', 
    title: 'The Philadelphia Mystery', 
    coordinates: [-75.16, 39.95], 
    solved: false 
  },
  { 
    id: 'four-corners', 
    title: 'The Four Corners Killer', 
    coordinates: [-109.05, 36.99], 
    solved: false 
  },
  { 
    id: 'nationwide', 
    title: 'The Menstrual Mystery', 
    coordinates: [-98.58, 39.83], 
    solved: false 
  },
];

export function WorldMap({ onSelectMystery, solvedMysteries }) {
  return (
    <div className="panel relative overflow-hidden">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography="/usa-topo.json">
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#ddd"
                stroke="#fff"
              />
            ))
          }
        </Geographies>
        
        {mysteries.map(mystery => (
          <Marker
            key={mystery.id}
            coordinates={mystery.coordinates}
            onClick={() => onSelectMystery(mystery.id)}
          >
            <circle
              r={8}
              fill={solvedMysteries.includes(mystery.id) ? '#22c55e' : '#dc2626'}
              className={!solvedMysteries.includes(mystery.id) ? 'animate-pulse' : ''}
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
```

Install: `npm install react-simple-maps`

---

# UX ALIGNMENT (Same as Predict)

Apply brand.css classes:

| Current | Replace With |
|---------|--------------|
| White cards | `.panel` |
| Flat buttons | `.btn-emboss .btn-emboss-primary` |
| Plain stats | `.stat-card` |
| Colored badges | `.pill .pill-themed` |

---

# 75TH ANNIVERSARY GRAND MYSTERY

Add a FEATURED mystery for the main conference event:

```typescript
// Add to patient-zero-data.ts
{
  id: '75th-anniversary-grand',
  title: 'The 75th Anniversary Case',
  subtitle: 'The investigation that defined EIS',
  isFeatured: true,
  solution: {
    outbreak: "Legionnaires' Disease",
    year: 1976,
    location: 'Philadelphia, Pennsylvania',
    pathogen: 'Legionella pneumophila',
    source: 'Bellevue-Stratford Hotel cooling tower',
  },
  clues: [/* 8 clues over 4 days */],
  impactStats: {
    totalCases: 182,
    deaths: 29,
    statesAffected: 23,
    eisOfficersDeployed: 20,
  },
}
```

## Featured Card Styling
```tsx
<div className="panel relative overflow-hidden border-2 border-amber-400">
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
  <span className="pill pill-gold">
    🏆 75th Anniversary Feature
  </span>
  {/* ... */}
</div>
```

---

# IMPLEMENTATION CHECKLIST

## World Map (2-3 hours)
- [ ] Install react-simple-maps
- [ ] Create WorldMap.tsx component
- [ ] Add USA topology JSON
- [ ] Pulsing red pins for unsolved mysteries
- [ ] Green pins for solved mysteries
- [ ] Click to investigate

## UX Alignment (2 hours)
- [ ] Apply `.panel` to all cards
- [ ] Apply `.btn-emboss` to all buttons
- [ ] Apply `.stat-card` to stats bar
- [ ] Apply `.pill` to badges
- [ ] Add animations

## 75th Anniversary Mystery (1 hour)
- [ ] Add featured mystery data
- [ ] Create featured card styling
- [ ] 8 clues over 4 days

---

# ESTIMATED TIME: 5-6 hours
