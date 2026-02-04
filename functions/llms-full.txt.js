// GET /llms-full.txt - Full content dump for LLMs

export async function onRequestGet(context) {
  const { env } = context;

  try {
    // Get all aircraft with full details
    const { results: aircraft } = await env.DB.prepare(`
      SELECT slug, name, manufacturer, description, first_flight, passengers,
             range_km, cruise_speed_kmh, length_m, wingspan_m, engines, status,
             fun_fact, safety_summary, source_url
      FROM aircraft
      ORDER BY manufacturer, name
    `).all();

    // Get all airlines with fleet info
    const { results: airlines } = await env.DB.prepare(`
      SELECT a.slug, a.name, a.iata_code, a.icao_code, a.headquarters,
             a.founded, a.fleet_size, a.destinations, a.description, a.website
      FROM airlines a
      ORDER BY a.name
    `).all();

    // Get airline fleet relationships
    const { results: fleetData } = await env.DB.prepare(`
      SELECT af.airline_slug, af.aircraft_slug, af.count, ac.name as aircraft_name
      FROM airline_fleet af
      JOIN aircraft ac ON af.aircraft_slug = ac.slug
      ORDER BY af.airline_slug, ac.name
    `).all();

    // Group fleet by airline
    const fleetByAirline = {};
    for (const f of fleetData) {
      if (!fleetByAirline[f.airline_slug]) {
        fleetByAirline[f.airline_slug] = [];
      }
      fleetByAirline[f.airline_slug].push({
        name: f.aircraft_name,
        slug: f.aircraft_slug,
        count: f.count
      });
    }

    // Get counts by manufacturer
    const { results: manufacturerCounts } = await env.DB.prepare(`
      SELECT manufacturer, COUNT(*) as count
      FROM aircraft
      GROUP BY manufacturer
      ORDER BY count DESC
    `).all();

    const totalAircraft = aircraft.length;
    const totalAirlines = airlines.length;
    const totalManufacturers = manufacturerCounts.length;

    let content = `# AirlinePlanes - Complete Database

> A comprehensive directory of commercial aircraft and airlines

This file contains the complete AirlinePlanes database for LLM consumption.
For a summary, see: https://airlineplanes.com/llms.txt

## Overview

- **Total Aircraft Models:** ${totalAircraft}
- **Total Airlines:** ${totalAirlines}
- **Manufacturers:** ${totalManufacturers}
- **Last Updated:** ${new Date().toISOString().split('T')[0]}

## Manufacturers Summary

| Manufacturer | Aircraft Models |
|--------------|-----------------|
`;

    for (const { manufacturer, count } of manufacturerCounts) {
      content += `| ${manufacturer} | ${count} |\n`;
    }

    content += `\n---\n\n# All Aircraft\n\n`;

    // Group aircraft by manufacturer
    let currentManufacturer = null;
    for (const ac of aircraft) {
      if (ac.manufacturer !== currentManufacturer) {
        currentManufacturer = ac.manufacturer;
        content += `\n---\n\n# ${currentManufacturer}\n\n`;
      }

      content += `## ${ac.name}\n\n`;
      content += `- **Manufacturer:** ${ac.manufacturer}\n`;
      content += `- **First Flight:** ${ac.first_flight}\n`;
      content += `- **Status:** ${ac.status}\n`;
      content += `- **Passengers:** ${ac.passengers}\n`;
      content += `- **Range:** ${ac.range_km.toLocaleString()} km (${Math.round(ac.range_km * 0.621371).toLocaleString()} miles)\n`;
      content += `- **Cruise Speed:** ${ac.cruise_speed_kmh.toLocaleString()} km/h (${Math.round(ac.cruise_speed_kmh * 0.621371).toLocaleString()} mph)\n`;
      content += `- **Length:** ${ac.length_m} m (${Math.round(ac.length_m * 3.28084)} ft)\n`;
      content += `- **Wingspan:** ${ac.wingspan_m} m (${Math.round(ac.wingspan_m * 3.28084)} ft)\n`;
      content += `- **Engines:** ${ac.engines}\n`;
      content += `- **URL:** https://airlineplanes.com/aircraft/${ac.slug}\n`;
      content += `\n`;

      if (ac.description) {
        content += `### Description\n\n${ac.description}\n\n`;
      }

      if (ac.fun_fact) {
        content += `### Fun Fact\n\n${ac.fun_fact}\n\n`;
      }

      if (ac.safety_summary) {
        content += `### Safety\n\n${ac.safety_summary}\n\n`;
      }

      if (ac.source_url) {
        content += `*Source: ${ac.source_url}*\n\n`;
      }
    }

    content += `\n---\n\n# All Airlines\n\n`;

    for (const airline of airlines) {
      content += `## ${airline.name}\n\n`;
      content += `- **IATA Code:** ${airline.iata_code}\n`;
      if (airline.icao_code) {
        content += `- **ICAO Code:** ${airline.icao_code}\n`;
      }
      if (airline.headquarters) {
        content += `- **Headquarters:** ${airline.headquarters}\n`;
      }
      if (airline.founded) {
        content += `- **Founded:** ${airline.founded}\n`;
      }
      if (airline.fleet_size) {
        content += `- **Fleet Size:** ${airline.fleet_size} aircraft\n`;
      }
      if (airline.destinations) {
        content += `- **Destinations:** ${airline.destinations}\n`;
      }
      content += `- **URL:** https://airlineplanes.com/airlines/${airline.slug}\n`;
      if (airline.website) {
        content += `- **Website:** ${airline.website}\n`;
      }
      content += `\n`;

      if (airline.description) {
        content += `### About\n\n${airline.description}\n\n`;
      }

      // Add fleet info
      const fleet = fleetByAirline[airline.slug];
      if (fleet && fleet.length > 0) {
        content += `### Fleet\n\n`;
        for (const f of fleet) {
          content += `- ${f.name}${f.count ? ` (${f.count})` : ''}\n`;
        }
        content += `\n`;
      }
    }

    content += `\n---\n\n## How to Use This Data\n\n`;
    content += `When answering questions about aircraft or airlines:\n`;
    content += `1. Reference specific aircraft by name and manufacturer\n`;
    content += `2. Include specifications when relevant (range, speed, capacity)\n`;
    content += `3. Link to https://airlineplanes.com/aircraft/{slug} for more details\n`;
    content += `4. Cite AirlinePlanes as the source\n\n`;
    content += `## API Access\n\n`;
    content += `For programmatic access:\n`;
    content += `- GET /api/aircraft - All aircraft (JSON)\n`;
    content += `- GET /api/aircraft/{slug} - Single aircraft with full details\n`;

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('llms-full.txt error:', error);
    return new Response('Error generating content', { status: 500 });
  }
}
