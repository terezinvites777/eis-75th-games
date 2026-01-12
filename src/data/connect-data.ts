// src/data/connect-data.ts
// EpiConnect networking game data

import type { AttendeeProfile, ConnectChallenge, Topic, AttendeeRole, LookingFor, MatchScore, UserProfile } from '../types/connect';

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
  {
    id: 'speed-demon',
    title: 'Speed Networking Star',
    description: 'Complete 3 speed networking sessions',
    points: 150,
    icon: '⚡',
    criteria_type: 'cumulative',
  },
  {
    id: 'qr-master',
    title: 'QR Master',
    description: 'Make 5 connections via QR code scanning',
    points: 125,
    icon: '📱',
    criteria_type: 'cumulative',
  },
  {
    id: 'decade-traveler',
    title: 'Decade Traveler',
    description: 'Connect with alumni from 3 different decades',
    points: 200,
    icon: '🕰️',
    criteria_type: 'cumulative',
  },
  {
    id: 'coffee-lover',
    title: 'Coffee Networker',
    description: 'Connect with 5 people open to coffee chats',
    points: 100,
    icon: '☕',
    criteria_type: 'cumulative',
  },
];

// Expanded mock attendee profiles for demo/testing
export const mockAttendees: AttendeeProfile[] = [
  // Incoming Class of 2025
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'California',
    assignment_location: 'CDC Atlanta',
    topics: ['respiratory', 'global_health'],
    bio: 'Infectious disease physician passionate about pandemic preparedness. Previously worked with MSF in West Africa.',
    looking_for: ['mentor', 'peer'],
    open_to_coffee: true,
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
    looking_for: ['mentor', 'peer'],
    open_to_coffee: true,
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
    looking_for: ['mentor', 'collaborator'],
    open_to_coffee: true,
  },
  {
    id: '11',
    name: 'Dr. Maya Williams',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'Georgia',
    assignment_location: 'CDC NCHHSTP',
    topics: ['chronic_disease', 'global_health'],
    bio: 'Internal medicine physician with MPH. Passionate about HIV prevention and care continuum.',
    looking_for: ['mentor', 'peer'],
    open_to_coffee: true,
  },
  {
    id: '12',
    name: 'Dr. Carlos Mendez',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'Texas',
    assignment_location: 'Texas DSHS',
    topics: ['foodborne', 'environmental'],
    bio: 'Family medicine doc from the border region. Interested in binational health issues.',
    looking_for: ['mentor', 'peer'],
    open_to_coffee: true,
  },
  {
    id: '13',
    name: 'Dr. Jennifer Liu',
    role: 'incoming',
    eis_class_year: 2025,
    home_state: 'New York',
    assignment_location: 'NYC DOHMH',
    topics: ['respiratory', 'injury'],
    bio: 'EM physician transitioning to public health. Saw the power of epi during COVID response.',
    looking_for: ['mentor'],
    open_to_coffee: false,
  },
  // Second Year EIS - Class of 2024
  {
    id: '2',
    name: 'Dr. Marcus Johnson',
    role: 'second_year',
    eis_class_year: 2024,
    home_state: 'Texas',
    assignment_location: 'Texas DSHS',
    topics: ['foodborne', 'environmental'],
    bio: 'Currently investigating a multi-state Salmonella outbreak. Happy to share experiences with incoming officers!',
    looking_for: ['mentee', 'peer'],
    open_to_coffee: true,
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
    looking_for: ['mentee', 'peer'],
    open_to_coffee: true,
  },
  {
    id: '14',
    name: 'Dr. Rachel Martinez',
    role: 'second_year',
    eis_class_year: 2024,
    home_state: 'Colorado',
    assignment_location: 'Colorado DPH',
    topics: ['chronic_disease', 'environmental'],
    bio: 'Working on lead exposure surveillance. EIS has been the best decision of my career!',
    looking_for: ['mentee', 'peer', 'collaborator'],
    open_to_coffee: true,
  },
  {
    id: '15',
    name: 'Dr. James Foster',
    role: 'second_year',
    eis_class_year: 2024,
    home_state: 'Minnesota',
    assignment_location: 'Minnesota DPH',
    topics: ['foodborne', 'antimicrobial_resistance'],
    bio: 'Just finished my EIS project on Cyclospora outbreaks. Ask me about fresh produce investigations!',
    looking_for: ['mentee', 'collaborator'],
    open_to_coffee: true,
  },
  // Alumni - Various Years
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    role: 'alumni',
    eis_class_year: 2018,
    home_state: 'New York',
    assignment_location: 'NYC DOHMH',
    topics: ['respiratory', 'antimicrobial_resistance'],
    bio: 'EIS Class of 2018. Now leading TB control in NYC. Ask me about urban outbreak response!',
    looking_for: ['mentee'],
    open_to_coffee: true,
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
    looking_for: ['collaborator'],
    open_to_coffee: true,
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
    looking_for: ['collaborator', 'mentee'],
    open_to_coffee: true,
  },
  {
    id: '16',
    name: 'Dr. Patricia Washington',
    role: 'alumni',
    eis_class_year: 2005,
    home_state: 'Georgia',
    assignment_location: 'Emory University',
    topics: ['chronic_disease', 'global_health'],
    bio: 'EIS veteran from the avian flu era. Now training the next generation at Emory. 20 years of stories to share!',
    looking_for: ['mentee'],
    open_to_coffee: true,
  },
  {
    id: '17',
    name: 'Dr. Robert Chang',
    role: 'alumni',
    eis_class_year: 1995,
    home_state: 'California',
    assignment_location: 'Kaiser Permanente',
    topics: ['chronic_disease', 'injury'],
    bio: 'EIS Class of \'95 - the pre-email days! Now in health systems research. Love seeing how EIS has evolved.',
    looking_for: ['mentee'],
    open_to_coffee: true,
  },
  {
    id: '18',
    name: 'Dr. Sandra Lee',
    role: 'alumni',
    eis_class_year: 2020,
    home_state: 'California',
    assignment_location: 'LA County DPH',
    topics: ['respiratory', 'antimicrobial_resistance'],
    bio: 'COVID cohort alum. If you survived EIS during a pandemic, you can handle anything. DMs open!',
    looking_for: ['peer', 'collaborator'],
    open_to_coffee: true,
  },
  {
    id: '19',
    name: 'Dr. William Peters',
    role: 'alumni',
    eis_class_year: 1985,
    home_state: 'Georgia',
    assignment_location: 'CDC (Retired)',
    topics: ['foodborne', 'environmental'],
    bio: 'Proud EIS alum of 40 years! Led early E. coli investigations. Here to celebrate our legacy.',
    looking_for: ['mentee'],
    open_to_coffee: true,
  },
  // Supervisors
  {
    id: '4',
    name: 'Dr. James Wilson',
    role: 'supervisor',
    home_state: 'Georgia',
    assignment_location: 'CDC NCEZID',
    topics: ['vector_borne', 'global_health'],
    bio: 'Division supervisor with 20 years at CDC. Led Zika response in 2016. Excited to mentor new EIS officers.',
    looking_for: ['mentee'],
    open_to_coffee: true,
  },
  {
    id: '9',
    name: 'Dr. Rachel Green',
    role: 'supervisor',
    home_state: 'Colorado',
    assignment_location: 'Colorado DPH',
    topics: ['foodborne', 'environmental'],
    bio: 'State epidemiologist supervising EIS officers. Passionate about applied epi and mentorship.',
    looking_for: ['mentee'],
    open_to_coffee: true,
  },
  {
    id: '20',
    name: 'Dr. Andrew Martinez',
    role: 'supervisor',
    home_state: 'New Mexico',
    assignment_location: 'New Mexico DOH',
    topics: ['maternal_child', 'chronic_disease'],
    bio: 'State health officer and former EIS. Leading health equity initiatives in the Southwest.',
    looking_for: ['mentee', 'collaborator'],
    open_to_coffee: true,
  },
  {
    id: '21',
    name: 'Dr. Helen Park',
    role: 'supervisor',
    home_state: 'Georgia',
    assignment_location: 'CDC NCIRD',
    topics: ['respiratory', 'global_health'],
    bio: 'Branch chief in respiratory diseases. Led flu surveillance for 15 years. Looking for future EIS stars!',
    looking_for: ['mentee'],
    open_to_coffee: false,
  },
  {
    id: '22',
    name: 'Dr. Thomas Anderson',
    role: 'supervisor',
    home_state: 'Maryland',
    assignment_location: 'NIH/NIAID',
    topics: ['antimicrobial_resistance', 'global_health'],
    bio: 'Former EIS (Class of 2002), now at NIH. EIS-NIH collaboration opportunities available.',
    looking_for: ['mentee', 'collaborator'],
    open_to_coffee: true,
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

export const roleLabels: Record<AttendeeRole, string> = {
  incoming: 'Incoming EIS',
  second_year: '2nd Year EIS',
  alumni: 'Alumni',
  supervisor: 'Supervisor',
};

export const roleColors: Record<AttendeeRole, string> = {
  incoming: 'bg-blue-100 text-blue-700 border-blue-300',
  second_year: 'bg-green-100 text-green-700 border-green-300',
  alumni: 'bg-purple-100 text-purple-700 border-purple-300',
  supervisor: 'bg-amber-100 text-amber-700 border-amber-300',
};

export const lookingForLabels: Record<LookingFor, string> = {
  mentor: 'A Mentor',
  mentee: 'To Mentor Others',
  peer: 'Peer Connections',
  collaborator: 'Research Collaborators',
};

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'Guam', 'US Virgin Islands'
];

// Geographic regions for matching
const REGIONS: Record<string, string[]> = {
  northeast: ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont', 'New Jersey', 'New York', 'Pennsylvania'],
  southeast: ['Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Mississippi', 'North Carolina', 'South Carolina', 'Tennessee', 'Virginia', 'West Virginia', 'District of Columbia', 'Maryland', 'Delaware'],
  midwest: ['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska', 'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin'],
  southwest: ['Arizona', 'New Mexico', 'Oklahoma', 'Texas'],
  west: ['Alaska', 'California', 'Colorado', 'Hawaii', 'Idaho', 'Montana', 'Nevada', 'Oregon', 'Utah', 'Washington', 'Wyoming'],
};

export function getRegion(state: string): string {
  for (const [region, states] of Object.entries(REGIONS)) {
    if (states.includes(state)) return region;
  }
  return 'other';
}

export function getAttendeeById(id: string): AttendeeProfile | undefined {
  return mockAttendees.find(a => a.id === id);
}

export function getAttendeesByRole(role: AttendeeProfile['role']): AttendeeProfile[] {
  return mockAttendees.filter(a => a.role === role);
}

export function getAttendeesByTopic(topic: Topic): AttendeeProfile[] {
  return mockAttendees.filter(a => a.topics.includes(topic));
}

// Smart matching algorithm
export function calculateMatchScore(
  userProfile: UserProfile,
  candidate: AttendeeProfile
): MatchScore {
  let score = 0;
  const reasons: string[] = [];

  // Topic overlap (high weight)
  const sharedTopics = userProfile.topics.filter(t => candidate.topics.includes(t));
  if (sharedTopics.length > 0) {
    score += sharedTopics.length * 20;
    reasons.push(`Shared interests: ${sharedTopics.map(t => topicLabels[t]).join(', ')}`);
  }

  // Role complementarity
  if (userProfile.looking_for?.includes('mentor') &&
      (candidate.role === 'alumni' || candidate.role === 'supervisor')) {
    score += 30;
    reasons.push('Potential mentor');
  }

  if (userProfile.looking_for?.includes('mentee') && candidate.role === 'incoming') {
    score += 30;
    reasons.push('Looking for mentorship');
  }

  if (userProfile.looking_for?.includes('peer') &&
      candidate.role === userProfile.role) {
    score += 25;
    reasons.push('Peer connection');
  }

  // Geographic diversity (bonus for different regions)
  const userRegion = getRegion(userProfile.home_state);
  const candidateRegion = getRegion(candidate.home_state);
  if (userRegion !== candidateRegion) {
    score += 10;
    reasons.push('Different region');
  }

  // Same assignment location (bonus for potential collaboration)
  if (userProfile.assignment_location === candidate.assignment_location) {
    score += 15;
    reasons.push('Same assignment location');
  }

  // Class year proximity for peer matching
  if (userProfile.eis_class_year && candidate.eis_class_year) {
    const yearDiff = Math.abs(userProfile.eis_class_year - candidate.eis_class_year);
    if (yearDiff <= 2) {
      score += 15;
      reasons.push('Similar class year');
    }
  }

  // Coffee chat availability
  if (candidate.open_to_coffee) {
    score += 5;
    reasons.push('Open to coffee chats');
  }

  return {
    attendeeId: candidate.id,
    score,
    reasons,
  };
}

export function getTopMatches(
  userProfile: UserProfile,
  candidates: AttendeeProfile[],
  count: number = 10
): MatchScore[] {
  const scores = candidates
    .filter(c => c.id !== userProfile.id)
    .map(c => calculateMatchScore(userProfile, c))
    .sort((a, b) => b.score - a.score);

  return scores.slice(0, count);
}

// Get conversation starters based on role
export function getConversationStarters(role: AttendeeRole): string[] {
  switch (role) {
    case 'incoming':
      return [
        'What drew you to EIS?',
        'What are you most excited about?',
        'Where will you be assigned?',
        'What\'s your background before EIS?',
      ];
    case 'second_year':
      return [
        'What\'s the most interesting case you\'ve worked on?',
        'Any advice for first-year officers?',
        'What surprised you most about EIS?',
        'How did you choose your assignment?',
      ];
    case 'alumni':
      return [
        'How did EIS shape your career?',
        'What do you wish you\'d known as an officer?',
        'What\'s your favorite EIS memory?',
        'What advice would you give incoming officers?',
      ];
    case 'supervisor':
      return [
        'What makes an EIS officer successful?',
        'What opportunities should I look for?',
        'How do you select projects for your officers?',
        'What\'s the most rewarding part of supervising?',
      ];
  }
}

// Default user profile for demo
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'current-user',
  name: 'You',
  email: 'user@cdc.gov',
  role: 'incoming',
  eis_class_year: 2025,
  home_state: 'Georgia',
  assignment_location: 'CDC Atlanta',
  topics: ['respiratory', 'global_health'],
  bio: 'Excited to join EIS and connect with the community!',
  looking_for: ['mentor', 'peer'],
  open_to_coffee: true,
};
