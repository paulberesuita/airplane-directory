-- Seed data for commercial aircraft directory - Batch 2
-- Researched: 2026-01-20

INSERT INTO aircraft (slug, name, manufacturer, description, first_flight, passengers, range_km, cruise_speed_kmh, length_m, wingspan_m, engines, status, fun_fact, source_url, source_name, researched_at) VALUES

-- Boeing 737 Family (additional)
('boeing-737-900er', 'Boeing 737-900ER', 'Boeing', 'The largest variant of the 737 Next Generation family, designed to fill the gap left by the discontinued 757-200. Features additional exit doors and a flat rear pressure bulkhead to accommodate more passengers while maintaining 737NG commonality.', '2006', '176-220', 5900, 850, 42.1, 34.3, '2x CFM56-7B', 'Out of Production', 'The 737-900ER was launched specifically to compete with the Airbus A321, featuring the longest fuselage of any 737 until the MAX 10.', 'https://en.wikipedia.org/wiki/Boeing_737_Next_Generation', 'Wikipedia', '2026-01-20'),

-- Airbus A320 Family (additional)
('airbus-a319neo', 'Airbus A319neo', 'Airbus', 'The smallest member of the A320neo family, offering exceptional range in a compact package. Popular with airlines serving smaller markets or requiring longer range from shorter runways. Features the same engine options and sharklets as the larger A320neo.', '2017', '120-160', 6940, 840, 33.8, 35.8, '2x CFM LEAP-1A or PW1100G', 'In Production', 'The A319neo can fly routes up to 500nm longer than its predecessor thanks to its new engines and aerodynamic improvements.', 'https://www.aircraft.airbus.com/en/aircraft/a320-family/a319neo', 'Airbus', '2026-01-20'),

-- Boeing Wide-bodies (additional)
('boeing-787-8', 'Boeing 787-8 Dreamliner', 'Boeing', 'The original Dreamliner variant that revolutionized commercial aviation with its composite airframe. Over 50% of the primary structure is made of composite materials, resulting in a lighter, more fuel-efficient aircraft with enhanced passenger comfort.', '2009', '210-250', 13530, 903, 57.0, 60.1, '2x GEnx-1B or RR Trent 1000', 'In Production', 'The 787 was the first commercial aircraft to have its fuselage made primarily from composite materials, reducing weight by approximately 20% compared to aluminum.', 'https://www.boeing.com/commercial/787', 'Boeing', '2026-01-20'),

-- Airbus A220 Family
('airbus-a220-300', 'Airbus A220-300', 'Airbus', 'Originally developed by Bombardier as the CSeries, this revolutionary aircraft was designed specifically for the 120-160 seat market. Features advanced aerodynamics, all-new Pratt & Whitney geared turbofan engines, and state-of-the-art fly-by-wire controls.', '2016', '130-160', 6570, 829, 38.7, 35.1, '2x PW1500G', 'In Production', 'The A220 reduces fuel burn and CO2 emissions by 25% per seat compared to previous generation aircraft, making it one of the most efficient single-aisle jets ever built.', 'https://www.aircraft.airbus.com/en/aircraft/a220/a220-300', 'Airbus', '2026-01-20'),

-- Regional Jets (additional)
('embraer-e175', 'Embraer E175', 'Embraer', 'The backbone of regional jet operations in North America. Part of Embraers highly successful first-generation E-Jet family, the E175 offers the ideal capacity for feeder routes to major hub airports with its 2-2 seating configuration.', '2003', '76-88', 3700, 870, 31.7, 26.0, '2x GE CF34-8E', 'In Production', 'The E175 is particularly popular in the US regional market because its maximum seating capacity falls within scope clause limits in pilot union contracts.', 'https://en.wikipedia.org/wiki/Embraer_E-Jet_family', 'Wikipedia', '2026-01-20');
