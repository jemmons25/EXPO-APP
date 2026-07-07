/**
 * Health News & Trends feed with "Hype Check" — see docs/00 §4.5.
 * In production these come from PubMed E-utilities, openFDA recalls, and curated feeds,
 * each drafted then human-reviewed. Seeded here so the feed is meaningful on first run.
 */
import { EvidenceStrength } from '@/theme/colors';

export interface NewsItem {
  id: string;
  topic: string;
  headline: string;
  whatItShowed: string;
  bottomLine: string;
  evidence: EvidenceStrength;
  date: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    topic: 'Seed oils',
    headline: '"Seed oils are toxic and cause inflammation"',
    whatItShowed:
      'Multiple 2025–2026 reviews of human RCTs and cohorts found linoleic acid is neutral-to-beneficial for heart and metabolic health, with no reliable rise in inflammatory markers.',
    bottomLine: 'The molecule isn\u2019t the villain. Focus on avoiding ultra-processed food and reused frying oil.',
    evidence: 'moderate',
    date: '2026-06-20',
  },
  {
    id: 'n2',
    topic: 'Food dyes',
    headline: 'FDA moves to pull Red Dye No. 3',
    whatItShowed:
      'The FDA revoked authorization for Red Dye No. 3 (Jan 2025) after animal-carcinogenicity data; manufacturers must reformulate by Jan 2027.',
    bottomLine: 'A real regulatory change. Expect reformulated candy and drinks over the next year.',
    evidence: 'moderate',
    date: '2026-05-02',
  },
  {
    id: 'n3',
    topic: 'GRAS / regulation',
    headline: 'FDA explores closing the "self-affirmed GRAS" loophole',
    whatItShowed:
      'Proposed rulemaking would require companies to notify the FDA of new GRAS ingredients rather than self-certifying silently.',
    bottomLine: 'If finalized, more ingredient safety data becomes public. Not law yet.',
    evidence: 'strong',
    date: '2026-04-24',
  },
  {
    id: 'n4',
    topic: 'Emulsifiers',
    headline: '"Common emulsifiers wreck your gut"',
    whatItShowed:
      'Animal studies and small human trials suggest some emulsifiers (polysorbate-80, CMC) can alter the microbiome and gut barrier — but effects vary by person and dose.',
    bottomLine: 'Emerging, not settled. Reasonable to limit, not to panic over a trace amount.',
    evidence: 'emerging',
    date: '2026-03-15',
  },
  {
    id: 'n5',
    topic: 'Circadian',
    headline: '"10 minutes of morning sun fixes your sleep"',
    whatItShowed:
      'The mechanism (light → clock → cortisol/melatonin) is solid, but the strongest trials used longer/brighter exposures than the viral "10 minute" claim.',
    bottomLine: 'Getting morning light is genuinely good. The exact minimum dose is less certain — consistency matters most.',
    evidence: 'strong',
    date: '2026-02-28',
  },
];
