
import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET all flood incidents
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        barangay,
        TO_CHAR(date, 'YYYY-MM-DD') AS date,
        water_level_meters AS "waterLevelMeters",
        severity,
        affected_families AS "affectedFamilies",
        description
      FROM flood_incidents
      ORDER BY date DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to retrieve flood incidents:", error);

    res.status(500).json({
      message: "Unable to retrieve flood incident records."
    });
  }
});

export default router;
