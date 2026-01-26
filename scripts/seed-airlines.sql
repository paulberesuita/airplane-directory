-- Seed US Airlines
-- Created: 2026-01-25

INSERT OR REPLACE INTO airlines (slug, name, iata_code, icao_code, headquarters, founded, fleet_size, destinations, description, website) VALUES
('american-airlines', 'American Airlines', 'AA', 'AAL', 'Fort Worth, Texas', 1926, 1013, 350, 'The world''s largest airline by passengers carried and daily flights. A founding member of the Oneworld alliance, American operates an extensive international and domestic network with nearly 6,800 flights per day. The airline operates a mixed fleet of Airbus and Boeing narrow-body aircraft, and an all-Boeing wide-body fleet including 777s and 787 Dreamliners.', 'https://www.aa.com'),

('delta-air-lines', 'Delta Air Lines', 'DL', 'DAL', 'Atlanta, Georgia', 1924, 987, 275, 'One of the oldest airlines still in operation, Delta is the second-largest airline in the world by passengers carried. Headquartered at the world''s busiest airport (Hartsfield-Jackson Atlanta), Delta operates an all-Airbus wide-body fleet and holds records for operating the largest passenger subfleets of Airbus A220, Boeing 717, Boeing 757, Boeing 767, and Airbus A330 aircraft.', 'https://www.delta.com'),

('united-airlines', 'United Airlines', 'UA', 'UAL', 'Chicago, Illinois', 1926, 1058, 370, 'The world''s largest airline by fleet size, United operates more wide-body aircraft than any other North American passenger airline. Founded with ties to Boeing Aircraft Company, United connects more destinations worldwide than any other airline and is a founding member of the Star Alliance.', 'https://www.united.com'),

('southwest-airlines', 'Southwest Airlines', 'WN', 'SWA', 'Dallas, Texas', 1967, 810, 117, 'The world''s largest low-cost carrier and largest operator of the Boeing 737. Southwest pioneered the low-cost carrier model and carries more domestic passengers than any other US airline. Known for its no-frills approach, free checked bags, and legendary customer service. The airline operates an all-Boeing 737 fleet.', 'https://www.southwest.com'),

('jetblue-airways', 'JetBlue Airways', 'B6', 'JBU', 'Long Island City, New York', 1998, 270, 100, 'A major low-cost carrier known for pioneering live TV, extra legroom, and quality service at low fares. JetBlue operates primarily Airbus aircraft and is transitioning its regional fleet from Embraer E190s to the more efficient Airbus A220. The airline focuses on transatlantic expansion and premium Mint service.', 'https://www.jetblue.com'),

('alaska-airlines', 'Alaska Airlines', 'AS', 'ASA', 'SeaTac, Washington', 1932, 413, 140, 'The fifth-largest US airline, Alaska completed its acquisition of Hawaiian Airlines in 2024. Now operating as Alaska Air Group, the combined carrier offers extensive service to Hawaii, the West Coast, and international destinations. Alaska operates an all-Boeing mainline fleet including 737s and 787 Dreamliners acquired through the Hawaiian merger.', 'https://www.alaskaair.com'),

('spirit-airlines', 'Spirit Airlines', 'NK', 'NKS', 'Dania Beach, Florida', 1983, 214, 90, 'An ultra low-cost carrier known for unbundled fares and a la carte pricing. Spirit operates an all-Airbus A320 family fleet. Note: Spirit filed for Chapter 11 bankruptcy in August 2025 and is undergoing restructuring to restore profitability.', 'https://www.spirit.com'),

('frontier-airlines', 'Frontier Airlines', 'F9', 'FFT', 'Denver, Colorado', 1994, 150, 120, 'An ultra low-cost carrier operating the largest Airbus A320neo family fleet in the United States. Known for its animal-themed aircraft liveries, Frontier focuses on affordable travel with a la carte pricing. The airline is expanding with over 230 new Airbus aircraft on order.', 'https://www.flyfrontier.com');
