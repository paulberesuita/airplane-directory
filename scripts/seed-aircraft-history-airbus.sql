-- Aircraft history for Airbus aircraft (excluding A380 and A320neo which already have history)
-- Researched: 2026-01-20

-- Airbus A318 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a318', 'development', 1999, 'Program Launch', 'Airbus launched the A318 as the smallest member of the A320 family, initially called the A319M3 before receiving its own designation.', 'https://en.wikipedia.org/wiki/Airbus_A318', 'Wikipedia'),
('airbus-a318', 'milestone', 2002, 'First Flight', 'The A318 completed its maiden flight on January 15, 2002, from Hamburg-Finkenwerder, the shortest member of the A320 family at just 31.4 meters.', 'https://en.wikipedia.org/wiki/Airbus_A318', 'Wikipedia'),
('airbus-a318', 'milestone', 2003, 'Entry into Service', 'Frontier Airlines became the first operator of the A318 in July 2003, though the type would find limited commercial success with only 79 built.', 'https://en.wikipedia.org/wiki/Airbus_A318', 'Wikipedia'),
('airbus-a318', 'story', NULL, 'London City to New York', 'British Airways operated A318s on a unique all-business service from Londons City Airport to New York JFK, the only transatlantic route from the short-runway downtown airport, requiring special steep-approach pilot certification.', 'https://en.wikipedia.org/wiki/Airbus_A318', 'Wikipedia'),
('airbus-a318', 'fact', NULL, 'Baby Bus Nickname', 'Aviation enthusiasts nicknamed the A318 the Baby Bus due to its position as the smallest Airbus, though it still offered the same wide cabin as its larger siblings.', 'https://en.wikipedia.org/wiki/Airbus_A318', 'Wikipedia');

-- Airbus A319 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a319', 'development', 1993, 'Program Launch', 'Airbus launched the A319 as a shortened version of the A320 to compete with the Boeing 737-300 and 737-700 in the 120-140 seat market.', 'https://en.wikipedia.org/wiki/Airbus_A319', 'Wikipedia'),
('airbus-a319', 'milestone', 1995, 'First Flight', 'The A319 completed its first flight on August 25, 1995, demonstrating how Airbus could efficiently stretch and shrink the A320 design.', 'https://en.wikipedia.org/wiki/Airbus_A319', 'Wikipedia'),
('airbus-a319', 'milestone', 1996, 'Entry into Service', 'Swissair became the first airline to operate the A319 in April 1996, beginning a successful commercial career with over 1,480 delivered.', 'https://en.wikipedia.org/wiki/Airbus_A319', 'Wikipedia'),
('airbus-a319', 'fact', NULL, 'Best Range-to-Size Ratio', 'The A319 offers the best range-to-size ratio in the A320 family at 6,850 km, making it ideal for long thin routes that larger aircraft cannot serve profitably.', 'https://en.wikipedia.org/wiki/Airbus_A319', 'Wikipedia'),
('airbus-a319', 'story', NULL, 'Corporate Jet', 'The A319 became popular as the Airbus Corporate Jet (ACJ), offering intercontinental range with a spacious cabin that corporations and governments customized for VIP travel.', 'https://en.wikipedia.org/wiki/Airbus_A319', 'Wikipedia');

-- Airbus A319neo History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a319neo', 'development', 2010, 'NEO Program Launch', 'Airbus announced the A320neo family including the A319neo in December 2010, promising 15% fuel efficiency improvement through new engines and sharklet wingtips.', 'https://en.wikipedia.org/wiki/Airbus_A320neo_family', 'Wikipedia'),
('airbus-a319neo', 'milestone', 2017, 'First Flight', 'The A319neo completed its first flight on March 31, 2017, the last of the three main A320neo variants to fly.', 'https://en.wikipedia.org/wiki/Airbus_A320neo_family', 'Wikipedia'),
('airbus-a319neo', 'fact', NULL, 'Limited Orders', 'The A319neo has attracted fewer orders than its larger siblings, as airlines have generally preferred the greater capacity of the A320neo and A321neo for improved economics.', 'https://en.wikipedia.org/wiki/Airbus_A320neo_family', 'Wikipedia'),
('airbus-a319neo', 'story', NULL, 'Spirit Airlines Launch', 'Spirit Airlines became the launch customer for the A319neo, though the ultra-low-cost carrier later shifted its focus to larger A320neo family members.', 'https://en.wikipedia.org/wiki/Airbus_A320neo_family', 'Wikipedia');

-- Airbus A320 (ceo) History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a320', 'development', 1984, 'Program Launch', 'Airbus launched the A320 program in March 1984 with Air France as the launch customer, setting out to create the worlds first fly-by-wire airliner.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia'),
('airbus-a320', 'milestone', 1987, 'First Flight', 'The A320 made aviation history on February 22, 1987, as the first commercial aircraft with digital fly-by-wire flight controls.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia'),
('airbus-a320', 'milestone', 1988, 'Entry into Service', 'Air France introduced the A320 on March 28, 1988, on the Paris-Berlin route, beginning the transformation of commercial aviation.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia'),
('airbus-a320', 'fact', NULL, 'Fly-By-Wire Pioneer', 'The A320 pioneered digital fly-by-wire controls in commercial aviation, using computers to interpret pilot inputs. This technology is now standard across all modern airliners.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia'),
('airbus-a320', 'fact', NULL, 'Side-Stick Controllers', 'The A320 introduced side-stick controllers instead of traditional yokes, giving pilots more space and visibility while enabling fly-by-wire control.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia'),
('airbus-a320', 'story', NULL, 'Common Type Rating', 'Airbus designed the A320 family with a common type rating, meaning pilots trained on any A320 family member can fly all variants with minimal additional training.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia'),
('airbus-a320', 'legacy', NULL, 'Best-Selling Aircraft Family', 'The A320 family became the best-selling single-aisle aircraft family in history, with over 10,000 orders demonstrating its commercial success.', 'https://en.wikipedia.org/wiki/Airbus_A320_family', 'Wikipedia');

-- Airbus A321 (ceo) History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a321', 'development', 1989, 'Program Launch', 'Airbus launched the A321 as a stretched version of the A320 to compete with the Boeing 757 in the 180-220 seat market.', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia'),
('airbus-a321', 'milestone', 1993, 'First Flight', 'The A321 completed its maiden flight on March 11, 1993, demonstrating the flexibility of the A320 platform for stretching.', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia'),
('airbus-a321', 'milestone', 1994, 'Entry into Service', 'Lufthansa became the first A321 operator in January 1994, using it on high-density European routes.', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia'),
('airbus-a321', 'fact', NULL, 'Double Overwing Exits', 'The A321s stretched fuselage required adding two additional overwing emergency exits compared to the A320, bringing the total to four pairs.', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia'),
('airbus-a321', 'story', NULL, 'American Airlines Fleet', 'American Airlines operates the worlds largest A321 fleet with over 300 aircraft, using it as the backbone of its domestic operations.', 'https://en.wikipedia.org/wiki/Airbus_A321', 'Wikipedia');

-- Airbus A321neo History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a321neo', 'development', 2010, 'NEO Program Launch', 'The A321neo was launched as part of the A320neo family, offering the largest capacity with the same 15-20% efficiency improvement over previous generation.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia'),
('airbus-a321neo', 'milestone', 2016, 'First Flight', 'The A321neo completed its maiden flight on February 9, 2016, showcasing its new Pratt & Whitney or CFM LEAP engine options.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia'),
('airbus-a321neo', 'milestone', 2017, 'Entry into Service', 'Virgin America (later Alaska Airlines) became the first A321neo operator in April 2017, beginning the types rapid commercial success.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia'),
('airbus-a321neo', 'fact', NULL, 'A321LR Long Range', 'The A321LR (Long Range) variant with additional fuel tanks can fly up to 7,400 km, enabling single-aisle transatlantic flights.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia'),
('airbus-a321neo', 'fact', NULL, 'A321XLR Extra Long Range', 'The A321XLR pushes range to 8,700 km, enough to connect the US East Coast with Western Europe, revolutionizing narrow-body long-haul travel.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia'),
('airbus-a321neo', 'story', NULL, 'Narrowbody Revolution', 'The A321neo family has revolutionized long-haul travel by enabling airlines to profitably serve thinner routes with lower-capacity single-aisle aircraft.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia'),
('airbus-a321neo', 'record', NULL, 'Most Popular Neo', 'The A321neo has outsold all other A320neo family variants combined in recent years, as airlines seek maximum capacity with neo efficiency.', 'https://en.wikipedia.org/wiki/Airbus_A321neo', 'Wikipedia');

-- Airbus A220-100 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a220-100', 'development', 2004, 'Bombardier CSeries Origins', 'The aircraft began life as the Bombardier CSeries CS100, conceived in 2004 to fill the 100-130 seat market gap left by aging DC-9s and 737-200s.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'milestone', 2008, 'Program Launch', 'Bombardier formally launched the CSeries program at the 2008 Farnborough Air Show, promising 20% better fuel efficiency than existing aircraft in its class.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'milestone', 2013, 'First Flight as CS100', 'The CS100 completed its maiden flight on September 16, 2013, from Mirabel, Quebec, beginning an intensive flight test program.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'milestone', 2016, 'Entry into Service', 'Swiss Global Air Lines became the first CS100 operator on July 15, 2016, reporting better-than-expected fuel burn and passenger feedback.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'incident', 2017, 'Boeing Trade Dispute', 'Boeing filed a trade complaint against Bombardier for allegedly selling CS100s to Delta below cost. The dispute threatened to impose 300% tariffs before being rejected by the US International Trade Commission.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'milestone', 2018, 'Airbus Acquisition and Rebranding', 'Airbus acquired majority control of the CSeries program in July 2018, rebranding the CS100 as the A220-100 and adding it to the Airbus product line.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'fact', NULL, 'Widest Cabin in Class', 'The A220-100 offers the widest cabin in its class at 3.28 meters, allowing 2-3 seating with more space than competing narrow-bodies.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-100', 'story', NULL, 'Clean Sheet Design', 'Unlike derivative aircraft, the A220 was designed from scratch without legacy constraints, resulting in the most efficient aircraft in its class with 25% lower fuel burn.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia');

-- Airbus A220-300 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a220-300', 'development', 2008, 'Launch as CS300', 'The CS300 (now A220-300) was launched alongside the CS100 as the larger variant, stretched to seat 130-160 passengers while maintaining the same efficiency.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-300', 'milestone', 2015, 'First Flight', 'The CS300 completed its maiden flight on February 27, 2015, from Mirabel, demonstrating the stretched fuselage configuration.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-300', 'milestone', 2016, 'Entry into Service', 'airBaltic became the first CS300 operator on December 14, 2016, quickly becoming the types most enthusiastic advocate.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-300', 'milestone', 2018, 'Rebranded as A220-300', 'Following Airbus acquisition, the CS300 became the A220-300, gaining access to Airbuss global sales, service, and support network.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-300', 'fact', NULL, 'Pratt & Whitney Geared Turbofan', 'The A220-300 is powered by Pratt & Whitney PW1500G geared turbofan engines, which use a gear system to optimize fan and turbine speeds for maximum efficiency.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-300', 'story', NULL, 'Delta Airlines Champion', 'Delta Air Lines became the largest A220 operator with orders for 145 aircraft, championing the type for efficient service on thinner routes.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia'),
('airbus-a220-300', 'legacy', NULL, 'New Market Standard', 'The A220-300 has set a new standard for the 130-160 seat market, forcing competitors to develop new designs to match its efficiency and passenger experience.', 'https://en.wikipedia.org/wiki/Airbus_A220', 'Wikipedia');

-- Airbus A330-200 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a330-200', 'development', 1995, 'Program Launch', 'Airbus launched the A330-200 as a shorter-fuselage, longer-range version of the A330-300 to compete with the Boeing 767-300ER on thinner long-haul routes.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-200', 'milestone', 1997, 'First Flight', 'The A330-200 completed its maiden flight on August 13, 1997, demonstrating its extended range capability with additional fuel tanks.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-200', 'milestone', 1998, 'Entry into Service', 'Canada 3000 became the first A330-200 operator in 1998, using it for transatlantic charter operations from Canada.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-200', 'fact', NULL, 'Longest A330 Range', 'The A330-200 offers the longest range of the original A330 family at 13,450 km, enabling true intercontinental operations.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-200', 'story', NULL, 'MRTT Military Variant', 'The A330 Multi Role Tanker Transport (MRTT) based on the A330-200 became one of the worlds most successful aerial refueling aircraft.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia');

-- Airbus A330-300 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a330-300', 'development', 1987, 'Program Launch', 'The A330 was launched alongside the A340 in June 1987, sharing the same wing and fuselage but with two engines instead of four.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-300', 'milestone', 1992, 'First Flight', 'The A330-300 completed its maiden flight on November 2, 1992, from Toulouse, beginning certification testing.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-300', 'milestone', 1994, 'Entry into Service', 'Air Inter became the first A330-300 operator in January 1994, using it on domestic French routes before international expansion.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-300', 'fact', NULL, 'Twin Development', 'The A330 and A340 were developed simultaneously with the same wing and fuselage, one of aviations most successful parallel development programs.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-300', 'record', 2020, 'Milestone Delivery', 'In September 2020, the A330 reached 1,500 deliveries, becoming Airbuss first twin-aisle aircraft to achieve this milestone.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-300', 'story', NULL, 'Delta Fleet Backbone', 'Delta Air Lines operates the largest A330 fleet with over 80 aircraft, using it as the backbone of its international widebody operations.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia'),
('airbus-a330-300', 'legacy', NULL, 'Second Most Delivered Widebody', 'The A330 family became the second most delivered widebody aircraft after the Boeing 777, proving the viability of efficient twin-aisle twins.', 'https://en.wikipedia.org/wiki/Airbus_A330', 'Wikipedia');

-- Airbus A330-800neo History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a330-800neo', 'development', 2014, 'Program Launch', 'Airbus launched the A330neo family in July 2014, featuring new Rolls-Royce Trent 7000 engines and aerodynamic improvements for 25% better efficiency.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-800neo', 'milestone', 2018, 'First Flight', 'The A330-800neo completed its maiden flight on November 6, 2018, from Toulouse, the shorter variant of the neo family.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-800neo', 'milestone', 2020, 'Entry into Service', 'Kuwait Airways became the first A330-800neo operator in October 2020, though the type has attracted fewer orders than its larger sibling.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-800neo', 'fact', NULL, 'Longest A330 Range', 'The A330-800neo offers the longest range of any A330 variant at 15,000 km (8,100nm), surpassing even the A330-200.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-800neo', 'story', NULL, 'Limited Market Appeal', 'The A330-800neo has attracted fewer orders than the -900 as airlines prefer larger capacity, making it one of Airbuss rarest current-production widebodies.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia');

-- Airbus A330-900neo History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a330-900neo', 'development', 2014, 'Program Launch', 'The A330-900neo was launched as the larger variant of the A330neo family, offering more capacity with modern efficiency.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-900neo', 'milestone', 2017, 'First Flight', 'The A330-900neo completed its maiden flight on October 19, 2017, showcasing its new Trent 7000 engines and sharklet wingtips.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-900neo', 'milestone', 2018, 'Entry into Service', 'TAP Air Portugal became the first A330-900neo operator in December 2018, using it on routes from Lisbon to the Americas.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-900neo', 'fact', NULL, 'Exclusive Engine', 'The Trent 7000 was developed exclusively for the A330neo and has double the bypass ratio of its predecessor, significantly reducing noise and fuel consumption.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-900neo', 'fact', NULL, '242-Tonne MTOW', 'The A330-900neo can be delivered with maximum takeoff weight up to 242 tonnes, enabling truly long-range operations with full payload.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia'),
('airbus-a330-900neo', 'story', NULL, 'Proven Platform Updated', 'The A330neo combines the proven reliability of the A330 with modern engines and aerodynamics, offering lower risk than all-new designs.', 'https://en.wikipedia.org/wiki/Airbus_A330neo', 'Wikipedia');

-- Airbus A340-300 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a340-300', 'development', 1987, 'Program Launch', 'The A340 was launched alongside the A330 in June 1987, with four engines to bypass ETOPS restrictions that limited twin-engine overwater operations.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-300', 'milestone', 1991, 'First Flight', 'The A340-300 completed its maiden flight on October 25, 1991, from Toulouse, becoming the first A340 variant to fly.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-300', 'milestone', 1993, 'Entry into Service', 'Air France and Lufthansa simultaneously became the first A340 operators in March 1993, using it on long-haul intercontinental routes.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-300', 'record', 1993, 'Non-Stop Distance Record', 'In 1993, a modified A340-200 flew non-stop from Paris to Auckland covering 10,409 nautical miles in 24 hours and 11 minutes, setting a commercial aircraft distance record.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-300', 'fact', NULL, 'Four Engines Four Long Haul', 'Airbus marketed the A340 with the slogan 4 Engines 4 Long Haul, emphasizing passenger confidence in having four engines for overwater flights.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-300', 'story', NULL, 'ETOPS Made It Obsolete', 'As ETOPS regulations expanded twin-engine possibilities through the 1990s and 2000s, the A340s four-engine advantage became an economic disadvantage.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-300', 'legacy', NULL, 'End of an Era', 'The A340 represented the last generation of four-engine long-haul aircraft before efficient twins like the 777 and A350 made quad-jets economically unviable.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia');

-- Airbus A340-500 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a340-500', 'development', 1997, 'Program Launch', 'Airbus launched the A340-500 as an ultra-long-range variant to serve the worlds longest routes non-stop.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-500', 'milestone', 2002, 'First Flight', 'The A340-500 completed its maiden flight on February 11, 2002, the longer-range but shorter-fuselage variant of the -500/-600 generation.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-500', 'milestone', 2003, 'Entry into Service', 'Emirates became the first A340-500 operator in December 2003, later using it for record-breaking routes.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-500', 'record', 2004, 'Worlds Longest Flight', 'Singapore Airlines launched the worlds longest non-stop flight with the A340-500 from Singapore to Newark, covering over 15,000 km in approximately 18 hours.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-500', 'incident', 2013, 'Route Suspended', 'Singapore Airlines suspended the Singapore-Newark A340-500 route in 2013 due to high fuel costs, unable to make the ultra-long-haul operation profitable with four engines.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-500', 'fact', NULL, 'Trent 500 Engines', 'The A340-500 was powered by four Rolls-Royce Trent 553 engines specifically developed for the ultra-long-range -500 and -600 variants.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia');

-- Airbus A340-600 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a340-600', 'development', 1997, 'Program Launch', 'The A340-600 was launched alongside the -500 as the worlds longest airliner, stretching the fuselage to accommodate up to 380 passengers.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-600', 'milestone', 2001, 'First Flight', 'The A340-600 completed its maiden flight on April 23, 2001, from Toulouse, demonstrating its impressive 75.4-meter length.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-600', 'milestone', 2002, 'Entry into Service', 'Virgin Atlantic became the first A340-600 operator in August 2002, branding it as the Four Engine 4 Long Haul aircraft.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-600', 'fact', NULL, 'Former Longest Airliner', 'At 75.4 meters, the A340-600 held the record for worlds longest airliner until the Boeing 747-8 Intercontinental surpassed it in 2010.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-600', 'story', NULL, 'Lufthansa Flagship', 'Lufthansa operated a large A340-600 fleet as its flagship long-haul aircraft before transitioning to more fuel-efficient twins.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia'),
('airbus-a340-600', 'milestone', 2011, 'End of Production', 'Airbus delivered the last A340 in November 2011 to Iberia, ending the four-engine widebody program with only 377 aircraft sold.', 'https://en.wikipedia.org/wiki/Airbus_A340', 'Wikipedia');

-- Airbus A350-900 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a350-900', 'development', 2006, 'XWB Redesign', 'After initial A350 designs were criticized as insufficient against the 787, Airbus announced the clean-sheet A350 XWB (Extra Wide Body) in July 2006.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'milestone', 2013, 'First Flight', 'The A350-900 completed its maiden flight on June 14, 2013, from Toulouse, beginning an intensive certification program.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'milestone', 2014, 'First Delivery', 'Qatar Airways received the first A350-900 on December 22, 2014, having been the launch customer for the type.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'milestone', 2015, 'Entry into Service', 'Qatar Airways operated the first commercial A350-900 flight on January 15, 2015, from Doha to Frankfurt.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'fact', NULL, '70% Advanced Materials', 'The A350 airframe uses over 70% advanced materials including carbon-fiber composites, titanium, and modern aluminum alloys for a lighter, more efficient aircraft.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'fact', NULL, 'Exclusive Rolls-Royce Partnership', 'The A350 is exclusively powered by Rolls-Royce Trent XWB engines, the worlds most efficient large aero-engine in service.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'story', NULL, 'Ultra Long Range Variant', 'The A350-900ULR variant with additional fuel tanks enables flights up to 18,000 km, used by Singapore Airlines for the worlds longest flight from Singapore to New York.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'record', 2019, 'Break-Even Achieved', 'Airbuss 2019 earnings report confirmed the A350 program had broken even, unlike the A380 which never recovered its development costs.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-900', 'legacy', NULL, 'Defining Modern Long-Haul', 'The A350-900 has become the benchmark for modern long-haul efficiency, with over 1,300 orders demonstrating its commercial success.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia');

-- Airbus A350-1000 History
INSERT INTO aircraft_history (aircraft_slug, content_type, year, title, content, source_url, source_name) VALUES
('airbus-a350-1000', 'development', 2006, 'Program Launch', 'The A350-1000 was launched as the largest A350 variant to compete directly with the Boeing 777-300ER in the high-capacity long-haul market.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-1000', 'milestone', 2016, 'First Flight', 'The A350-1000 completed its maiden flight on November 24, 2016, from Toulouse, stretched 7 meters longer than the -900.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-1000', 'milestone', 2018, 'Entry into Service', 'Qatar Airways became the first A350-1000 operator in February 2018, using it on premium routes where its capacity and range matched demand.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-1000', 'fact', NULL, 'Most Powerful Rolls-Royce Engine', 'The Trent XWB-97 engines on the A350-1000 produce 97,000 pounds of thrust each, making them the most powerful Rolls-Royce engines ever built for commercial aviation.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-1000', 'fact', NULL, 'Six-Wheel Main Landing Gear', 'The A350-1000 features six-wheel main landing gear bogies instead of four-wheel to handle its higher weight, a first for an Airbus widebody.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-1000', 'story', NULL, 'Cathay Pacific Fleet', 'Cathay Pacific operates a significant A350-1000 fleet, using it on demanding ultra-long-haul routes from Hong Kong to North America and Europe.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia'),
('airbus-a350-1000', 'milestone', 2021, 'Freighter Launch', 'Airbus launched the A350F freighter variant based on the A350-1000 fuselage in 2021, offering modern efficiency to the cargo market.', 'https://en.wikipedia.org/wiki/Airbus_A350', 'Wikipedia');
