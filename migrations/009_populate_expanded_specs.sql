-- Populate expanded aircraft specifications with family groupings
-- Data researched from manufacturer specs, Wikipedia, SKYbrary, and aviation databases
-- Date: 2026-01-26

-- ============================================
-- TIER 1: HIGH PRIORITY AIRCRAFT
-- ============================================

-- Boeing 737-800 (Boeing 737 NG Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 79010,
  fuel_capacity_liters = 26020,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1790,
  landing_distance_m = 1600,
  cargo_capacity_m3 = 45.0,
  engine_thrust_kn = 121.4,
  engine_manufacturer = 'CFM International',
  total_orders = 4989,
  total_delivered = 4989,
  list_price_usd = 106100000,
  family_slug = 'boeing-737-ng',
  variant_order = 2
WHERE slug = 'boeing-737-800';

-- Boeing 737 MAX 8 (Boeing 737 MAX Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 82191,
  fuel_capacity_liters = 25816,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2100,
  landing_distance_m = 1600,
  cargo_capacity_m3 = 46.9,
  engine_thrust_kn = 130.3,
  engine_manufacturer = 'CFM International',
  total_orders = 5084,
  total_delivered = 1150,
  list_price_usd = 117100000,
  family_slug = 'boeing-737-max',
  variant_order = 2
WHERE slug = 'boeing-737-max-8';

-- Boeing 737-900ER (Boeing 737 NG Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 85139,
  fuel_capacity_liters = 29671,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2987,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 52.5,
  engine_thrust_kn = 121.4,
  engine_manufacturer = 'CFM International',
  total_orders = 505,
  total_delivered = 505,
  list_price_usd = 112400000,
  family_slug = 'boeing-737-ng',
  variant_order = 3
WHERE slug = 'boeing-737-900er';

-- Airbus A320neo (A320neo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 79000,
  fuel_capacity_liters = 26730,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2100,
  landing_distance_m = 1500,
  cargo_capacity_m3 = 37.4,
  engine_thrust_kn = 120.1,
  engine_manufacturer = 'CFM International / Pratt & Whitney',
  total_orders = 4274,
  total_delivered = 2150,
  list_price_usd = 110600000,
  family_slug = 'airbus-a320neo-family',
  variant_order = 2
WHERE slug = 'airbus-a320neo';

-- Airbus A321neo (A320neo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 97000,
  fuel_capacity_liters = 23750,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2400,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 51.7,
  engine_thrust_kn = 142.3,
  engine_manufacturer = 'CFM International / Pratt & Whitney',
  total_orders = 5120,
  total_delivered = 1850,
  list_price_usd = 129500000,
  family_slug = 'airbus-a320neo-family',
  variant_order = 4
WHERE slug = 'airbus-a321neo';

-- Boeing 787-8 Dreamliner (Boeing 787 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 227930,
  fuel_capacity_liters = 126917,
  service_ceiling_m = 13106,
  takeoff_distance_m = 2600,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 131.0,
  engine_thrust_kn = 280.0,
  engine_manufacturer = 'General Electric / Rolls-Royce',
  total_orders = 437,
  total_delivered = 399,
  list_price_usd = 248300000,
  family_slug = 'boeing-787',
  variant_order = 1
WHERE slug = 'boeing-787-8';

-- Boeing 787-9 Dreamliner (Boeing 787 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 254692,
  fuel_capacity_liters = 126917,
  service_ceiling_m = 13137,
  takeoff_distance_m = 2800,
  landing_distance_m = 1524,
  cargo_capacity_m3 = 150.0,
  engine_thrust_kn = 320.0,
  engine_manufacturer = 'General Electric / Rolls-Royce',
  total_orders = 1002,
  total_delivered = 681,
  list_price_usd = 292500000,
  family_slug = 'boeing-787',
  variant_order = 2
WHERE slug = 'boeing-787-9';

-- Boeing 777-300ER (Boeing 777 Classic Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 351534,
  fuel_capacity_liters = 181283,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3200,
  landing_distance_m = 1900,
  cargo_capacity_m3 = 210.0,
  engine_thrust_kn = 513.0,
  engine_manufacturer = 'General Electric',
  total_orders = 833,
  total_delivered = 833,
  list_price_usd = 375500000,
  family_slug = 'boeing-777-classic',
  variant_order = 5
WHERE slug = 'boeing-777-300er';

-- ============================================
-- TIER 2: ADDITIONAL BOEING AIRCRAFT
-- ============================================

-- Boeing 737-700 (Boeing 737 NG Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 70080,
  fuel_capacity_liters = 26020,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1750,
  landing_distance_m = 1500,
  cargo_capacity_m3 = 38.9,
  engine_thrust_kn = 101.0,
  engine_manufacturer = 'CFM International',
  total_orders = 1128,
  total_delivered = 1128,
  list_price_usd = 89100000,
  family_slug = 'boeing-737-ng',
  variant_order = 1
WHERE slug = 'boeing-737-700';

-- Boeing 737 MAX 7 (Boeing 737 MAX Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 80286,
  fuel_capacity_liters = 25816,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2000,
  landing_distance_m = 1500,
  cargo_capacity_m3 = 38.9,
  engine_thrust_kn = 130.3,
  engine_manufacturer = 'CFM International',
  total_orders = 300,
  total_delivered = 0,
  list_price_usd = 99700000,
  family_slug = 'boeing-737-max',
  variant_order = 1
WHERE slug = 'boeing-737-max-7';

-- Boeing 737 MAX 9 (Boeing 737 MAX Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 88314,
  fuel_capacity_liters = 25816,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2500,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 52.5,
  engine_thrust_kn = 130.3,
  engine_manufacturer = 'CFM International',
  total_orders = 628,
  total_delivered = 395,
  list_price_usd = 128900000,
  family_slug = 'boeing-737-max',
  variant_order = 3
WHERE slug = 'boeing-737-max-9';

-- Boeing 737 MAX 10 (Boeing 737 MAX Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 89765,
  fuel_capacity_liters = 25816,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2700,
  landing_distance_m = 1800,
  cargo_capacity_m3 = 56.5,
  engine_thrust_kn = 130.3,
  engine_manufacturer = 'CFM International',
  total_orders = 648,
  total_delivered = 0,
  list_price_usd = 135900000,
  family_slug = 'boeing-737-max',
  variant_order = 4
WHERE slug = 'boeing-737-max-10';

-- Boeing 757-200 (Boeing 757 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 115665,
  fuel_capacity_liters = 43489,
  service_ceiling_m = 12802,
  takeoff_distance_m = 2100,
  landing_distance_m = 1555,
  cargo_capacity_m3 = 50.7,
  engine_thrust_kn = 178.0,
  engine_manufacturer = 'Rolls-Royce / Pratt & Whitney',
  total_orders = 913,
  total_delivered = 913,
  list_price_usd = 80000000,
  family_slug = 'boeing-757',
  variant_order = 1
WHERE slug = 'boeing-757-200';

-- Boeing 757-300 (Boeing 757 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 123600,
  fuel_capacity_liters = 43489,
  service_ceiling_m = 12802,
  takeoff_distance_m = 2400,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 57.0,
  engine_thrust_kn = 193.5,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 55,
  total_delivered = 55,
  list_price_usd = 85000000,
  family_slug = 'boeing-757',
  variant_order = 2
WHERE slug = 'boeing-757-300';

-- Boeing 767-300ER (Boeing 767 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 187000,
  fuel_capacity_liters = 90774,
  service_ceiling_m = 13137,
  takeoff_distance_m = 2700,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 138.0,
  engine_thrust_kn = 266.9,
  engine_manufacturer = 'General Electric / Pratt & Whitney',
  total_orders = 583,
  total_delivered = 583,
  list_price_usd = 216200000,
  family_slug = 'boeing-767',
  variant_order = 2
WHERE slug = 'boeing-767-300er';

-- Boeing 767-400ER (Boeing 767 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 204120,
  fuel_capacity_liters = 91370,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3000,
  landing_distance_m = 1800,
  cargo_capacity_m3 = 175.0,
  engine_thrust_kn = 282.5,
  engine_manufacturer = 'General Electric',
  total_orders = 38,
  total_delivered = 38,
  list_price_usd = 225000000,
  family_slug = 'boeing-767',
  variant_order = 3
WHERE slug = 'boeing-767-400er';

-- Boeing 777-200ER (Boeing 777 Classic Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 286897,
  fuel_capacity_liters = 171160,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3000,
  landing_distance_m = 1800,
  cargo_capacity_m3 = 175.0,
  engine_thrust_kn = 400.0,
  engine_manufacturer = 'General Electric / Pratt & Whitney / Rolls-Royce',
  total_orders = 422,
  total_delivered = 422,
  list_price_usd = 320200000,
  family_slug = 'boeing-777-classic',
  variant_order = 1
WHERE slug = 'boeing-777-200er';

-- Boeing 777-200LR (Boeing 777 Classic Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 347452,
  fuel_capacity_liters = 195285,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3200,
  landing_distance_m = 1800,
  cargo_capacity_m3 = 175.0,
  engine_thrust_kn = 489.3,
  engine_manufacturer = 'General Electric',
  total_orders = 61,
  total_delivered = 61,
  list_price_usd = 346900000,
  family_slug = 'boeing-777-classic',
  variant_order = 2
WHERE slug = 'boeing-777-200lr';

-- Boeing 777-8 (Boeing 777X Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 351000,
  fuel_capacity_liters = 197000,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3100,
  landing_distance_m = 1800,
  cargo_capacity_m3 = 220.0,
  engine_thrust_kn = 470.0,
  engine_manufacturer = 'General Electric',
  total_orders = 43,
  total_delivered = 0,
  list_price_usd = 410200000,
  family_slug = 'boeing-777x',
  variant_order = 1
WHERE slug = 'boeing-777-8';

-- Boeing 777-9 (Boeing 777X Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 352441,
  fuel_capacity_liters = 197000,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3200,
  landing_distance_m = 1900,
  cargo_capacity_m3 = 238.0,
  engine_thrust_kn = 470.0,
  engine_manufacturer = 'General Electric',
  total_orders = 350,
  total_delivered = 0,
  list_price_usd = 442200000,
  family_slug = 'boeing-777x',
  variant_order = 2
WHERE slug = 'boeing-777-9';

-- Boeing 787-10 Dreamliner (Boeing 787 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 254011,
  fuel_capacity_liters = 126917,
  service_ceiling_m = 13137,
  takeoff_distance_m = 2800,
  landing_distance_m = 1600,
  cargo_capacity_m3 = 175.0,
  engine_thrust_kn = 340.0,
  engine_manufacturer = 'General Electric / Rolls-Royce',
  total_orders = 204,
  total_delivered = 126,
  list_price_usd = 338400000,
  family_slug = 'boeing-787',
  variant_order = 3
WHERE slug = 'boeing-787-10';

-- Boeing 747-400 (Boeing 747 Classic Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 412775,
  fuel_capacity_liters = 216840,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3300,
  landing_distance_m = 2100,
  cargo_capacity_m3 = 175.0,
  engine_thrust_kn = 282.0,
  engine_manufacturer = 'General Electric / Pratt & Whitney / Rolls-Royce',
  total_orders = 694,
  total_delivered = 694,
  list_price_usd = 260000000,
  family_slug = 'boeing-747-classic',
  variant_order = 1
WHERE slug = 'boeing-747-400';

-- Boeing 747-8 Intercontinental (Boeing 747-8 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 442253,
  fuel_capacity_liters = 243120,
  service_ceiling_m = 13137,
  takeoff_distance_m = 3100,
  landing_distance_m = 2000,
  cargo_capacity_m3 = 161.5,
  engine_thrust_kn = 296.0,
  engine_manufacturer = 'General Electric',
  total_orders = 48,
  total_delivered = 48,
  list_price_usd = 418400000,
  family_slug = 'boeing-747-8',
  variant_order = 1
WHERE slug = 'boeing-747-8i';

-- Boeing 717 (Boeing 717 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 54884,
  fuel_capacity_liters = 13890,
  service_ceiling_m = 11277,
  takeoff_distance_m = 1900,
  landing_distance_m = 1350,
  cargo_capacity_m3 = 27.2,
  engine_thrust_kn = 82.3,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 156,
  total_delivered = 156,
  list_price_usd = 50000000,
  family_slug = 'boeing-717',
  variant_order = 1
WHERE slug = 'boeing-717';

-- ============================================
-- TIER 2: AIRBUS AIRCRAFT
-- ============================================

-- Airbus A318 (A320ceo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 68000,
  fuel_capacity_liters = 23860,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1400,
  landing_distance_m = 1350,
  cargo_capacity_m3 = 21.2,
  engine_thrust_kn = 106.8,
  engine_manufacturer = 'CFM International / Pratt & Whitney',
  total_orders = 80,
  total_delivered = 80,
  list_price_usd = 77400000,
  family_slug = 'airbus-a320ceo-family',
  variant_order = 1
WHERE slug = 'airbus-a318';

-- Airbus A319 (A320ceo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 75500,
  fuel_capacity_liters = 30190,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1850,
  landing_distance_m = 1470,
  cargo_capacity_m3 = 27.6,
  engine_thrust_kn = 111.2,
  engine_manufacturer = 'CFM International / International Aero Engines',
  total_orders = 1478,
  total_delivered = 1478,
  list_price_usd = 92300000,
  family_slug = 'airbus-a320ceo-family',
  variant_order = 2
WHERE slug = 'airbus-a319';

-- Airbus A319neo (A320neo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 75500,
  fuel_capacity_liters = 30190,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1750,
  landing_distance_m = 1400,
  cargo_capacity_m3 = 27.6,
  engine_thrust_kn = 111.2,
  engine_manufacturer = 'CFM International / Pratt & Whitney',
  total_orders = 62,
  total_delivered = 45,
  list_price_usd = 101500000,
  family_slug = 'airbus-a320neo-family',
  variant_order = 1
WHERE slug = 'airbus-a319neo';

-- Airbus A320 (A320ceo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 78000,
  fuel_capacity_liters = 27200,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2000,
  landing_distance_m = 1500,
  cargo_capacity_m3 = 37.4,
  engine_thrust_kn = 120.1,
  engine_manufacturer = 'CFM International / International Aero Engines',
  total_orders = 4845,
  total_delivered = 4845,
  list_price_usd = 101000000,
  family_slug = 'airbus-a320ceo-family',
  variant_order = 3
WHERE slug = 'airbus-a320';

-- Airbus A321 (A320ceo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 93500,
  fuel_capacity_liters = 23700,
  service_ceiling_m = 12497,
  takeoff_distance_m = 2200,
  landing_distance_m = 1600,
  cargo_capacity_m3 = 51.7,
  engine_thrust_kn = 142.3,
  engine_manufacturer = 'CFM International / International Aero Engines',
  total_orders = 2067,
  total_delivered = 2067,
  list_price_usd = 118300000,
  family_slug = 'airbus-a320ceo-family',
  variant_order = 4
WHERE slug = 'airbus-a321';

-- Airbus A220-100 (A220 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 60781,
  fuel_capacity_liters = 21805,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1463,
  landing_distance_m = 1356,
  cargo_capacity_m3 = 21.0,
  engine_thrust_kn = 103.6,
  engine_manufacturer = 'Pratt & Whitney',
  total_orders = 125,
  total_delivered = 95,
  list_price_usd = 81000000,
  family_slug = 'airbus-a220',
  variant_order = 1
WHERE slug = 'airbus-a220-100';

-- Airbus A220-300 (A220 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 69900,
  fuel_capacity_liters = 21805,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1890,
  landing_distance_m = 1356,
  cargo_capacity_m3 = 31.5,
  engine_thrust_kn = 103.6,
  engine_manufacturer = 'Pratt & Whitney',
  total_orders = 785,
  total_delivered = 400,
  list_price_usd = 91500000,
  family_slug = 'airbus-a220',
  variant_order = 2
WHERE slug = 'airbus-a220-300';

-- Airbus A330-200 (A330ceo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 242000,
  fuel_capacity_liters = 139090,
  service_ceiling_m = 12527,
  takeoff_distance_m = 2700,
  landing_distance_m = 1750,
  cargo_capacity_m3 = 136.0,
  engine_thrust_kn = 303.0,
  engine_manufacturer = 'General Electric / Pratt & Whitney / Rolls-Royce',
  total_orders = 656,
  total_delivered = 656,
  list_price_usd = 238500000,
  family_slug = 'airbus-a330ceo',
  variant_order = 1
WHERE slug = 'airbus-a330-200';

-- Airbus A330-300 (A330ceo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 242000,
  fuel_capacity_liters = 139090,
  service_ceiling_m = 12527,
  takeoff_distance_m = 2900,
  landing_distance_m = 1850,
  cargo_capacity_m3 = 162.8,
  engine_thrust_kn = 303.0,
  engine_manufacturer = 'General Electric / Pratt & Whitney / Rolls-Royce',
  total_orders = 775,
  total_delivered = 775,
  list_price_usd = 264200000,
  family_slug = 'airbus-a330ceo',
  variant_order = 2
WHERE slug = 'airbus-a330-300';

-- Airbus A330-800neo (A330neo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 251000,
  fuel_capacity_liters = 139090,
  service_ceiling_m = 12527,
  takeoff_distance_m = 2600,
  landing_distance_m = 1700,
  cargo_capacity_m3 = 136.0,
  engine_thrust_kn = 303.0,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 13,
  total_delivered = 8,
  list_price_usd = 259900000,
  family_slug = 'airbus-a330neo',
  variant_order = 1
WHERE slug = 'airbus-a330-800neo';

-- Airbus A330-900neo (A330neo Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 251000,
  fuel_capacity_liters = 139090,
  service_ceiling_m = 12527,
  takeoff_distance_m = 2800,
  landing_distance_m = 1800,
  cargo_capacity_m3 = 162.8,
  engine_thrust_kn = 303.0,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 345,
  total_delivered = 210,
  list_price_usd = 296400000,
  family_slug = 'airbus-a330neo',
  variant_order = 2
WHERE slug = 'airbus-a330-900neo';

-- Airbus A340-300 (A340 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 275000,
  fuel_capacity_liters = 155040,
  service_ceiling_m = 12497,
  takeoff_distance_m = 3000,
  landing_distance_m = 1926,
  cargo_capacity_m3 = 162.8,
  engine_thrust_kn = 151.0,
  engine_manufacturer = 'CFM International',
  total_orders = 218,
  total_delivered = 218,
  list_price_usd = 238000000,
  family_slug = 'airbus-a340',
  variant_order = 1
WHERE slug = 'airbus-a340-300';

-- Airbus A340-500 (A340 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 372000,
  fuel_capacity_liters = 222000,
  service_ceiling_m = 12497,
  takeoff_distance_m = 3350,
  landing_distance_m = 2100,
  cargo_capacity_m3 = 153.0,
  engine_thrust_kn = 240.0,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 34,
  total_delivered = 34,
  list_price_usd = 270000000,
  family_slug = 'airbus-a340',
  variant_order = 2
WHERE slug = 'airbus-a340-500';

-- Airbus A340-600 (A340 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 380000,
  fuel_capacity_liters = 195620,
  service_ceiling_m = 12497,
  takeoff_distance_m = 3400,
  landing_distance_m = 2200,
  cargo_capacity_m3 = 180.0,
  engine_thrust_kn = 249.0,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 97,
  total_delivered = 97,
  list_price_usd = 295000000,
  family_slug = 'airbus-a340',
  variant_order = 3
WHERE slug = 'airbus-a340-600';

-- Airbus A350-900 (A350 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 283000,
  fuel_capacity_liters = 140795,
  service_ceiling_m = 13137,
  takeoff_distance_m = 2600,
  landing_distance_m = 1900,
  cargo_capacity_m3 = 172.4,
  engine_thrust_kn = 374.5,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 770,
  total_delivered = 560,
  list_price_usd = 317400000,
  family_slug = 'airbus-a350',
  variant_order = 1
WHERE slug = 'airbus-a350-900';

-- Airbus A350-1000 (A350 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 316000,
  fuel_capacity_liters = 158791,
  service_ceiling_m = 13137,
  takeoff_distance_m = 2800,
  landing_distance_m = 2000,
  cargo_capacity_m3 = 192.0,
  engine_thrust_kn = 430.0,
  engine_manufacturer = 'Rolls-Royce',
  total_orders = 289,
  total_delivered = 185,
  list_price_usd = 366500000,
  family_slug = 'airbus-a350',
  variant_order = 2
WHERE slug = 'airbus-a350-1000';

-- Airbus A380 (A380 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 575000,
  fuel_capacity_liters = 320000,
  service_ceiling_m = 13137,
  takeoff_distance_m = 2900,
  landing_distance_m = 2100,
  cargo_capacity_m3 = 175.0,
  engine_thrust_kn = 374.0,
  engine_manufacturer = 'Rolls-Royce / Engine Alliance',
  total_orders = 251,
  total_delivered = 251,
  list_price_usd = 445600000,
  family_slug = 'airbus-a380',
  variant_order = 1
WHERE slug = 'airbus-a380';

-- ============================================
-- TIER 3: REGIONAL AIRCRAFT
-- ============================================

-- Embraer E175 (E-Jet E1 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 40370,
  fuel_capacity_liters = 11635,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1260,
  landing_distance_m = 1259,
  cargo_capacity_m3 = 19.0,
  engine_thrust_kn = 64.5,
  engine_manufacturer = 'General Electric',
  total_orders = 850,
  total_delivered = 730,
  list_price_usd = 50200000,
  family_slug = 'embraer-e-jet-e1',
  variant_order = 2
WHERE slug = 'embraer-e175';

-- Embraer E190 (E-Jet E1 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 51800,
  fuel_capacity_liters = 12971,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1650,
  landing_distance_m = 1320,
  cargo_capacity_m3 = 21.0,
  engine_thrust_kn = 82.3,
  engine_manufacturer = 'General Electric',
  total_orders = 576,
  total_delivered = 576,
  list_price_usd = 50600000,
  family_slug = 'embraer-e-jet-e1',
  variant_order = 3
WHERE slug = 'embraer-e190';

-- Embraer E190-E2 (E-Jet E2 Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 56400,
  fuel_capacity_liters = 13389,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1680,
  landing_distance_m = 1340,
  cargo_capacity_m3 = 21.0,
  engine_thrust_kn = 95.0,
  engine_manufacturer = 'Pratt & Whitney',
  total_orders = 85,
  total_delivered = 60,
  list_price_usd = 59100000,
  family_slug = 'embraer-e-jet-e2',
  variant_order = 1
WHERE slug = 'embraer-e190-e2';

-- Bombardier CRJ-900 (CRJ Family)
UPDATE aircraft SET
  max_takeoff_weight_kg = 38330,
  fuel_capacity_liters = 8870,
  service_ceiling_m = 12497,
  takeoff_distance_m = 1850,
  landing_distance_m = 1620,
  cargo_capacity_m3 = 14.5,
  engine_thrust_kn = 60.0,
  engine_manufacturer = 'General Electric',
  total_orders = 405,
  total_delivered = 405,
  list_price_usd = 44000000,
  family_slug = 'bombardier-crj',
  variant_order = 3
WHERE slug = 'bombardier-crj-900';
