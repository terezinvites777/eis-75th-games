import { motion } from 'framer-motion';
import type { Era } from '../../types/game';

interface EraSelectorProps {
  onSelectEra: (era: Era) => void;
  completedEras?: Era[];
}

const eras: { era: Era; title: string; subtitle: string; icon: string; years: string }[] = [
  {
    era: '1950s',
    title: 'The Pioneers',
    subtitle: 'Birth of Disease Detection',
    icon: '🔬',
    years: '1951-1960',
  },
  {
    era: '1980s',
    title: 'Rising Threats',
    subtitle: 'New Challenges Emerge',
    icon: '🦠',
    years: '1981-1990',
  },
  {
    era: '2010s',
    title: 'Modern Era',
    subtitle: 'Global Health Security',
    icon: '🌍',
    years: '2011-2020',
  },
];

const eraStyles: Record<Era, { gradient: string; border: string }> = {
  '1950s': {
    gradient: 'from-amber-400 to-orange-500',
    border: 'border-amber-300',
  },
  '1980s': {
    gradient: 'from-blue-400 to-indigo-500',
    border: 'border-blue-300',
  },
  '2010s': {
    gradient: 'from-purple-400 to-pink-500',
    border: 'border-purple-300',
  },
};

export function EraSelector({ onSelectEra, completedEras = [] }: EraSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 text-center">Choose Your Era</h2>
      <div className="grid gap-4">
        {eras.map((eraData, index) => {
          const isCompleted = completedEras.includes(eraData.era);
          const styles = eraStyles[eraData.era];

          return (
            <motion.button
              key={eraData.era}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectEra(eraData.era)}
              className={`relative overflow-hidden rounded-xl p-6 text-left bg-gradient-to-r ${styles.gradient} text-white shadow-lg`}
            >
              {/* Completion badge */}
              {isCompleted && (
                <div className="absolute top-3 right-3 bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                  Completed
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="text-4xl">{eraData.icon}</div>
                <div>
                  <div className="text-sm font-medium text-white/80">{eraData.years}</div>
                  <h3 className="text-xl font-bold">{eraData.title}</h3>
                  <p className="text-sm text-white/90">{eraData.subtitle}</p>
                </div>
              </div>

              {/* Decorative pattern */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
