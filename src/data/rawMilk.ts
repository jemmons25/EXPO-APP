/**
 * Raw milk legality by state — see docs/04-DATA-SOURCES-AND-APIS.md §7.
 * Federal law (21 CFR 1240.61) bans INTERSTATE sale for human consumption; drinking
 * raw milk is legal everywhere. Intrastate rules vary. Verify before shipping — laws change.
 * Tiers as of 2026 research (Farm-to-Consumer Legal Defense Fund / state ag depts).
 */
export type RawMilkTier = 'retail' | 'on_farm' | 'herd_share' | 'pet_food_only' | 'illegal';

export const tierLabel: Record<RawMilkTier, string> = {
  retail: 'Retail — legal in stores',
  on_farm: 'On-farm / direct sales',
  herd_share: 'Herd-share only',
  pet_food_only: 'Pet food only',
  illegal: 'Sale prohibited',
};

export interface StateLaw {
  code: string;
  name: string;
  tier: RawMilkTier;
}

/** Representative classification; some states have nuanced sub-rules. */
export const RAW_MILK_LAWS: StateLaw[] = [
  { code: 'AL', name: 'Alabama', tier: 'illegal' },
  { code: 'AK', name: 'Alaska', tier: 'retail' },
  { code: 'AZ', name: 'Arizona', tier: 'retail' },
  { code: 'AR', name: 'Arkansas', tier: 'on_farm' },
  { code: 'CA', name: 'California', tier: 'retail' },
  { code: 'CO', name: 'Colorado', tier: 'herd_share' },
  { code: 'CT', name: 'Connecticut', tier: 'retail' },
  { code: 'DE', name: 'Delaware', tier: 'illegal' },
  { code: 'FL', name: 'Florida', tier: 'pet_food_only' },
  { code: 'GA', name: 'Georgia', tier: 'pet_food_only' },
  { code: 'HI', name: 'Hawaii', tier: 'illegal' },
  { code: 'ID', name: 'Idaho', tier: 'retail' },
  { code: 'IL', name: 'Illinois', tier: 'on_farm' },
  { code: 'IN', name: 'Indiana', tier: 'herd_share' },
  { code: 'IA', name: 'Iowa', tier: 'on_farm' },
  { code: 'KS', name: 'Kansas', tier: 'on_farm' },
  { code: 'KY', name: 'Kentucky', tier: 'on_farm' },
  { code: 'LA', name: 'Louisiana', tier: 'on_farm' },
  { code: 'ME', name: 'Maine', tier: 'retail' },
  { code: 'MD', name: 'Maryland', tier: 'illegal' },
  { code: 'MA', name: 'Massachusetts', tier: 'on_farm' },
  { code: 'MI', name: 'Michigan', tier: 'herd_share' },
  { code: 'MN', name: 'Minnesota', tier: 'on_farm' },
  { code: 'MS', name: 'Mississippi', tier: 'on_farm' },
  { code: 'MO', name: 'Missouri', tier: 'on_farm' },
  { code: 'MT', name: 'Montana', tier: 'herd_share' },
  { code: 'NE', name: 'Nebraska', tier: 'on_farm' },
  { code: 'NV', name: 'Nevada', tier: 'retail' },
  { code: 'NH', name: 'New Hampshire', tier: 'retail' },
  { code: 'NJ', name: 'New Jersey', tier: 'illegal' },
  { code: 'NM', name: 'New Mexico', tier: 'retail' },
  { code: 'NY', name: 'New York', tier: 'on_farm' },
  { code: 'NC', name: 'North Carolina', tier: 'pet_food_only' },
  { code: 'ND', name: 'North Dakota', tier: 'herd_share' },
  { code: 'OH', name: 'Ohio', tier: 'herd_share' },
  { code: 'OK', name: 'Oklahoma', tier: 'on_farm' },
  { code: 'OR', name: 'Oregon', tier: 'on_farm' },
  { code: 'PA', name: 'Pennsylvania', tier: 'retail' },
  { code: 'RI', name: 'Rhode Island', tier: 'illegal' },
  { code: 'SC', name: 'South Carolina', tier: 'retail' },
  { code: 'SD', name: 'South Dakota', tier: 'on_farm' },
  { code: 'TN', name: 'Tennessee', tier: 'herd_share' },
  { code: 'TX', name: 'Texas', tier: 'on_farm' },
  { code: 'UT', name: 'Utah', tier: 'retail' },
  { code: 'VT', name: 'Vermont', tier: 'on_farm' },
  { code: 'VA', name: 'Virginia', tier: 'herd_share' },
  { code: 'WA', name: 'Washington', tier: 'retail' },
  { code: 'WV', name: 'West Virginia', tier: 'herd_share' },
  { code: 'WI', name: 'Wisconsin', tier: 'illegal' },
  { code: 'WY', name: 'Wyoming', tier: 'retail' },
  { code: 'DC', name: 'District of Columbia', tier: 'illegal' },
];

export const RAW_MILK_BENEFITS =
  'Advocates report better tolerance for some people, intact enzymes, and beneficial bacteria. Evidence for unique health benefits over pasteurized milk is limited and contested.';

export const RAW_MILK_RISKS =
  'Raw milk can carry Listeria, E. coli, Salmonella, and Campylobacter, and (recently) H5N1 avian-flu concern in some regions. Risk is highest for pregnant people, young children, older adults, and the immunocompromised.';
