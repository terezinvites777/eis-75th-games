# EIS 75th Anniversary Games

Interactive games celebrating 75 years of the CDC Epidemic Intelligence Service (1951-2026).

🎮 **Live Demo**: https://eis-75th-games.vercel.app

## Games

### 🔍 Disease Detective
Solve real outbreak mysteries from EIS history. Each case is based on actual EIS investigations with authentic epidemiologic data.

**10 Cases across 3 Eras:**

| Era | Cases | Description |
|-----|-------|-------------|
| **1950s - Shoe Leather Era** | 3 cases | The birth of disease detection |
| **1980s - Laboratory Revolution** | 3 cases | New tools for new threats |
| **2010s - Genomic Age** | 4 cases | Global health security |

**Featured Cases:**
- Oswego Church Supper (1940) - The first EIS training case
- Cutter Incident (1955) - Vaccine safety origins
- Toxic Shock Syndrome (1980) - Consumer product epidemiology
- Legionnaires' in Bogalusa (1989) - When obvious sources are wrong
- Peanut Butter Salmonella (2009) - Ingredient-driven outbreaks
- Fungal Meningitis (2012) - Compounding pharmacy catastrophe
- Ebola in Dallas (2014) - First U.S. case
- Zika on Yap Island (2007) - Emergence of a pandemic virus

### 🎯 Outbreak Command (Coming Soon)
Lead outbreak response operations. Manage resources, make critical decisions, and contain emerging threats.

### 👥 EpiConnect (Coming Soon)
Network with fellow EIS officers and complete social challenges.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: Framer Motion
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## Design System

Custom "75th Anniversary" design language featuring:
- CDC official colors (Blue #0057B8, Teal #0077B6)
- Anniversary gold/bronze accents (#D4AF37, #B8860B)
- Era-specific theming (1950s gold, 1980s blue, 2010s purple)
- Glassmorphism surfaces
- Embossed button treatments
- Responsive mobile-first layout

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── brand/          # Logo, badges, branding
│   ├── detective/      # Disease Detective components
│   ├── layout/         # GameShell, navigation
│   └── ui/             # Buttons, cards, modals
├── data/
│   └── detective/      # Real case study data
├── pages/              # Route components
├── store/              # Zustand state management
├── styles/             # brand.css design system
└── types/              # TypeScript definitions
```

## Case Study Sources

All cases are based on real EIS investigations from:
- CDC Case Studies in Applied Epidemiology
- EPICC Training Materials
- MMWR Reports
- EIS Summer Course SCORE Exercises

## Credits

Built for the EIS 75th Anniversary Summit (2026) by Exquisite Events.

Educational use only. Not for clinical decision-making.
