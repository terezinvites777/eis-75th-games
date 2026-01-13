# EPICONNECT: Game Enhancement Handoff
## Speed Networking for EIS Officers - BRANCH CHIEF PRIORITY

**Date:** January 12, 2026  
**Priority:** HIGH - Requested by Beth Lee (Branch Chief)  
**Current Status:** Basic MVP with mock data  

---

# BUSINESS CONTEXT

Beth Lee specifically requested networking functionality to address:
- **Current pain point:** 72-channel Slack problem during recruitment
- **Conference challenge:** 400+ attendees need to connect meaningfully
- **EIS culture:** Networking is critical for career development
- **75th Anniversary:** Perfect opportunity for cross-generational connections

This is NOT just a game - it's a **functional networking tool** disguised as gamification.

---

# CRITICAL MISSING FEATURES

## 1. User Profile System (CRITICAL)
4-step profile creation wizard:
- **Step 1:** Photo upload, name, role selection
- **Step 2:** Home state, current assignment, EIS class year
- **Step 3:** Topic interests (select up to 3)
- **Step 4:** Bio, looking for (Mentor/Mentee/Peer/Collaborator), open to coffee

## 2. QR Code Connection System (CRITICAL)
- Generate unique QR code per user
- QR scanner to connect in-person
- Celebration animation on successful scan (+50 pts)
- This verifies REAL interactions at conference

## 3. Speed Networking Timer (HIGH)
- "Find My Match" → shows random attendee card
- 5-minute countdown timer
- Conversation starters based on role
- "End & Connect" or "Skip" buttons
- 1-5 star rating after conversation

## 4. Real Attendee Data (HIGH)
Import from existing Convene database:
- 800+ officers (name, class year, assignment, interests)
- 100+ supervisors
- OR parse EventPower URL params: `?showcode=26CDC-EIS&c1d={attendee_id}`

## 5. Smart Matching Algorithm (MEDIUM)
Score candidates by:
- Shared topic interests (+20 per match)
- Mentor/mentee complementarity (+30)
- Geographic diversity (+10)
- Same assignment location (+15)
- Class year proximity (+15)

---

# DATABASE SCHEMA

```sql
CREATE TABLE games_connect_profiles (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES games_players(id),
  photo_url TEXT,
  role TEXT NOT NULL,
  eis_class_year INTEGER,
  home_state TEXT,
  current_assignment TEXT,
  topics TEXT[] DEFAULT '{}',
  bio TEXT,
  looking_for TEXT[] DEFAULT '{}',
  open_to_coffee BOOLEAN DEFAULT true
);

CREATE TABLE games_connect_connections (
  id UUID PRIMARY KEY,
  player_id UUID,
  connected_player_id UUID,
  connection_method TEXT DEFAULT 'qr_scan',
  rating INTEGER,
  points_earned INTEGER DEFAULT 25,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# ROUTES TO ADD

```
/connect              → ConnectHub (main landing)
/connect/profile      → ProfileSetup (4-step wizard)
/connect/discover     → Browse attendees with filters
/connect/speed        → Speed networking mode
/connect/qr           → QR code show/scan
/connect/connections  → My network
/connect/challenges   → Challenge progress
/connect/leaderboard  → Top networkers
```

---

# IMPLEMENTATION CHECKLIST

## Critical (Before Demo to Beth Lee)
- [ ] User profile creation flow (4 steps)
- [ ] Import real attendee data from Convene database
- [ ] QR code generation for each user
- [ ] QR code scanning for in-person connections
- [ ] Connection confirmation with points celebration

## High Priority (For Conference)
- [ ] Speed networking timer (5-minute sessions)
- [ ] Smart matching algorithm
- [ ] EventPower URL parameter parsing
- [ ] Conversation starters based on role
- [ ] Connection rating system

## Medium Priority (Polish)
- [ ] Contact card exchange
- [ ] LinkedIn integration
- [ ] Photo upload/import
- [ ] Push notifications for matches
- [ ] Leaderboard with top networkers

---

# ESTIMATED TIME: 12-16 hours

See full component code examples in the master handoff document.
