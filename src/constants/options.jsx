export const SelectTravelesList=[
{
    id:1,
    title:'Just Me',
    desc:"Exploring Lebanon alone",
    icon:'✈︎',
    people:'1',
},
{
    id:2,
    title:'Couple',
    desc:"Romantic Lebanese getaway",
    icon:'🥂',
    people:'2 People',
},
{
    id:3,
    title:'Group',
    desc:"A Group of loving adventurers",
    icon:'👥',
    people:'3 to 5 People',
},
{
    id:4,
    title:'Friends',
    desc:"A bunch of thrill-seekers",
    icon:'👨‍👨‍👦‍👦',
    people:'5 to 10 People',
},
]
export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:'Affordable Lebanese options',
        icon:'💲',
    },

    {
        id:2,
        title:'Moderate',
        desc:'Comfortable Lebanese stays',
        icon:'💰',
    },

    {
        id:3,
        title:'Luxury',
        desc:'High-end Lebanese experience',
        icon:'💸',
    },
]

export const AI_PROMPT = `
Generate a full Lebanese trip plan in pure JSON format.

User Preferences:
- Location: {location}
- Days: {totalDays}
- Travelers: {traveler}
- Budget: {budget}

MANDATORY:
1. Your output MUST contain BOTH:
   - "Hotels" (at least 2 hotels)
   - "Itinerary" (one detailed plan PER DAY with 4-6 real activities each)
2. DO NOT respond with Hotels only. 
   - If you cannot generate full Hotels + Itinerary, return this exact JSON instead:
{ "error": "Unable to complete itinerary. Request clarification or expand search radius." }
3. No fictional places. Use real Lebanese locations validated from:
   - OpenStreetMap Lebanon
   - Google Maps Lebanon
4. Each activity must be within 15km of {location}.
   - You may expand to 30km ONLY if needed, but state this in "notes".
4.1 Activity Variety Rule:
   - Do NOT include two activities of the same category on the same day.
     (e.g., no two museums, no two religious sites, no two hikes on the same day).
   - Ensure variety in pacing: mix cultural, food, nature, and leisure.
   - Include 1 relaxing or scenic activity as the last activity of the day (e.g., sunset view, café, walk by the sea).
4.2 Priority Logic:
   - Prioritize iconic or highly-rated landmarks on Day 1.
   - Reserve hidden gems or low-tourism spots for later days.
5. Respect Budget:
   - Budget ➔ $20–40/day
   - Moderate ➔ $40–80/day
   - Luxury ➔ $80–150/day
6. Travelers Logic:
   - Couple ➔ Romantic, cozy, seaside
   - Family ➔ Kid-friendly parks, museums
   - Solo ➔ Culture, peaceful, adventurous
   - Friends ➔ Nightlife, active group events
6.1 General:
   - Avoid repetitive routines. Each day should feel fresh and have a unique theme.
   - If user only has 1 or 2 days, emphasize landmark diversity and geographical efficiency.

ITINERARY STRUCTURE:
- Day {day number}
  - Theme
  - Activities[]:
    - PlaceName
    - GeoCoordinates
    - DistanceFromCenter
    - TimeTravel
    - LocalTip
    - EstimatedCost (USD)

HOTELS STRUCTURE:
- HotelName
- HotelAddress
- PricePerNight (USD)
- DistanceFromCenter
- GeoCoordinates
- Rating

OUTPUT FORMAT:
- Pure JSON. No extra text, no explanations.
- Validate all entries.

If anything is unclear (e.g., vague location), instead return:
{ "error": "Please clarify the exact area or town for {location}." }
`;
