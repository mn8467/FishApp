import pool from "../db";
import { NotFoundError,DbError } from "../utils/error";  
import type{ FishAllDataDTO, FishForHomeDTO, FishResponseDTO } from "../dto/fish-dto";

export async function findFishesForHome(): Promise<FishForHomeDTO[]>{
  const sql =`
              SELECT
                fish_id AS "fishId",
                fish_name AS "fishName",
                image_url AS "imageUrl"
              FROM fish
              ORDER BY fish_name ASC;
             `
    try {
    const { rows } = await pool.query<FishForHomeDTO>(sql);
    return rows; // [] 가능
  } catch (e) {
    throw new DbError("DbError 발생", e);
  }
}

//f,fs를 변수명으로 쓰는 이유 : 읽자마자 어떤 테이블인지 직관적.
// 선택한 fish 만 찾는 단건 조회
export async function findByFishId(fish_id:number): Promise<FishAllDataDTO> {
  const sql = `
                SELECT
                  f.fish_id     AS "fishId",
                  f.fish_name   AS "fishName",
                  f.family_name AS "familyName",
                  f.habitat     AS "habitat",
                  f.body_length AS "bodyLength",
                  f.description AS "description",
                  f.image_url   AS "imageUrl",
                  fs.total_stats AS "totalStats",
                  fs.hp          AS "hp",
                  fs.hp_desc     AS "hpDesc",
                  fs.attack      AS "attack",
                  fs.attack_desc AS "attackDesc",
                  fs.defense     AS "defense",
                  fs.defense_desc AS "defenseDesc",
                  fs.special      AS "special",
                  fs.special_desc AS "specialDesc",
                  fs.speed        AS "speed",
                  fs.speed_desc   AS "speedDesc"
                FROM public.fish AS f
                LEFT JOIN public.fish_stats AS fs
                  ON fs.fish_id = f.fish_id
                WHERE f.fish_id = $1;
        `;
  try {
    const { rows } = await pool.query(sql, [fish_id]);
    return rows[0] ?? null; // 단건 조회시 사용
  } catch (e) {
    throw new DbError("DbError 발생", e);
  }
}

//모든 Fish 조회 (다건조회)
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