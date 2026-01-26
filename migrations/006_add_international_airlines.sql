-- Migration 006: Add international airlines flying to the USA
-- Created: 2026-01-26
-- Adds 32 international airlines from Europe, Middle East, Asia-Pacific, and Americas

-- =============================================
-- EUROPEAN AIRLINES
-- =============================================

INSERT OR REPLACE INTO airlines (slug, name, iata_code, icao_code, headquarters, founded, fleet_size, destinations, description, website) VALUES
('british-airways', 'British Airways', 'BA', 'BAW', 'London, United Kingdom', 1974, 295, 200, 'The flag carrier of the United Kingdom and the largest airline based on fleet size in the UK. A founding member of the Oneworld alliance, BA operates one of the largest Airbus A380 fleets in Europe and is modernizing with A350-1000s and Boeing 787 Dreamliners.', 'https://www.britishairways.com'),

('lufthansa', 'Lufthansa', 'LH', 'DLH', 'Cologne, Germany', 1953, 320, 220, 'Germany''s flag carrier and the largest airline in Europe by fleet size. A founding member of Star Alliance and one of the last operators of the Boeing 747-8 passenger aircraft.', 'https://www.lufthansa.com'),

('air-france', 'Air France', 'AF', 'AFR', 'Paris, France', 1933, 229, 195, 'The French flag carrier and a founding member of the SkyTeam alliance. Air France operates primarily Boeing 777s and Airbus A350s on long-haul routes.', 'https://www.airfrance.com'),

('klm', 'KLM Royal Dutch Airlines', 'KL', 'KLM', 'Amsterdam, Netherlands', 1919, 121, 165, 'The flag carrier of the Netherlands and the oldest airline still operating under its original name. Part of the Air France-KLM Group and a founding member of SkyTeam.', 'https://www.klm.com'),

('virgin-atlantic', 'Virgin Atlantic', 'VS', 'VIR', 'London, United Kingdom', 1984, 44, 30, 'A British long-haul airline known for its innovative service and distinctive brand. Part of Virgin Group and a member of SkyTeam alliance.', 'https://www.virginatlantic.com'),

('iberia', 'Iberia', 'IB', 'IBE', 'Madrid, Spain', 1927, 129, 130, 'The flag carrier of Spain and a founding member of the Oneworld alliance. Part of International Airlines Group (IAG) along with British Airways.', 'https://www.iberia.com'),

('swiss', 'Swiss International Air Lines', 'LX', 'SWR', 'Basel, Switzerland', 2002, 95, 100, 'The flag carrier of Switzerland and a member of the Lufthansa Group and Star Alliance. Known for premium service and Swiss quality.', 'https://www.swiss.com'),

('aer-lingus', 'Aer Lingus', 'EI', 'EIN', 'Dublin, Ireland', 1936, 55, 90, 'The flag carrier of Ireland and a member of International Airlines Group (IAG). Offers US pre-clearance at Dublin and Shannon airports.', 'https://www.aerlingus.com'),

('icelandair', 'Icelandair', 'FI', 'ICE', 'Reykjavik, Iceland', 1937, 55, 50, 'The flag carrier of Iceland, using Reykjavik Keflavik as a hub for transatlantic connections. Known for its Stopover program.', 'https://www.icelandair.com'),

('tap-portugal', 'TAP Air Portugal', 'TP', 'TAP', 'Lisbon, Portugal', 1945, 100, 90, 'The flag carrier of Portugal and a member of Star Alliance. Launch customer of the Airbus A330-900neo.', 'https://www.flytap.com'),

('norwegian', 'Norwegian Air Shuttle', 'DY', 'NAX', 'Oslo, Norway', 1993, 88, 120, 'A major European low-cost carrier. Operates primarily Boeing 737-800s and 737 MAX 8s.', 'https://www.norwegian.com'),

('sas', 'SAS Scandinavian Airlines', 'SK', 'SAS', 'Stockholm, Sweden', 1946, 130, 125, 'The flag carrier of Denmark, Norway, and Sweden, and a founding member of Star Alliance.', 'https://www.flysas.com'),

('finnair', 'Finnair', 'AY', 'FIN', 'Helsinki, Finland', 1923, 80, 130, 'The flag carrier of Finland and one of the world''s oldest operating airlines. Offers the fastest connections between Europe and Asia via Helsinki.', 'https://www.finnair.com');

-- =============================================
-- MIDDLE EAST AIRLINES
-- =============================================

INSERT OR REPLACE INTO airlines (slug, name, iata_code, icao_code, headquarters, founded, fleet_size, destinations, description, website) VALUES
('emirates', 'Emirates', 'EK', 'UAE', 'Dubai, United Arab Emirates', 1985, 270, 150, 'The largest airline in the Middle East. Operates the world''s largest fleets of both Airbus A380s and Boeing 777s. Known for its onboard lounges and showers in first class.', 'https://www.emirates.com'),

('qatar-airways', 'Qatar Airways', 'QR', 'QTR', 'Doha, Qatar', 1993, 269, 170, 'The flag carrier of Qatar and a member of the Oneworld alliance. Named World''s Best Airline multiple times by Skytrax. Known for its Qsuite business class.', 'https://www.qatarairways.com'),

('etihad-airways', 'Etihad Airways', 'EY', 'ETD', 'Abu Dhabi, United Arab Emirates', 2003, 117, 80, 'The flag carrier of the UAE based in Abu Dhabi. Known for The Residence, the world''s first three-room suite on a commercial aircraft.', 'https://www.etihad.com'),

('turkish-airlines', 'Turkish Airlines', 'TK', 'THY', 'Istanbul, Turkey', 1933, 388, 340, 'The flag carrier of Turkey and a member of Star Alliance, serving more countries than any other airline.', 'https://www.turkishairlines.com'),

('el-al', 'El Al Israel Airlines', 'LY', 'ELY', 'Tel Aviv, Israel', 1948, 48, 50, 'The flag carrier of Israel, known for its strict security protocols. Operates an all-Boeing fleet.', 'https://www.elal.com');

-- =============================================
-- ASIA-PACIFIC AIRLINES
-- =============================================

INSERT OR REPLACE INTO airlines (slug, name, iata_code, icao_code, headquarters, founded, fleet_size, destinations, description, website) VALUES
('japan-airlines', 'Japan Airlines', 'JL', 'JAL', 'Tokyo, Japan', 1951, 233, 95, 'The flag carrier of Japan and a founding member of Oneworld alliance. Known for exceptional Japanese hospitality.', 'https://www.jal.com'),

('ana', 'All Nippon Airways', 'NH', 'ANA', 'Tokyo, Japan', 1952, 242, 95, 'Japan''s largest airline and a member of Star Alliance. World''s largest operator of the Boeing 787 Dreamliner.', 'https://www.ana.co.jp'),

('korean-air', 'Korean Air', 'KE', 'KAL', 'Seoul, South Korea', 1969, 169, 120, 'The flag carrier of South Korea and a founding member of SkyTeam. One of the rare airlines still operating both Boeing 747-8s and Airbus A380s.', 'https://www.koreanair.com'),

('singapore-airlines', 'Singapore Airlines', 'SQ', 'SIA', 'Singapore', 1972, 146, 130, 'Consistently ranked among the world''s best airlines. Operates the world''s largest Airbus A350 fleet and the world''s longest flight.', 'https://www.singaporeair.com'),

('cathay-pacific', 'Cathay Pacific', 'CX', 'CPA', 'Hong Kong', 1946, 179, 120, 'Hong Kong''s flag carrier and a founding member of Oneworld alliance.', 'https://www.cathaypacific.com'),

('qantas', 'Qantas', 'QF', 'QFA', 'Sydney, Australia', 1920, 133, 85, 'The flag carrier of Australia and the world''s third oldest airline. Known for its safety record and the Kangaroo Route to London.', 'https://www.qantas.com'),

('air-new-zealand', 'Air New Zealand', 'NZ', 'ANZ', 'Auckland, New Zealand', 1940, 56, 55, 'The flag carrier of New Zealand and a member of Star Alliance. Known for innovative Economy Skycouch seats and creative safety videos.', 'https://www.airnewzealand.com'),

('eva-air', 'EVA Air', 'BR', 'EVA', 'Taipei, Taiwan', 1989, 85, 70, 'A Taiwanese international airline and member of Star Alliance. Known for Hello Kitty themed flights and premium service.', 'https://www.evaair.com'),

('china-airlines', 'China Airlines', 'CI', 'CAL', 'Taipei, Taiwan', 1959, 86, 95, 'The flag carrier of Taiwan and a member of SkyTeam.', 'https://www.china-airlines.com');

-- =============================================
-- AMERICAS AIRLINES (Non-US)
-- =============================================

INSERT OR REPLACE INTO airlines (slug, name, iata_code, icao_code, headquarters, founded, fleet_size, destinations, description, website) VALUES
('air-canada', 'Air Canada', 'AC', 'ACA', 'Montreal, Canada', 1937, 209, 175, 'The flag carrier and largest airline of Canada, and a founding member of Star Alliance.', 'https://www.aircanada.com'),

('westjet', 'WestJet', 'WS', 'WJA', 'Calgary, Canada', 1996, 193, 110, 'Canada''s second-largest airline. Known for friendly service and competitive fares.', 'https://www.westjet.com'),

('aeromexico', 'Aeromexico', 'AM', 'AMX', 'Mexico City, Mexico', 1934, 162, 90, 'The flag carrier of Mexico and a founding member of SkyTeam. Operates the largest Boeing 737 MAX fleet in Latin America.', 'https://www.aeromexico.com'),

('latam', 'LATAM Airlines', 'LA', 'LAN', 'Santiago, Chile', 2012, 370, 145, 'The largest airline in Latin America, formed from the merger of LAN and TAM.', 'https://www.latamairlines.com'),

('avianca', 'Avianca', 'AV', 'AVA', 'Bogota, Colombia', 1919, 163, 80, 'The flag carrier of Colombia and the second oldest continuously operating airline in the world. A member of Star Alliance.', 'https://www.avianca.com'),

('copa-airlines', 'Copa Airlines', 'CM', 'CMP', 'Panama City, Panama', 1947, 112, 80, 'The flag carrier of Panama and a member of Star Alliance. Operates an all-Boeing 737 fleet.', 'https://www.copaair.com');

-- =============================================
-- FLEET MAPPINGS
-- =============================================

-- British Airways
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('british-airways', 'airbus-a380', 12, 'Flagship aircraft'),
('british-airways', 'boeing-777-200er', 43, 'Long-haul workhorse'),
('british-airways', 'boeing-777-300er', 12, 'Premium routes'),
('british-airways', 'boeing-787-8', 12, 'Dreamliner'),
('british-airways', 'boeing-787-9', 18, 'Mid-size Dreamliner'),
('british-airways', 'boeing-787-10', 11, 'Largest Dreamliner'),
('british-airways', 'airbus-a350-1000', 18, 'Newest long-haul'),
('british-airways', 'airbus-a320neo', 20, 'Short-haul'),
('british-airways', 'airbus-a321neo', 18, 'Medium-haul');

-- Lufthansa
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('lufthansa', 'boeing-747-400', 8, 'Legacy jumbo'),
('lufthansa', 'boeing-747-8i', 19, 'Last 747-8 operator'),
('lufthansa', 'airbus-a380', 8, 'Hub feeders'),
('lufthansa', 'airbus-a350-900', 31, 'Primary long-haul'),
('lufthansa', 'airbus-a330-300', 15, 'Transatlantic'),
('lufthansa', 'airbus-a321neo', 45, 'European network'),
('lufthansa', 'airbus-a320neo', 50, 'Short-haul');

-- Air France
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('air-france', 'boeing-777-200er', 30, 'Long-haul workhorse'),
('air-france', 'boeing-777-300er', 33, 'Flagship'),
('air-france', 'boeing-787-9', 10, 'Dreamliner'),
('air-france', 'airbus-a350-900', 24, 'Growing fleet'),
('air-france', 'airbus-a330-200', 15, 'Medium long-haul'),
('air-france', 'airbus-a321neo', 20, 'European'),
('air-france', 'airbus-a320neo', 25, 'Short-haul'),
('air-france', 'airbus-a220-300', 25, 'Regional');

-- KLM
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('klm', 'boeing-777-200er', 15, 'Long-haul'),
('klm', 'boeing-777-300er', 15, 'High-capacity'),
('klm', 'boeing-787-9', 12, 'Dreamliner'),
('klm', 'boeing-787-10', 14, 'Largest Dreamliner'),
('klm', 'airbus-a330-200', 6, 'Medium long-haul'),
('klm', 'airbus-a330-300', 4, 'Transatlantic'),
('klm', 'boeing-737-800', 25, 'European');

-- Virgin Atlantic
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('virgin-atlantic', 'airbus-a350-1000', 12, 'Flagship'),
('virgin-atlantic', 'airbus-a330-900neo', 8, 'Newest widebody'),
('virgin-atlantic', 'airbus-a330-300', 7, 'Being phased out'),
('virgin-atlantic', 'boeing-787-9', 17, 'First European 787-9');

-- Iberia
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('iberia', 'airbus-a350-900', 23, 'Long-haul flagship'),
('iberia', 'airbus-a330-200', 20, 'Transatlantic'),
('iberia', 'airbus-a330-300', 10, 'High-capacity'),
('iberia', 'airbus-a321neo', 12, 'Medium-haul'),
('iberia', 'airbus-a320neo', 18, 'Short-haul'),
('iberia', 'airbus-a320', 24, 'European'),
('iberia', 'airbus-a321', 13, 'Domestic');

-- SWISS
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('swiss', 'boeing-777-300er', 12, 'Ultra-long-haul'),
('swiss', 'airbus-a330-300', 14, 'Transatlantic'),
('swiss', 'airbus-a350-900', 3, 'New deliveries'),
('swiss', 'airbus-a220-300', 21, 'European'),
('swiss', 'airbus-a220-100', 9, 'Regional'),
('swiss', 'airbus-a321neo', 8, 'Medium-haul'),
('swiss', 'airbus-a320neo', 12, 'Short-haul');

-- Aer Lingus
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('aer-lingus', 'airbus-a330-300', 12, 'Transatlantic'),
('aer-lingus', 'airbus-a330-200', 4, 'Long-haul'),
('aer-lingus', 'airbus-a320neo', 15, 'European'),
('aer-lingus', 'airbus-a320', 12, 'Short-haul'),
('aer-lingus', 'airbus-a321neo', 6, 'Medium-haul');

-- Icelandair
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('icelandair', 'boeing-737-max-8', 14, 'Primary narrowbody'),
('icelandair', 'boeing-737-max-9', 7, 'Higher capacity'),
('icelandair', 'boeing-767-300er', 3, 'Retiring'),
('icelandair', 'boeing-757-200', 4, 'Being phased out');

-- TAP Portugal
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('tap-portugal', 'airbus-a330-900neo', 21, 'Launch customer'),
('tap-portugal', 'airbus-a321neo', 23, 'Includes A321LR'),
('tap-portugal', 'airbus-a320neo', 25, 'European'),
('tap-portugal', 'airbus-a319', 10, 'Short-haul'),
('tap-portugal', 'airbus-a320', 12, 'European');

-- Norwegian
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('norwegian', 'boeing-737-max-8', 42, 'Primary fleet'),
('norwegian', 'boeing-737-800', 46, 'Being replaced');

-- SAS
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('sas', 'airbus-a350-900', 6, 'Long-haul flagship'),
('sas', 'airbus-a330-300', 8, 'Transatlantic'),
('sas', 'airbus-a321neo', 3, 'Includes A321LR'),
('sas', 'airbus-a320neo', 73, 'Primary European'),
('sas', 'airbus-a320', 12, 'Short-haul');

-- Finnair
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('finnair', 'airbus-a350-900', 18, 'Europe-Asia'),
('finnair', 'airbus-a330-300', 8, 'Long-haul'),
('finnair', 'airbus-a321', 15, 'European'),
('finnair', 'airbus-a320neo', 12, 'Short-haul'),
('finnair', 'airbus-a319', 8, 'Regional');

-- Emirates
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('emirates', 'airbus-a380', 110, 'World''s largest A380 operator'),
('emirates', 'boeing-777-300er', 119, 'World''s largest 777 operator'),
('emirates', 'boeing-777-200lr', 10, 'Ultra-long-haul'),
('emirates', 'airbus-a350-900', 10, 'New addition');

-- Qatar Airways
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('qatar-airways', 'boeing-777-300er', 57, 'Primary long-haul'),
('qatar-airways', 'boeing-777-200lr', 7, 'Ultra-long-haul'),
('qatar-airways', 'boeing-787-8', 32, 'Medium long-haul'),
('qatar-airways', 'boeing-787-9', 24, 'Growing fleet'),
('qatar-airways', 'airbus-a350-900', 34, 'Premium Qsuite'),
('qatar-airways', 'airbus-a350-1000', 25, 'Flagship'),
('qatar-airways', 'airbus-a380', 8, 'High-capacity'),
('qatar-airways', 'airbus-a321neo', 20, 'European'),
('qatar-airways', 'airbus-a320', 30, 'Short-haul');

-- Etihad
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('etihad-airways', 'boeing-787-9', 30, 'Fleet backbone'),
('etihad-airways', 'boeing-787-10', 17, 'High-capacity'),
('etihad-airways', 'boeing-777-300er', 16, 'Long-haul flagship'),
('etihad-airways', 'airbus-a350-1000', 6, 'Newest widebody'),
('etihad-airways', 'airbus-a380', 5, 'Premium routes'),
('etihad-airways', 'airbus-a321neo', 20, 'European'),
('etihad-airways', 'airbus-a320', 16, 'Short-haul');

-- Turkish Airlines
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('turkish-airlines', 'boeing-777-300er', 35, 'Long-haul workhorse'),
('turkish-airlines', 'boeing-787-9', 30, 'Growing Dreamliner'),
('turkish-airlines', 'airbus-a350-900', 30, 'Newest widebody'),
('turkish-airlines', 'airbus-a330-200', 12, 'Medium long-haul'),
('turkish-airlines', 'airbus-a330-300', 16, 'Transatlantic'),
('turkish-airlines', 'boeing-737-max-8', 50, 'Primary narrowbody'),
('turkish-airlines', 'boeing-737-max-9', 25, 'Higher capacity'),
('turkish-airlines', 'boeing-737-800', 60, 'Legacy fleet'),
('turkish-airlines', 'airbus-a321neo', 35, 'European');

-- El Al
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('el-al', 'boeing-787-9', 13, 'Primary widebody'),
('el-al', 'boeing-787-8', 4, 'Dreamliner'),
('el-al', 'boeing-777-200er', 6, 'Long-haul flagship'),
('el-al', 'boeing-737-900er', 8, 'European'),
('el-al', 'boeing-737-800', 16, 'Short-haul');

-- Japan Airlines
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('japan-airlines', 'airbus-a350-1000', 10, 'New flagship'),
('japan-airlines', 'airbus-a350-900', 16, 'Domestic and regional'),
('japan-airlines', 'boeing-777-300er', 10, 'Being replaced'),
('japan-airlines', 'boeing-787-8', 23, 'International'),
('japan-airlines', 'boeing-787-9', 22, 'Primary Dreamliner'),
('japan-airlines', 'boeing-767-300er', 18, 'Domestic'),
('japan-airlines', 'boeing-737-800', 40, 'Short-haul');

-- ANA
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('ana', 'boeing-787-8', 34, 'Launch customer'),
('ana', 'boeing-787-9', 44, 'Primary Dreamliner'),
('ana', 'boeing-787-10', 10, 'Largest variant'),
('ana', 'boeing-777-300er', 14, 'Premium long-haul'),
('ana', 'airbus-a380', 3, 'Flying Honu'),
('ana', 'boeing-767-300er', 15, 'Domestic'),
('ana', 'boeing-737-800', 35, 'Short-haul');

-- Korean Air
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('korean-air', 'airbus-a380', 7, 'High-capacity'),
('korean-air', 'boeing-747-8i', 7, 'Premium routes'),
('korean-air', 'boeing-777-300er', 28, 'Primary long-haul'),
('korean-air', 'boeing-787-9', 10, 'Dreamliner'),
('korean-air', 'boeing-787-10', 8, 'Growing fleet'),
('korean-air', 'airbus-a330-200', 10, 'Medium long-haul'),
('korean-air', 'airbus-a330-300', 12, 'Transatlantic'),
('korean-air', 'boeing-737-max-8', 20, 'Short-haul'),
('korean-air', 'airbus-a220-300', 10, 'Regional');

-- Singapore Airlines
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('singapore-airlines', 'airbus-a350-900', 58, 'World''s largest A350 fleet'),
('singapore-airlines', 'airbus-a380', 12, 'Suites and premium'),
('singapore-airlines', 'boeing-777-300er', 22, 'First class routes'),
('singapore-airlines', 'boeing-787-10', 26, 'Regional'),
('singapore-airlines', 'airbus-a320neo', 20, 'Short-haul'),
('singapore-airlines', 'boeing-737-max-8', 12, 'Regional');

-- Cathay Pacific
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('cathay-pacific', 'airbus-a350-900', 30, 'Long-haul workhorse'),
('cathay-pacific', 'airbus-a350-1000', 18, 'Flagship'),
('cathay-pacific', 'boeing-777-300er', 36, 'Primary long-haul'),
('cathay-pacific', 'airbus-a330-300', 43, 'Regional'),
('cathay-pacific', 'airbus-a321neo', 16, 'Regional expansion');

-- Qantas
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('qantas', 'airbus-a380', 10, 'Kangaroo Route'),
('qantas', 'boeing-787-9', 14, 'Long-haul Dreamliner'),
('qantas', 'airbus-a330-200', 16, 'International'),
('qantas', 'airbus-a330-300', 14, 'High-capacity'),
('qantas', 'boeing-737-800', 45, 'Domestic'),
('qantas', 'airbus-a320', 20, 'Short-haul');

-- Air New Zealand
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('air-new-zealand', 'boeing-787-9', 14, 'Skycouch widebody'),
('air-new-zealand', 'boeing-777-300er', 10, 'Long-haul flagship'),
('air-new-zealand', 'airbus-a321neo', 5, 'Trans-Tasman'),
('air-new-zealand', 'airbus-a320neo', 14, 'Domestic'),
('air-new-zealand', 'airbus-a320', 9, 'Short-haul');

-- EVA Air
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('eva-air', 'boeing-777-300er', 33, 'Long-haul workhorse'),
('eva-air', 'boeing-787-9', 8, 'Dreamliner'),
('eva-air', 'boeing-787-10', 13, 'High-capacity'),
('eva-air', 'airbus-a330-300', 9, 'Medium-haul'),
('eva-air', 'airbus-a321neo', 5, 'Regional');

-- China Airlines
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('china-airlines', 'airbus-a350-900', 15, 'Primary long-haul'),
('china-airlines', 'boeing-777-300er', 10, 'High-capacity'),
('china-airlines', 'airbus-a330-300', 16, 'Medium-haul'),
('china-airlines', 'boeing-737-800', 10, 'Regional'),
('china-airlines', 'airbus-a321neo', 17, 'Short-haul');

-- Air Canada
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('air-canada', 'boeing-777-300er', 19, 'High-capacity long-haul'),
('air-canada', 'boeing-777-200lr', 6, 'Ultra-long-haul'),
('air-canada', 'boeing-787-8', 8, 'Dreamliner'),
('air-canada', 'boeing-787-9', 32, 'Primary widebody'),
('air-canada', 'airbus-a330-300', 20, 'Transatlantic'),
('air-canada', 'airbus-a321neo', 12, 'Medium-haul'),
('air-canada', 'airbus-a320', 42, 'Domestic'),
('air-canada', 'boeing-737-max-8', 40, 'North American'),
('air-canada', 'airbus-a220-300', 30, 'Regional');

-- WestJet
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('westjet', 'boeing-787-9', 7, 'Transatlantic'),
('westjet', 'boeing-737-max-8', 50, 'Primary narrowbody'),
('westjet', 'boeing-737-800', 65, 'Legacy fleet'),
('westjet', 'boeing-737-700', 32, 'Regional');

-- Aeromexico
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('aeromexico', 'boeing-787-8', 8, 'Long-haul'),
('aeromexico', 'boeing-787-9', 9, 'Premium long-haul'),
('aeromexico', 'boeing-737-max-8', 42, 'Primary narrowbody'),
('aeromexico', 'boeing-737-max-9', 25, 'High-capacity'),
('aeromexico', 'boeing-737-800', 38, 'Regional'),
('aeromexico', 'embraer-e190-e2', 37, 'Regional service');

-- LATAM
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('latam', 'boeing-787-8', 8, 'Long-haul'),
('latam', 'boeing-787-9', 29, 'Primary widebody'),
('latam', 'boeing-777-300er', 10, 'High-capacity'),
('latam', 'airbus-a320neo', 80, 'Primary narrowbody'),
('latam', 'airbus-a320', 70, 'Regional'),
('latam', 'airbus-a321neo', 25, 'Medium-haul'),
('latam', 'airbus-a319', 30, 'Short-haul');

-- Avianca
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('avianca', 'boeing-787-8', 15, 'Only widebody'),
('avianca', 'airbus-a330-200', 14, 'Medium-haul'),
('avianca', 'airbus-a320neo', 33, 'Growing fleet'),
('avianca', 'airbus-a320', 65, 'Primary narrowbody'),
('avianca', 'airbus-a319', 8, 'Regional');

-- Copa Airlines
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('copa-airlines', 'boeing-737-max-9', 32, 'Primary narrowbody'),
('copa-airlines', 'boeing-737-max-8', 6, 'Growing MAX fleet'),
('copa-airlines', 'boeing-737-800', 58, 'Legacy workhorse'),
('copa-airlines', 'boeing-737-700', 9, 'Regional');
