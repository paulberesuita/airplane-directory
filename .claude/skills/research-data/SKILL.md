# Research Data Skill

How to find commercial aircraft data for the airplane directory.

## Fields to Collect

| Field | Required | How to Find |
|-------|----------|-------------|
| slug | Yes | Generate from name: "boeing-737-800" |
| name | Yes | Official designation: "Boeing 737-800" |
| manufacturer | Yes | Boeing, Airbus, Embraer, etc. |
| description | Yes | 2-3 sentences about the aircraft's role and significance |
| first_flight | Yes | Year of first flight |
| passengers | Yes | Typical range: "162-189" |
| range_km | Yes | Maximum range in kilometers |
| cruise_speed_kmh | Yes | Typical cruise speed |
| length_m | Yes | Fuselage length in meters |
| wingspan_m | Yes | Wingspan in meters |
| engines | Yes | Engine configuration: "2x CFM56-7B" |
| status | Yes | "In Production" or "Out of Production" |
| fun_fact | No | Interesting trivia for enthusiasts |
| source_url | Yes | URL where data was found |
| source_name | Yes | Name of source (e.g., "Boeing", "Airbus") |
| researched_at | Yes | Today's date: YYYY-MM-DD |

## Best Sources

1. **Manufacturer websites** (Primary)
   - boeing.com/commercial - Official Boeing specs
   - airbus.com/en/products-services/commercial-aircraft - Official Airbus specs
   - embraer.com/global/en/commercial-aviation - Embraer specs
   - Most authoritative for dimensions, performance

2. **Wikipedia** (Secondary verification)
   - Good for first flight dates, production history
   - Cross-reference with manufacturer data

3. **SeatGuru / airline websites** (Passenger configs)
   - Realistic passenger counts by configuration

## Search Strategies

- "[aircraft model] specifications site:boeing.com"
- "[aircraft model] specifications site:airbus.com"
- "[aircraft model] first flight wikipedia"
- "[aircraft model] range passengers"

## Data Extraction

For each aircraft:
1. Start with manufacturer website for official specs
2. Verify first flight date on Wikipedia
3. Get typical passenger range (varies by airline config)
4. Write concise description highlighting its role
5. Find interesting fact that enthusiasts would appreciate

## Quality Criteria

- All numeric specs should be from manufacturer or verified sources
- Descriptions should mention role (short-haul, long-haul, regional)
- Fun facts should be genuinely interesting, not generic
- Passenger counts should be realistic ranges, not max theoretical

## Incremental Research

When adding to existing data:
1. Query D1 first: `SELECT slug FROM aircraft`
2. Skip items that already exist
3. Only research and add new aircraft
4. Focus on gaps (missing manufacturers, popular models)

## Priority Order

Research in this order for best coverage:
1. **Boeing 737 family** - Most common, what people fly most
2. **Airbus A320 family** - Second most common
3. **Boeing 787, 777** - Popular wide-bodies
4. **Airbus A350, A380** - Notable long-haul
5. **Regional jets** - Embraer E-Jets, CRJ series
