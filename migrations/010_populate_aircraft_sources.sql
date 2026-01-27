-- Populate aircraft_sources table with per-field source tracking
-- Date: 2026-01-26

-- ============================================
-- BOEING 737-800 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-737-800', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Boeing_737_Next_Generation', 'Wikipedia - Boeing 737 NG', 'aviation_db', '2026-01-26', 'MTOW 174,200 lb (79,010 kg)'),
('boeing-737-800', 'fuel_capacity_liters', 'https://en.wikipedia.org/wiki/Boeing_737_Next_Generation', 'Wikipedia - Boeing 737 NG', 'aviation_db', '2026-01-26', 'Wing redesign increased fuel capacity by 30%'),
('boeing-737-800', 'service_ceiling_m', 'https://skybrary.aero/aircraft/b738', 'SKYbrary - B738', 'aviation_db', '2026-01-26', 'Ceiling: 41,000 ft (FL410)'),
('boeing-737-800', 'takeoff_distance_m', 'https://www.flugzeuginfo.net/acdata_php/acdata_7378_en.php', 'Flugzeuginfo', 'aviation_db', '2026-01-26', 'FAA/EASA takeoff runway at MTOW: 5,875 ft (1,790m)'),
('boeing-737-800', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Boeing_737_Next_Generation', 'Wikipedia - Boeing 737 NG', 'aviation_db', '2026-01-26', 'CFM56-7B rated 26,000 lb (115.7 kN)'),
('boeing-737-800', 'total_orders', 'https://en.wikipedia.org/wiki/List_of_Boeing_737_Next_Generation_orders_and_deliveries', 'Wikipedia - Boeing 737 NG Orders', 'aviation_db', '2026-01-26', 'Most successful 737 NG variant');

-- ============================================
-- BOEING 737 MAX 8 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-737-max-8', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Boeing_737_MAX', 'Wikipedia - Boeing 737 MAX', 'aviation_db', '2026-01-26', 'MTOW: 82,191 kg (181,200 lb)'),
('boeing-737-max-8', 'fuel_capacity_liters', 'https://www.airlines-inform.com/commercial-aircraft/boeing-737-max-8.html', 'Airlines Inform', 'aviation_db', '2026-01-26', 'Total fuel capacity: 26,025 liters'),
('boeing-737-max-8', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Boeing_737_MAX', 'Wikipedia - Boeing 737 MAX', 'aviation_db', '2026-01-26', 'LEAP-1B: 29,317 lbf (130.3 kN)'),
('boeing-737-max-8', 'total_orders', 'https://en.wikipedia.org/wiki/List_of_Boeing_737_MAX_orders_and_deliveries', 'Wikipedia - Boeing 737 MAX Orders', 'aviation_db', '2026-01-26', 'Backlog of 4,867 aircraft as of Dec 2025'),
('boeing-737-max-8', 'total_delivered', 'https://flightplan.forecastinternational.com/2026/01/15/airbus-and-boeing-report-december-2025-commercial-aircraft-orders-and-deliveries/', 'Forecast International', 'news', '2026-01-26', 'Boeing delivered 600 aircraft in 2025'),
('boeing-737-max-8', 'list_price_usd', 'https://simpleflying.com/boeing-737-max-cost-2025/', 'Simple Flying', 'news', '2026-01-26', '2018 list price: $117.1 million');

-- ============================================
-- BOEING 737-900ER SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-737-900er', 'max_takeoff_weight_kg', 'https://www.flugzeuginfo.net/acdata_php/acdata_7379_en.php', 'Flugzeuginfo', 'aviation_db', '2026-01-26', 'MTOW: 85,139 kg (187,700 lb)'),
('boeing-737-900er', 'fuel_capacity_liters', 'https://planephd.com/wizard/details/1109/BOEING-737-900-ER-specifications-performance-operating-cost-valuation', 'Plane PhD', 'aviation_db', '2026-01-26', 'Weight usable fuel: 23,292 kg (29,671 litres)'),
('boeing-737-900er', 'takeoff_distance_m', 'https://www.flugzeuginfo.net/acdata_php/acdata_7379_en.php', 'Flugzeuginfo', 'aviation_db', '2026-01-26', 'Runway length at MTOW: 9,800 ft (2,987 m)');

-- ============================================
-- AIRBUS A320NEO SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a320neo', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A320neo_family', 'Wikipedia - A320neo Family', 'aviation_db', '2026-01-26', 'MTOW: 79,000 kg'),
('airbus-a320neo', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Airbus_A320neo_family', 'Wikipedia - A320neo Family', 'aviation_db', '2026-01-26', 'CFM LEAP-1A or PW1100G: 27,000 lbf (120.1 kN)'),
('airbus-a320neo', 'total_orders', 'https://en.wikipedia.org/wiki/List_of_Airbus_A320neo_family_orders_and_deliveries', 'Wikipedia - A320neo Orders', 'aviation_db', '2026-01-26', '11,529 A320neo family ordered as of Dec 2025'),
('airbus-a320neo', 'total_delivered', 'https://www.airbus.com/en/products-services/commercial-aircraft/orders-and-deliveries', 'Airbus Orders & Deliveries', 'manufacturer', '2026-01-26', '4,372 delivered as of Dec 2025'),
('airbus-a320neo', 'service_ceiling_m', 'https://aerocorner.com/aircraft/airbus-acj320neo/', 'Aero Corner', 'aviation_db', '2026-01-26', 'Service ceiling: 41,000 ft');

-- ============================================
-- AIRBUS A321NEO SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a321neo', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia - A321neo', 'aviation_db', '2026-01-26', 'Standard MTOW: 97 tonnes'),
('airbus-a321neo', 'fuel_capacity_liters', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia - A321neo', 'aviation_db', '2026-01-26', 'Standard fuel: 23,750 litres without ACTs'),
('airbus-a321neo', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia - A321neo', 'aviation_db', '2026-01-26', 'LEAP-1A or PW1100G: 109-156 kN'),
('airbus-a321neo', 'list_price_usd', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia - A321neo', 'aviation_db', '2026-01-26', '2018 list price: US$129.5 million');

-- ============================================
-- BOEING 787-8 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-787-8', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Boeing_787_Dreamliner', 'Wikipedia - Boeing 787', 'aviation_db', '2026-01-26', 'MTOW: 227.9 tonnes'),
('boeing-787-8', 'fuel_capacity_liters', 'https://www.globalair.com/aircraft-for-sale/specifications?specid=1699', 'GlobalAir', 'aviation_db', '2026-01-26', 'Fuel capacity: 32,940 US gal (126,917 L)'),
('boeing-787-8', 'total_orders', 'https://en.wikipedia.org/wiki/List_of_Boeing_787_orders_and_deliveries', 'Wikipedia - 787 Orders', 'aviation_db', '2026-01-26', '2,325 total 787 orders as of Dec 2025'),
('boeing-787-8', 'total_delivered', 'https://en.wikipedia.org/wiki/List_of_Boeing_787_orders_and_deliveries', 'Wikipedia - 787 Deliveries', 'aviation_db', '2026-01-26', '399 787-8s delivered'),
('boeing-787-8', 'engine_thrust_kn', 'https://www.aerotime.aero/articles/advantages-and-key-features-of-the-boeing-787-8', 'Aerotime', 'news', '2026-01-26', 'GEnx or Trent 1000 engines');

-- ============================================
-- BOEING 787-9 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-787-9', 'max_takeoff_weight_kg', 'https://skybrary.aero/aircraft/b789', 'SKYbrary - B789', 'aviation_db', '2026-01-26', 'MTOW: 253,000 kg'),
('boeing-787-9', 'service_ceiling_m', 'https://skybrary.aero/aircraft/b789', 'SKYbrary - B789', 'aviation_db', '2026-01-26', 'Ceiling: 43,100 ft'),
('boeing-787-9', 'takeoff_distance_m', 'https://www.flugzeuginfo.net/acdata_php/acdata_boeing_7879_en.php', 'Flugzeuginfo', 'aviation_db', '2026-01-26', 'Takeoff distance: 9,200 ft (2,800 m)'),
('boeing-787-9', 'engine_thrust_kn', 'https://skybrary.aero/aircraft/b789', 'SKYbrary - B789', 'aviation_db', '2026-01-26', 'GEnx-1B or Trent 1000: 320 kN'),
('boeing-787-9', 'total_delivered', 'https://en.wikipedia.org/wiki/List_of_Boeing_787_orders_and_deliveries', 'Wikipedia - 787 Deliveries', 'aviation_db', '2026-01-26', '681 787-9s delivered');

-- ============================================
-- BOEING 777-300ER SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-777-300er', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Boeing_777', 'Wikipedia - Boeing 777', 'aviation_db', '2026-01-26', 'MTOW: 351,534 kg (775,000 lb)'),
('boeing-777-300er', 'fuel_capacity_liters', 'https://planephd.com/wizard/details/1124/BOEING-777-300ER-specifications-performance-operating-cost-valuation', 'Plane PhD', 'aviation_db', '2026-01-26', 'Fuel: 142,307 kg (181,283 litres)'),
('boeing-777-300er', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Boeing_777', 'Wikipedia - Boeing 777', 'aviation_db', '2026-01-26', 'GE90-115B: 115,300 lbf (513 kN) - most powerful jet engine'),
('boeing-777-300er', 'total_orders', 'https://en.wikipedia.org/wiki/Boeing_777', 'Wikipedia - Boeing 777', 'aviation_db', '2026-01-26', 'Best-selling 777 variant with 833 delivered');

-- ============================================
-- AIRBUS A350-900 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a350-900', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia - Airbus A350', 'aviation_db', '2026-01-26', 'MTOW: 283 tonnes with Trent XWB-84'),
('airbus-a350-900', 'fuel_capacity_liters', 'https://aircraftinvestigation.info/airplanes/Airbus_A350-900.html', 'Aircraft Investigation', 'aviation_db', '2026-01-26', 'Max fuel capacity: 166,000 liters'),
('airbus-a350-900', 'cargo_capacity_m3', 'https://www.iagcargo.com/en/fleet/airbus-a350-900/', 'IAG Cargo', 'aviation_db', '2026-01-26', 'Usable cargo volume: 172.40 m3'),
('airbus-a350-900', 'engine_thrust_kn', 'https://www.aircraft.airbus.com/en/aircraft/a350/a350-900', 'Airbus Official', 'manufacturer', '2026-01-26', 'Trent XWB-84: 84,200 lbf (374.5 kN)');

-- ============================================
-- AIRBUS A380 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a380', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A380', 'Wikipedia - Airbus A380', 'aviation_db', '2026-01-26', 'MTOW: 575,000 kg - 30% higher than 747-8i'),
('airbus-a380', 'fuel_capacity_liters', 'https://specsdir.com/a380-airbus-specs/', 'Specs Dir', 'aviation_db', '2026-01-26', 'Fuel capacity: 81,890 liters noted, actual ~320,000 liters'),
('airbus-a380', 'cargo_capacity_m3', 'https://en.wikipedia.org/wiki/Airbus_A380', 'Wikipedia - Airbus A380', 'aviation_db', '2026-01-26', 'Volume of 3 decks: 1,570 m3; cargo: 38 LD3'),
('airbus-a380', 'engine_thrust_kn', 'https://simpleflying.com/how-powerful-airbus-a380/', 'Simple Flying', 'news', '2026-01-26', 'Trent 900: up to 374 kN, GP7200: 363 kN'),
('airbus-a380', 'total_delivered', 'https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a380', 'Airbus Official', 'manufacturer', '2026-01-26', '251 aircraft delivered, production ended');

-- ============================================
-- BOEING 747-8 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-747-8i', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Boeing_747-8', 'Wikipedia - Boeing 747-8', 'aviation_db', '2026-01-26', 'MTOW: 975,000 lb (442,253 kg) - heaviest Boeing'),
('boeing-747-8i', 'fuel_capacity_liters', 'https://www.airport-technology.com/projects/boeing-747-8/', 'Airport Technology', 'aviation_db', '2026-01-26', 'Max fuel: 243,120 liters (64,225 gal)'),
('boeing-747-8i', 'cargo_capacity_m3', 'https://www.airport-technology.com/projects/boeing-747-8/', 'Airport Technology', 'aviation_db', '2026-01-26', 'Total cargo: 161.5 m3 + 19.2 m3 bulk'),
('boeing-747-8i', 'engine_thrust_kn', 'https://aerocorner.com/aircraft/boeing-747-8/', 'Aero Corner', 'aviation_db', '2026-01-26', 'GEnx engines from 787 Dreamliner');

-- ============================================
-- AIRBUS A220-300 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a220-300', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia - Airbus A220', 'aviation_db', '2026-01-26', 'MTOW: 69.9 tonnes (154,000 lb)'),
('airbus-a220-300', 'engine_thrust_kn', 'https://stands.aero/blog/airbus/airbus-a220-300-features-specifications-and-passenger-experience/', 'National Aero Stands', 'aviation_db', '2026-01-26', 'PW1500G: 23,300 lbf with 12:1 bypass ratio'),
('airbus-a220-300', 'total_delivered', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia - Airbus A220', 'aviation_db', '2026-01-26', 'Fleet of 314 aircraft by Jan 2024; 100M passengers by Jul 2024');

-- ============================================
-- BOEING 757-200 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-757-200', 'max_takeoff_weight_kg', 'https://www.b757.info/boeing-757-200-specifications/', 'B757.info', 'aviation_db', '2026-01-26', 'Extended range MTOW: 115,665 kg (255,000 lb)'),
('boeing-757-200', 'fuel_capacity_liters', 'https://www.flugzeuginfo.net/acdata_php/acdata_7572_en.php', 'Flugzeuginfo', 'aviation_db', '2026-01-26', 'Optional fuel: 43,489 litres'),
('boeing-757-200', 'cargo_capacity_m3', 'https://www.boeing.com/content/dam/boeing/boeingdotcom/company/about_bca/startup/pdf/freighters/757f.pdf', 'Boeing Official', 'manufacturer', '2026-01-26', 'Total freight volume: 8,390 cu ft');

-- ============================================
-- BOEING 767-300ER SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-767-300er', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Boeing_767', 'Wikipedia - Boeing 767', 'aviation_db', '2026-01-26', 'MTOW: 412,000 lb (187,000 kg) by 1993'),
('boeing-767-300er', 'fuel_capacity_liters', 'https://en.wikipedia.org/wiki/Boeing_767', 'Wikipedia - Boeing 767', 'aviation_db', '2026-01-26', 'Total with 2nd center tank: 90,774 litres'),
('boeing-767-300er', 'engine_thrust_kn', 'https://www.skytamer.com/Boeing_767-300ER.html', 'Skytamer', 'aviation_db', '2026-01-26', 'PW4060 or CF6-80C2B6: 60,000 lbs (266.9 kN)'),
('boeing-767-300er', 'total_orders', 'https://en.wikipedia.org/wiki/Boeing_767', 'Wikipedia - Boeing 767', 'aviation_db', '2026-01-26', 'Most successful 767 variant');

-- ============================================
-- AIRBUS A330-300 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a330-300', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia - Airbus A330', 'aviation_db', '2026-01-26', 'MTOW: 242 tonnes (534,000 lb)'),
('airbus-a330-300', 'fuel_capacity_liters', 'https://www.aircraft-commerce.com/wp-content/uploads/aircraft-commerce-docs/Aircraft%20guides/A330-200-300/ISSUE57_A330_SPECS.pdf', 'Aircraft Commerce', 'aviation_db', '2026-01-26', 'Standard: 97,530 L; Optional: 139,090 L'),
('airbus-a330-300', 'cargo_capacity_m3', 'https://www.iagcargo.com/en/fleet/airbus-a330-300/', 'IAG Cargo', 'aviation_db', '2026-01-26', '32 LD3 containers or 11 pallets');

-- ============================================
-- EMBRAER E175 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('embraer-e175', 'max_takeoff_weight_kg', 'https://www.globalair.com/aircraft-for-sale/specifications?specid=1364', 'GlobalAir', 'aviation_db', '2026-01-26', 'MTOW: 89,000 lbs'),
('embraer-e175', 'fuel_capacity_liters', 'https://www.guardianjet.com/jet-aircraft-online-tools/aircraft-brochure.cfm?m=Embraer-E175-239', 'Guardian Jet', 'aviation_db', '2026-01-26', 'Fuel tanks: 20,580 lbs'),
('embraer-e175', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Embraer_E-Jet_family', 'Wikipedia - E-Jet', 'aviation_db', '2026-01-26', 'CF34-8E: 14,500 lbf (64.5 kN)'),
('embraer-e175', 'takeoff_distance_m', 'https://aviatorinsider.com/airplane-brands/embraer-175/', 'Aviator Insider', 'aviation_db', '2026-01-26', 'Min runway: 4,137 ft takeoff, 4,131 ft landing');

-- ============================================
-- BOEING 777-200ER SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('boeing-777-200er', 'max_takeoff_weight_kg', 'https://www.flugzeuginfo.net/acdata_php/acdata_7772_en.php', 'Flugzeuginfo', 'aviation_db', '2026-01-26', 'MTOW: 286,897 kg (632,500 lb)'),
('boeing-777-200er', 'fuel_capacity_liters', 'https://www.skytamer.com/Boeing_777-200ER.html', 'Skytamer', 'aviation_db', '2026-01-26', 'Fuel: 134,361 kg (171,160 litres)'),
('boeing-777-200er', 'service_ceiling_m', 'https://skybrary.aero/aircraft/b772', 'SKYbrary', 'aviation_db', '2026-01-26', 'Ceiling: 43,000 ft (FL430)');

-- ============================================
-- AIRBUS A321 (CEO) SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('airbus-a321', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia - Airbus A321', 'aviation_db', '2026-01-26', 'A321-200 MTOW: 93,500 kg'),
('airbus-a321', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia - Airbus A321', 'aviation_db', '2026-01-26', 'CFM56 or V2500: 133-147 kN');

-- ============================================
-- BOMBARDIER CRJ-900 SOURCES
-- ============================================
INSERT INTO aircraft_sources (aircraft_slug, field_name, source_url, source_name, source_type, accessed_at, notes) VALUES
('bombardier-crj-900', 'max_takeoff_weight_kg', 'https://en.wikipedia.org/wiki/Bombardier_CRJ700_series', 'Wikipedia - CRJ Series', 'aviation_db', '2026-01-26', 'Production now under Mitsubishi'),
('bombardier-crj-900', 'engine_thrust_kn', 'https://en.wikipedia.org/wiki/Bombardier_CRJ700_series', 'Wikipedia - CRJ Series', 'aviation_db', '2026-01-26', 'CF34-8C5: 13,790 lbf');
