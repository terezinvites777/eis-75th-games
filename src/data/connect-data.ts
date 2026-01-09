// src/data/connect-data.ts
// EpiConnect networking game data

import type { AttendeeProfile, ConnectChallenge, Topic } from '../types/connect';

export const connectChallenges: ConnectChallenge[] = [
  {
    id: 'first-connect',
    title: 'First Connection',
    description: 'Make your first connection with another attendee',
    points: 50,
    icon: '🤝',
    criteria_type: 'single_match',
  },
  {
    id: 'alumni-wisdom',
    title: 'Alumni Wisdom',
    description: 'Connect with an EIS alumni',
    points: 75,
    icon: '🎓',
    criteria_type: 'single_match',
  },
  {
    id: 'topic-expert',
    title: 'Topic Expert',
    description: 'Connect with 3 people who share your topic interests',
    points: 100,
    icon: '🔬',
    criteria_type: 'cumulative',
  },
  {
    id: 'cross-country',
    title: 'Cross-Country Connection',
    description: 'Connect with someone from the opposite coast',
    points: 100,
    icon: '🗺️',
    criteria_type: 'single_match',
  },
  {
    id: 'mentor-match',
    title: 'Mentor Match',
    description: 'Connect with a supervisor or senior EIS officer',
    points: 150,
    icon: '⭐',
    criteria_type: 'single_match',
  },
  {
    id: 'network-builder',
    title: 'Network Builder',
    description: 'Make 10 total connections',
    points: 200,
    icon: '🌐',
    criteria_type: 'cumulative',
  },
  {
    id: 'global-health',
    title: 'Global Health Champion',
    description: 'Connect with someone interested in global health',
    points: 75,
    icon: '🌍',
    criteria_type: 'single_match',
  },
  {
    id: 'cohort-buddy',
    title: 'Cohort Buddy',
    description: 'Connect with another incoming EIS officer',
    points: 50,
    icon: '👥',
    criteria_type: 'single_match',
  },
];

// Mock attendee profiles for demo/testing
export const mockAttendees: AttendeeProfile[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'California',
    assignment_location: 'CDC Atlanta',
    topics: ['respiratory', 'global_health'],
    bio: 'Infectious disease physician passionate about pandemic preparedness. Previously worked with MSF in West Africa.',
  },
  {
    id: '2',
    name: 'Dr. Marcus Johnson',
    role: 'second_year',
    eis_class_year: 2024,
    home_state: 'Texas',
    assignment_location: 'Texas DSHS',
    topics: ['foodborne', 'environmental'],
    bio: 'Currently investigating a multi-state Salmonella outbreak. Happy to share experiences with incoming officers!',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    role: 'alumni',
    eis_class_year: 2018,
    home_state: 'New York',
    assignment_location: 'NYC DOHMH',
    topics: ['respiratory', 'antimicrobial_resistance'],
    bio: 'EIS Class of 2018. Now leading TB control in NYC. Ask me about urban outbreak response!',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    role: 'supervisor',
    home_state: 'Georgia',
    assignment_location: 'CDC NCEZID',
    topics: ['vector_borne', 'global_health'],
    bio: 'Division supervisor with 20 years at CDC. Led Zika response in 2016. Excited to mentor new EIS officers.',
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'Illinois',
    assignment_location: 'Illinois DPH',
    topics: ['chronic_disease', 'injury'],
    bio: 'Preventive medicine resident excited to apply skills to population health. Interested in health equity.',
  },
  {
    id: '6',
    name: 'Dr. Kevin O\'Brien',
    role: 'second_year',
    eis_class_year: 2024,
    home_state: 'Washington',
    assignment_location: 'Washington DOH',
    topics: ['maternal_child', 'injury'],
    bio: 'Pediatrician turned epi. Working on childhood injury prevention. Love helping new officers navigate first year!',
  },
  {
    id: '7',
    name: 'Dr. Lisa Thompson',
    role: 'alumni',
    eis_class_year: 2010,
    home_state: 'Massachusetts',
    assignment_location: 'Harvard T.H. Chan',
    topics: ['global_health', 'respiratory'],
    bio: 'Now in academia but forever an EIS officer at heart. Worked on H1N1 response. Happy to network!',
  },
  {
    id: '8',
    name: 'Dr. David Kim',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'Florida',
    assignment_location: 'CDC NCIRD',
    topics: ['respiratory', 'antimicrobial_resistance'],
    bio: 'ID fellow excited to join EIS. Research background in influenza vaccine effectiveness.',
  },
  {
    id: '9',
    name: 'Dr. Rachel Green',
    role: 'supervisor',
    home_state: 'Colorado',
    assignment_location: 'Colorado DPH',
    topics: ['foodborne', 'environmental'],
    bio: 'State epidemiologist supervising EIS officers. Passionate about applied epi and mentorship.',
  },
  {
    id: '10',
    name: 'Dr. Michael Brown',
    role: 'alumni',
    eis_class_year: 2015,
    home_state: 'Arizona',
    assignment_location: 'WHO Geneva',
    topics: ['vector_borne', 'global_health'],
    bio: 'Now at WHO working on dengue control. EIS opened doors I never imagined. Happy to share my journey!',
  },
];

export const topicLabels: Record<Topic, string> = {
  foodborne: 'Foodborne/Enteric',
  respiratory: 'Respiratory',
  vector_borne: 'Vector-borne',
  chronic_disease: 'Chronic Disease',
  injury: 'Injury Prevention',
  environmental: 'Environmental Health',
  maternal_child: 'Maternal & Child Health',
  antimicrobial_resistance: 'AMR',
  global_health: 'Global Health',
};

export function getAttendeeById(id: string): AttendeeProfile | undefined {
  return mockAttendees.find(a => a.id === id);
}

export function getAttendeesByRole(role: AttendeeProfile['role']): AttendeeProfile[] {
  return mockAttendees.filter(a => a.role === role);
}

export function getAttendeesByTopic(topic: Topic): AttendeeProfile[] {
  return mockAttendees.filter(a => a.topics.includes(topic));
}
