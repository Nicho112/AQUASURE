import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const SQL = `
BEGIN;

INSERT INTO barangays (id, name, short_name, risk_level, population, households, elevation_m, hazard_description, location, boundary) VALUES
  ('brgy-buhangin', 'Barangay Buhangin', 'Buhangin', 'High',   18245, 4200, 2.10,
   'Riverside community directly exposed to Agusan River overflow.',
   ST_SetSRID(ST_MakePoint(125.5406, 8.9475), 4326),
   ST_SetSRID(ST_GeomFromText('POLYGON((125.535 8.942, 125.546 8.942, 125.546 8.953, 125.535 8.953, 125.535 8.942))'), 4326)),
  ('brgy-libertad', 'Barangay Libertad', 'Libertad', 'High',   12890, 3050, 2.80,
   'Low-lying district near the river bend.',
   ST_SetSRID(ST_MakePoint(125.5462, 8.9541), 4326),
   ST_SetSRID(ST_GeomFromText('POLYGON((125.542 8.950, 125.552 8.950, 125.552 8.959, 125.542 8.959, 125.542 8.950))'), 4326)),
  ('brgy-ampayon', 'Barangay Ampayon', 'Ampayon', 'Medium', 15320, 3600, 6.50,
   'Moderate elevation, catch basin for upstream runoff.',
   ST_SetSRID(ST_MakePoint(125.5589, 8.9612), 4326),
   ST_SetSRID(ST_GeomFromText('POLYGON((125.554 8.957, 125.564 8.957, 125.564 8.966, 125.554 8.966, 125.554 8.957))'), 4326)),
  ('brgy-baan', 'Barangay Baan', 'Baan', 'Medium', 9870, 2350, 5.20,
   'Mixed residential and agricultural.',
   ST_SetSRID(ST_MakePoint(125.5312, 8.9701), 4326),
   ST_SetSRID(ST_GeomFromText('POLYGON((125.527 8.966, 125.536 8.966, 125.536 8.975, 125.527 8.975, 125.527 8.966))'), 4326)),
  ('brgy-ongyiu', 'Barangay Ong Yiu', 'Ong Yiu', 'Low', 7450, 1800, 12.30,
   'Higher elevation, evacuation host for nearby barangays.',
   ST_SetSRID(ST_MakePoint(125.5234, 8.9812), 4326),
   ST_SetSRID(ST_GeomFromText('POLYGON((125.519 8.977, 125.528 8.977, 125.528 8.986, 125.519 8.986, 125.519 8.977))'), 4326));

INSERT INTO evacuation_centers
  (id, name, barangay, barangay_id, address, capacity, current_occupancy,
   contact_person, contact_number, facilities, status, location)
VALUES
  ('evac-buhangin-elem', 'Buhangin Elementary School', 'Barangay Buhangin', 'brgy-buhangin',
   'Purok 3, Buhangin, Butuan City', 800, 120, 'Maria Santos', '0917-555-0101',
   ARRAY['Medical Station','Kitchen','Restrooms','Generator'], 'Open',
   ST_SetSRID(ST_MakePoint(125.5415, 8.9488), 4326)),
  ('evac-libertad-gym', 'Libertad Barangay Gymnasium', 'Barangay Libertad', 'brgy-libertad',
   'Riverside Road, Libertad, Butuan City', 500, 480, 'Jose Reyes', '0917-555-0102',
   ARRAY['Kitchen','Restrooms','First Aid'], 'Near Capacity',
   ST_SetSRID(ST_MakePoint(125.5475, 8.9555), 4326)),
  ('evac-ampayon-high', 'Ampayon National High School', 'Barangay Ampayon', 'brgy-ampayon',
   'National Highway, Ampayon, Butuan City', 1200, 0, 'Ana Cruz', '0917-555-0103',
   ARRAY['Medical Station','Kitchen','Restrooms','Generator','Water Tank'], 'Standby',
   ST_SetSRID(ST_MakePoint(125.5600, 8.9625), 4326)),
  ('evac-baan-hall', 'Baan Barangay Hall', 'Barangay Baan', 'brgy-baan',
   'Poblacion, Baan, Butuan City', 300, 0, 'Pedro Lim', '0917-555-0104',
   ARRAY['First Aid','Restrooms'], 'Standby',
   ST_SetSRID(ST_MakePoint(125.5320, 8.9710), 4326)),
  ('evac-ongyiu-coliseum', 'Ong Yiu Sports Coliseum', 'Barangay Ong Yiu', 'brgy-ongyiu',
   'Sports Complex Road, Ong Yiu, Butuan City', 2000, 0, 'Rosa Dela Cruz', '0917-555-0105',
   ARRAY['Medical Station','Kitchen','Restrooms','Generator','Water Tank','Communications'], 'Standby',
   ST_SetSRID(ST_MakePoint(125.5245, 8.9820), 4326));

INSERT INTO flood_incidents
  (barangay, barangay_id, incident_date, water_level_m, severity, affected_families, description, location)
VALUES
  ('Barangay Buhangin', 'brgy-buhangin', CURRENT_DATE, 4.42, 'High', 320,
   'River breached banks near Buhangin Bridge.',
   ST_SetSRID(ST_MakePoint(125.5406, 8.9475), 4326)),
  ('Barangay Libertad', 'brgy-libertad', CURRENT_DATE - 1, 4.85, 'Critical', 510,
   'Critical water level approaching the 5.00m threshold. Preemptive evacuation initiated.',
   ST_SetSRID(ST_MakePoint(125.5462, 8.9541), 4326)),
  ('Barangay Ampayon', 'brgy-ampayon', CURRENT_DATE - 2, 3.75, 'Moderate', 145,
   'Localized flooding from upstream runoff.',
   ST_SetSRID(ST_MakePoint(125.5589, 8.9612), 4326)),
  ('Barangay Baan', 'brgy-baan', CURRENT_DATE - 3, 3.20, 'Low', 42,
   'Minor ponding in agricultural areas.',
   ST_SetSRID(ST_MakePoint(125.5312, 8.9701), 4326));

COMMIT;
`;

try {
  await pool.query(SQL);
  const r = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM barangays) AS barangays,
      (SELECT COUNT(*) FROM evacuation_centers) AS evac,
      (SELECT COUNT(*) FROM flood_incidents) AS incidents
  `);
  console.table(r.rows);
} catch (e) {
  console.error("Seed failed:", e.message);
} finally {
  await pool.end();
}