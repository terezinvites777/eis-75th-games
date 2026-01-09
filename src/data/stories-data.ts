// src/data/stories-data.ts
// 75 Years, 75 Stories data

import type { FeaturedStory, DecadeInfo, Decade } from '../types/stories';

export const decadeInfo: DecadeInfo[] = [
  {
    decade: '1950s',
    title: 'The Beginning',
    description: 'EIS was founded in 1951 as a frontline defense against biological warfare and disease outbreaks.',
    key_events: [
      'EIS founded by Alexander Langmuir in 1951',
      'First class of 23 officers',
      'Polio surveillance programs begin',
    ],
    featured_story_ids: ['story-1951-founding'],
  },
  {
    decade: '1960s',
    title: 'Growing Reach',
    description: 'EIS expands its mission and begins global disease detective work.',
    key_events: [
      'Smallpox eradication efforts begin',
      'EIS officers deploy internationally',
      'Surveillance methods advance',
    ],
    featured_story_ids: ['story-1960s-smallpox'],
  },
  {
    decade: '1970s',
    title: 'New Challenges',
    description: 'A decade of discovering new diseases and tackling complex outbreaks.',
    key_events: [
      'Legionnaires\' Disease discovered (1976)',
      'Swine flu response',
      'Toxic shock syndrome investigation begins',
    ],
    featured_story_ids: ['story-1976-legionnaires'],
  },
  {
    decade: '1980s',
    title: 'The AIDS Era',
    description: 'EIS officers are among the first to investigate and describe AIDS.',
    key_events: [
      'First AIDS cases investigated (1981)',
      'HIV identified as cause',
      'Expanding chronic disease epi',
    ],
    featured_story_ids: ['story-1981-aids'],
  },
  {
    decade: '1990s',
    title: 'Emerging Threats',
    description: 'Hantavirus, E. coli O157:H7, and new outbreak tools emerge.',
    key_events: [
      'Hantavirus Pulmonary Syndrome (1993)',
      'Jack in the Box E. coli outbreak',
      'PulseNet surveillance network created',
    ],
    featured_story_ids: ['story-1993-hantavirus'],
  },
  {
    decade: '2000s',
    title: 'Bioterrorism & SARS',
    description: 'From anthrax letters to global respiratory outbreaks.',
    key_events: [
      'Anthrax attacks response (2001)',
      'SARS outbreak (2003)',
      'H1N1 pandemic (2009)',
    ],
    featured_story_ids: ['story-2001-anthrax', 'story-2009-h1n1'],
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
  {
    id: 'story-1951-founding',
    decade: '1950s',
    title: 'The Birth of EIS',
    officer_name: 'Alexander Langmuir',
    eis_class_year: 1951,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail_url: '/images/stories/1950s-founding.jpg',
    description: 'Alexander Langmuir founded the Epidemic Intelligence Service in 1951, creating a new model for disease surveillance and outbreak response.',
  },
  {
    id: 'story-1976-legionnaires',
    decade: '1970s',
    title: 'Solving Legionnaires\' Disease',
    officer_name: 'David Fraser',
    eis_class_year: 1971,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail_url: '/images/stories/1976-legionnaires.jpg',
    description: 'The mysterious pneumonia outbreak at the 1976 American Legion convention led to the discovery of a new bacterium.',
    outbreak_name: 'Legionnaires\' Disease',
    location: 'Philadelphia, PA',
  },
  {
    id: 'story-1981-aids',
    decade: '1980s',
    title: 'First AIDS Investigation',
    officer_name: 'Harold Jaffe',
    eis_class_year: 1977,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail_url: '/images/stories/1981-aids.jpg',
    description: 'EIS officers were among the first to investigate and describe the epidemic that would become known as AIDS.',
    outbreak_name: 'AIDS',
    location: 'Los Angeles, CA',
  },
  {
    id: 'story-1993-hantavirus',
    decade: '1990s',
    title: 'Four Corners Outbreak',
    officer_name: 'Jay Butler',
    eis_class_year: 1992,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail_url: '/images/stories/1993-hantavirus.jpg',
    description: 'A deadly new virus emerged in the American Southwest, requiring rapid investigation and partnership with Navajo healers.',
    outbreak_name: 'Hantavirus Pulmonary Syndrome',
    location: 'Four Corners Region',
  },
  {
    id: 'story-2014-ebola',
    decade: '2010s',
    title: 'Ebola Frontlines',
    officer_name: 'Barbara Knust',
    eis_class_year: 2009,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail_url: '/images/stories/2014-ebola.jpg',
    description: 'The West African Ebola outbreak was the largest in history. EIS officers deployed to support the response.',
    outbreak_name: 'Ebola',
    location: 'West Africa',
  },
  {
    id: 'story-2020-covid',
    decade: '2020s',
    title: 'COVID-19 Response',
    officer_name: 'EIS Class of 2020',
    eis_class_year: 2020,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    thumbnail_url: '/images/stories/2020-covid.jpg',
    description: 'The entire EIS community mobilized for the largest public health response in the program\'s history.',
    outbreak_name: 'COVID-19',
    location: 'Nationwide',
  },
];

export function getStoriesByDecade(decade: Decade): FeaturedStory[] {
  return featuredStories.filter(s => s.decade === decade);
}

export function getDecadeByName(decade: Decade): DecadeInfo | undefined {
  return decadeInfo.find(d => d.decade === decade);
}
