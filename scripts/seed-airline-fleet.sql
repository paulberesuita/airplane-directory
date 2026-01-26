-- Seed airline fleet mappings
-- Created: 2026-01-25
-- Sources: Airfleets.net, airline newsrooms, Wikipedia fleet pages

-- American Airlines Fleet
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('american-airlines', 'airbus-a319', 48, 'Domestic and short-haul routes'),
('american-airlines', 'airbus-a320', 48, 'Domestic routes'),
('american-airlines', 'airbus-a321', 219, 'Includes A321T transcontinental configuration'),
('american-airlines', 'airbus-a321neo', 76, 'Newest narrowbody, premium routes'),
('american-airlines', 'boeing-737-800', 304, 'Workhorse of domestic fleet'),
('american-airlines', 'boeing-737-max-8', 85, 'Newest 737 variant'),
('american-airlines', 'boeing-757-200', 34, 'Transcontinental and Hawaii'),
('american-airlines', 'boeing-767-300er', 17, 'International routes'),
('american-airlines', 'boeing-777-200er', 47, 'Long-haul international'),
('american-airlines', 'boeing-777-300er', 20, 'Flagship international routes'),
('american-airlines', 'boeing-787-8', 37, 'Long-haul international'),
('american-airlines', 'boeing-787-9', 32, 'Premium long-haul routes'),
('american-airlines', 'embraer-e175', 102, 'American Eagle regional service');

-- Delta Air Lines Fleet
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('delta-air-lines', 'airbus-a220-100', 45, 'Regional and short-haul'),
('delta-air-lines', 'airbus-a220-300', 46, 'Larger A220 variant'),
('delta-air-lines', 'airbus-a319', 57, 'Domestic routes'),
('delta-air-lines', 'airbus-a320', 62, 'Domestic routes'),
('delta-air-lines', 'airbus-a321', 127, 'Domestic and transcontinental'),
('delta-air-lines', 'airbus-a321neo', 40, 'Newest narrowbody'),
('delta-air-lines', 'boeing-717', 91, 'World''s largest 717 operator'),
('delta-air-lines', 'boeing-737-800', 77, 'Domestic routes'),
('delta-air-lines', 'boeing-737-900er', 130, 'High-capacity domestic'),
('delta-air-lines', 'boeing-757-200', 111, 'Transcontinental and international'),
('delta-air-lines', 'boeing-757-300', 16, 'High-density domestic'),
('delta-air-lines', 'boeing-767-300er', 58, 'Transatlantic routes'),
('delta-air-lines', 'boeing-767-400er', 21, 'Premium transatlantic'),
('delta-air-lines', 'airbus-a330-200', 11, 'International routes'),
('delta-air-lines', 'airbus-a330-300', 31, 'International routes'),
('delta-air-lines', 'airbus-a330-900neo', 45, 'Newest A330 variant'),
('delta-air-lines', 'airbus-a350-900', 35, 'Premium long-haul');

-- United Airlines Fleet
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('united-airlines', 'airbus-a319', 81, 'Being retired, domestic routes'),
('united-airlines', 'airbus-a320', 76, 'Domestic routes'),
('united-airlines', 'airbus-a321neo', 36, 'Premium domestic routes'),
('united-airlines', 'boeing-737-700', 40, 'Regional routes'),
('united-airlines', 'boeing-737-800', 141, 'Domestic workhorse'),
('united-airlines', 'boeing-737-900er', 148, 'High-capacity domestic'),
('united-airlines', 'boeing-737-max-8', 123, 'Newest 737 variant'),
('united-airlines', 'boeing-737-max-9', 120, 'World''s largest MAX 9 operator'),
('united-airlines', 'boeing-757-200', 40, 'Transcontinental'),
('united-airlines', 'boeing-757-300', 21, 'High-density, world''s largest 757-300 operator'),
('united-airlines', 'boeing-767-300er', 38, 'Transatlantic routes'),
('united-airlines', 'boeing-767-400er', 16, 'Premium transatlantic'),
('united-airlines', 'boeing-777-200er', 55, 'International routes'),
('united-airlines', 'boeing-777-300er', 22, 'Premium international'),
('united-airlines', 'boeing-787-8', 38, 'Long-haul international'),
('united-airlines', 'boeing-787-9', 50, 'Long-haul international'),
('united-airlines', 'boeing-787-10', 26, 'Largest Dreamliner variant');

-- Southwest Airlines Fleet (all-Boeing 737)
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('southwest-airlines', 'boeing-737-700', 334, 'Being phased out by 2031'),
('southwest-airlines', 'boeing-737-800', 203, 'Medium-haul routes'),
('southwest-airlines', 'boeing-737-max-8', 273, 'Primary growth aircraft');

-- JetBlue Airways Fleet
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('jetblue-airways', 'airbus-a220-300', 30, 'Replacing E190 fleet'),
('jetblue-airways', 'airbus-a320', 130, 'Core domestic fleet'),
('jetblue-airways', 'airbus-a321', 36, 'Domestic routes'),
('jetblue-airways', 'airbus-a321neo', 61, 'Includes Mint transatlantic service'),
('jetblue-airways', 'embraer-e190', 13, 'Being phased out');

-- Alaska Airlines Fleet (includes Hawaiian Airlines aircraft)
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('alaska-airlines', 'boeing-737-700', 13, 'Short-haul routes'),
('alaska-airlines', 'boeing-737-800', 62, 'Domestic routes'),
('alaska-airlines', 'boeing-737-900er', 79, 'Domestic routes'),
('alaska-airlines', 'boeing-737-max-9', 82, 'Newest narrowbody'),
('alaska-airlines', 'boeing-787-9', 5, 'From Hawaiian, international routes'),
('alaska-airlines', 'airbus-a321neo', 18, 'From Hawaiian, Hawaii routes'),
('alaska-airlines', 'airbus-a330-200', 24, 'From Hawaiian, Asia/Pacific routes'),
('alaska-airlines', 'boeing-717', 19, 'From Hawaiian, inter-island routes'),
('alaska-airlines', 'embraer-e175', 44, 'Horizon Air regional service');

-- Spirit Airlines Fleet (all-Airbus)
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('spirit-airlines', 'airbus-a319', 31, 'Smaller routes'),
('spirit-airlines', 'airbus-a320', 82, 'Core fleet'),
('spirit-airlines', 'airbus-a320neo', 60, 'Newest narrowbody'),
('spirit-airlines', 'airbus-a321', 41, 'High-capacity routes');

-- Frontier Airlines Fleet (all-Airbus A320 family)
INSERT OR REPLACE INTO airline_fleet (airline_slug, aircraft_slug, count, notes) VALUES
('frontier-airlines', 'airbus-a320', 15, 'Older fleet'),
('frontier-airlines', 'airbus-a320neo', 89, 'Primary fleet'),
('frontier-airlines', 'airbus-a321', 8, 'Larger routes'),
('frontier-airlines', 'airbus-a321neo', 38, 'Newest and largest variant');
