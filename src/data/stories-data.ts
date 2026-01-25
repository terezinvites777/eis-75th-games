// src/data/stories-data.ts
// 75 Years, 75 Stories data - Updated with real CDC "We Were There" videos
// Video source: https://www.youtube.com/playlist?list=PLvrp9iOILTQbugVtEkJBHZUzLbJvbRyOi

import type { FeaturedStory, DecadeInfo, Decade } from '../types/stories';

// CDC "We Were There" Video IDs
const CDC_VIDEOS = {
  'hiv-aids': 'Ex8O_7fw-6U',
  'legionnaires': 'ALZyly9_l4w',
  'ecoli': 'Ull53xGkRT4',
  'toxic-shock': 'METPBQRVXZ4',
  'polio': 'aLf63yIEquo',
  'pvc-angiosarcoma': 'GI57SkVA6OU',
  'folic-acid': 'yk4bq1KbB6s',
  'hantavirus': '5hdsjebQzwM',
  'diacetyl': 'XpqmHDxE4yg',
  'ebola': 'iZ3KWjBVW2k',
  'zaki-tribute': 'z9q-6QlI8EE',
  'us-china': 'B805VPfQ1r0',
  // Additional CDC videos
  'langmuir-lecture': 'LLALYPUY6Lw',  // 2017 Alexander D. Langmuir Lecture
  'eis-scientist': 'btDlG7oAW8I',      // EIS Career Paths - The Scientist
};

// Helper to create embed URL
const embedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;

export const decadeInfo: DecadeInfo[] = [
  {
    decade: '1950s',
    title: 'The Beginning',
    description: 'EIS was founded in 1951 as a frontline defense against biological warfare and disease outbreaks.',
    key_events: [
      'EIS founded by Alexander Langmuir in 1951',
      'First class of 23 officers',
      'Polio surveillance programs begin',
      'Cutter Incident investigation (1955)',
    ],
    featured_story_ids: ['story-1951-founding', 'story-1955-polio'],
  },
  {
    decade: '1960s',
    title: 'Growing Reach',
    description: 'EIS expands its mission and begins global disease detective work.',
    key_events: [
      'Smallpox eradication efforts begin (1966)',
      'National Measles Eradication Campaign',
      'EIS officers deploy internationally',
      '1968 Influenza pandemic response',
    ],
    featured_story_ids: ['story-1966-smallpox'],
  },
  {
    decade: '1970s',
    title: 'New Challenges',
    description: 'A decade of discovering new diseases and tackling complex outbreaks.',
    key_events: [
      'Legionnaires\' Disease discovered (1976)',
      'Swine flu response',
      'Toxic shock syndrome investigation begins',
      'PVC and Angiosarcoma link discovered (1974)',
    ],
    featured_story_ids: ['story-1976-legionnaires', 'story-1974-pvc'],
  },
  {
    decade: '1980s',
    title: 'The AIDS Era',
    description: 'EIS officers are among the first to investigate and describe AIDS.',
    key_events: [
      'First AIDS cases investigated (1981)',
      'HIV identified as cause',
      'Toxic Shock Syndrome tampon link confirmed',
      'Expanding chronic disease epidemiology',
    ],
    featured_story_ids: ['story-1981-aids', 'story-1980-tss'],
  },
  {
    decade: '1990s',
    title: 'Emerging Threats',
    description: 'Hantavirus, E. coli O157:H7, and new outbreak tools emerge.',
    key_events: [
      'Hantavirus Pulmonary Syndrome (1993)',
      'Jack in the Box E. coli outbreak (1993)',
      'PulseNet surveillance network created',
      'Folic acid and neural tube defects discovery',
    ],
    featured_story_ids: ['story-1993-hantavirus', 'story-1993-ecoli', 'story-1990s-folic'],
  },
  {
    decade: '2000s',
    title: 'Bioterrorism & SARS',
    description: 'From anthrax letters to global respiratory outbreaks.',
    key_events: [
      'Anthrax attacks response (2001)',
      'SARS outbreak (2003)',
      'Diacetyl/Popcorn lung investigation (2000)',
      'H1N1 pandemic (2009)',
    ],
    featured_story_ids: ['story-2000-diacetyl'],
  },
  {
    decade: '2010s',
    title: 'Global Response',
    description: 'EIS officers respond to Ebola, Zika, and more.',
    key_events: [
      'West African Ebola outbreak (2014)',
      'Zika virus in the Americas (2016)',
      'Multistate outbreak investigations',
    ],
    featured_story_ids: ['story-2014-ebola'],
  },
  {
    decade: '2020s',
    title: 'COVID & Beyond',
    description: 'The largest public health mobilization in history.',
    key_events: [
      'COVID-19 pandemic response',
      'Mpox outbreak',
      'Continuing evolution of EIS',
    ],
    featured_story_ids: ['story-2020-covid'],
  },
];

export const featuredStories: FeaturedStory[] = [
  // ========== 1950s ==========
  {
    id: 'story-1951-founding',
    decade: '1950s',
    title: 'The Birth of EIS',
    officer_name: 'Alexander Langmuir',
    eis_class_year: 1951,
    video_url: embedUrl(CDC_VIDEOS['langmuir-lecture']),
    video_duration: '1:08:40',
    thumbnail_url: '/images/stories/1950s-founding.jpg',
    description: 'Alexander Langmuir founded the Epidemic Intelligence Service in 1951, creating a new model for disease surveillance and outbreak response that would train generations of disease detectives. This annual lecture honors his legacy.',
    source: 'CDC - 2017 Alexander D. Langmuir Lecture',
  },
  {
    id: 'story-1955-polio',
    decade: '1950s',
    title: 'The Cutter Incident',
    officer_name: 'Neal Nathanson',
    eis_class_year: 1955,
    video_url: embedUrl(CDC_VIDEOS['polio']),
    video_duration: '1:33:34',
    thumbnail_url: '/images/stories/1955-polio.jpg',
    description: 'In 1955, some lots of the new Salk polio vaccine caused polio instead of preventing it. EIS officers rapidly investigated what became known as the Cutter Incident, leading to major improvements in vaccine safety.',
    outbreak_name: 'Cutter Incident / Polio',
    location: 'United States',
    source: 'CDC Museum "We Were There" Lecture Series',
  },

  // ========== 1960s ==========
  {
    id: 'story-1966-smallpox',
    decade: '1960s',
    title: 'The War on Smallpox',
    officer_name: 'D.A. Henderson',
    eis_class_year: 1955,
    video_url: embedUrl(CDC_VIDEOS['eis-scientist']),
    video_duration: '5:47',
    thumbnail_url: '/images/stories/1966-smallpox.jpg',
    description: 'In 1966, CDC launched the global Smallpox Eradication Program. EIS officers deployed worldwide, using innovative surveillance and containment strategies that would ultimately eliminate one of humanity\'s deadliest diseases by 1980.',
    outbreak_name: 'Smallpox Eradication',
    location: 'Worldwide',
    source: 'CDC - Public Health Career Paths: EIS',
  },

  // ========== 1970s ==========
  {
    id: 'story-1976-legionnaires',
    decade: '1970s',
    title: 'Solving Legionnaires\' Disease',
    officer_name: 'David Fraser',
    eis_class_year: 1971,
    video_url: embedUrl(CDC_VIDEOS['legionnaires']),
    video_duration: '1:27:57',
    thumbnail_url: '/images/stories/1976-legionnaires.jpg',
    description: 'The mysterious pneumonia outbreak at the 1976 American Legion convention in Philadelphia led to the discovery of Legionella pneumophila, a completely new bacterium.',
    outbreak_name: 'Legionnaires\' Disease',
    location: 'Philadelphia, PA',
    source: 'CDC Museum "We Were There" Lecture Series',
  },
  {
    id: 'story-1974-pvc',
    decade: '1970s',
    title: 'Vinyl Chloride and Liver Cancer',
    officer_name: 'Various EIS Officers',
    eis_class_year: 1974,
    video_url: embedUrl(CDC_VIDEOS['pvc-angiosarcoma']),
    video_duration: '1:28:22',
    thumbnail_url: '/images/stories/1974-pvc.jpg',
    description: 'In 1974, EIS officers investigated the link between vinyl chloride exposure in PVC manufacturing plants and a rare form of liver cancer called angiosarcoma, leading to major workplace safety reforms.',
    outbreak_name: 'Vinyl Chloride / Angiosarcoma',
    location: 'Louisville, KY',
    source: 'CDC Museum "We Were There" Lecture Series',
  },

  // ========== 1980s ==========
  {
    id: 'story-1981-aids',
    decade: '1980s',
    title: 'Early Days of AIDS',
    officer_name: 'Harold Jaffe',
    eis_class_year: 1977,
    video_url: embedUrl(CDC_VIDEOS['hiv-aids']),
    video_duration: '1:26:18',
    thumbnail_url: '/images/stories/1981-aids.jpg',
    description: 'EIS officers were among the first to investigate and describe the epidemic that would become known as AIDS. This lecture features Dr. Harold Jaffe and Dr. Jim Curran sharing their experiences from the early response.',
    outbreak_name: 'AIDS/HIV',
    location: 'Los Angeles, CA',
    source: 'CDC Museum "We Were There" Lecture Series',
  },
  {
    id: 'story-1980-tss',
    decade: '1980s',
    title: 'Toxic Shock Syndrome',
    officer_name: 'Kathryn Shands',
    eis_class_year: 1980,
    video_url: embedUrl(CDC_VIDEOS['toxic-shock']),
    video_duration: '1:28:52',
    thumbnail_url: '/images/stories/1980-tss.jpg',
    description: 'The investigation of toxic shock syndrome cases led to the discovery of its association with super-absorbent tampons, resulting in major product recalls and lasting impacts on public health confidentiality.',
    outbreak_name: 'Toxic Shock Syndrome',
    location: 'Wisconsin',
    source: 'CDC Museum "We Were There" Lecture Series',
  },

  // ========== 1990s ==========
  {
    id: 'story-1993-hantavirus',
    decade: '1990s',
    title: 'Four Corners Outbreak',
    officer_name: 'Jay Butler',
    eis_class_year: 1992,
    video_url: embedUrl(CDC_VIDEOS['hantavirus']),
    video_duration: '1:29:45',
    thumbnail_url: '/images/stories/1993-hantavirus.jpg',
    description: 'A deadly new virus emerged in the American Southwest. EIS officers worked with Navajo healers and tribal leaders to identify Sin Nombre virus and its deer mouse reservoir.',
    outbreak_name: 'Hantavirus Pulmonary Syndrome',
    location: 'Four Corners Region',
    source: 'CDC Museum "We Were There" Lecture Series',
  },
  {
    id: 'story-1993-ecoli',
    decade: '1990s',
    title: 'Jack in the Box E. coli',
    officer_name: 'Patricia Griffin',
    eis_class_year: 1987,
    video_url: embedUrl(CDC_VIDEOS['ecoli']),
    video_duration: '1:29:48',
    thumbnail_url: '/images/stories/1993-ecoli.jpg',
    description: 'The deadly E. coli O157:H7 outbreak linked to undercooked hamburgers at Jack in the Box restaurants led to major changes in food safety regulations and the creation of PulseNet.',
    outbreak_name: 'E. coli O157:H7',
    location: 'Washington State',
    source: 'CDC Museum "We Were There" Lecture Series',
  },
  {
    id: 'story-1990s-folic',
    decade: '1990s',
    title: 'Folic Acid Discovery',
    officer_name: 'CDC Researchers',
    eis_class_year: 1990,
    video_url: embedUrl(CDC_VIDEOS['folic-acid']),
    video_duration: '1:28:25',
    thumbnail_url: '/images/stories/1990s-folic.jpg',
    description: 'In the late 1980s, CDC researchers made a discovery that would prevent thousands of birth defects: folic acid in a multivitamin could reduce the risk of neural tube defects like spina bifida.',
    outbreak_name: 'Neural Tube Defects Prevention',
    location: 'Nationwide',
    source: 'CDC Museum "We Were There" Lecture Series',
  },

  // ========== 2000s ==========
  {
    id: 'story-2000-diacetyl',
    decade: '2000s',
    title: 'Popcorn Lung Disease',
    officer_name: 'Kathleen Kreiss',
    eis_class_year: 1983,
    video_url: embedUrl(CDC_VIDEOS['diacetyl']),
    video_duration: '1:21:44',
    thumbnail_url: '/images/stories/2000-diacetyl.jpg',
    description: 'In 2000, eight former microwave-popcorn factory workers developed bronchiolitis obliterans, a rare lung disease. EIS disease detectives traced it to diacetyl, a butter flavoring chemical.',
    outbreak_name: 'Diacetyl / Popcorn Workers Lung',
    location: 'Jasper, Missouri',
    source: 'CDC Museum "We Were There" Lecture Series',
  },

  // ========== 2010s ==========
  {
    id: 'story-2014-ebola',
    decade: '2010s',
    title: 'Ebola Frontlines',
    officer_name: 'Barbara Knust',
    eis_class_year: 2009,
    video_url: embedUrl(CDC_VIDEOS['ebola']),
    video_duration: '1:28:42',
    thumbnail_url: '/images/stories/2014-ebola.jpg',
    description: 'The West African Ebola outbreak was the largest in history, with over 28,000 cases. This lecture covers the CDC\'s containment laboratory history and the original 1976 Ebola discovery.',
    outbreak_name: 'Ebola',
    location: 'Guinea, Liberia, Sierra Leone',
    source: 'CDC Museum "We Were There" Lecture Series',
  },

  // ========== 2020s ==========
  {
    id: 'story-2020-covid',
    decade: '2020s',
    title: 'COVID-19 Response',
    officer_name: 'EIS Class of 2020',
    eis_class_year: 2020,
    video_url: null, // Too recent for "We Were There" series
    thumbnail_url: '/images/stories/2020-covid.jpg',
    description: 'The entire EIS community mobilized for the largest public health response in the program\'s history, with officers investigating clusters, variants, and vaccine effectiveness.',
    outbreak_name: 'COVID-19',
    location: 'Nationwide and Global',
  },

  // ========== BONUS: Tribute & International ==========
  {
    id: 'story-tribute-zaki',
    decade: '2010s',
    title: 'Dr. Sherif Zaki Tribute',
    officer_name: 'Sherif R. Zaki',
    eis_class_year: 1988,
    video_url: embedUrl(CDC_VIDEOS['zaki-tribute']),
    video_duration: '40:40',
    thumbnail_url: '/images/stories/zaki-tribute.jpg',
    description: 'A tribute to Dr. Sherif R. Zaki, founder and branch chief of CDC\'s Infectious Disease Pathology Branch, who made groundbreaking contributions to understanding emerging diseases.',
    source: 'CDC Museum "We Were There" Lecture Series',
  },
];

// Helper functions
export function getStoriesByDecade(decade: Decade): FeaturedStory[] {
  return featuredStories.filter(s => s.decade === decade);
}

export function getDecadeByName(decade: Decade): DecadeInfo | undefined {
  return decadeInfo.find(d => d.decade === decade);
}

export function getStoriesWithVideos(): FeaturedStory[] {
  return featuredStories.filter(s => s.video_url !== null);
}

export function getStoryById(id: string): FeaturedStory | undefined {
  return featuredStories.find(s => s.id === id);
}

export function getVideoCount(): number {
  return featuredStories.filter(s => s.video_url !== null).length;
}
