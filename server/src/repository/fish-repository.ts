import pool from "../db";
import { NotFoundError,DbError } from "../utils/error";  
import type{ FishResponseDTO } from "../dto/fish-dto";


export async function listFish(): Promise<FishResponseDTO[]> {
  const sql = `
    SELECT
      fish_id,
      fish_name,
      family_name,
      habitat,
      body_length,
      description,
      image_url,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM fish
    ORDER BY fish_id ASC
  `;
  try {
    const { rows } = await pool.query<FishResponseDTO>(sql);
    return rows; // [] 가능
  } catch (e) {
    throw new DbError("listFish failed", e);
  }}