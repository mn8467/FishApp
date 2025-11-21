import pool from "../db";
import { NotFoundError,DbError } from "../utils/error";  
import type{ FishAllDataDTO, FishForHomeDTO, FishResponseDTO } from "../dto/fish-dto";
import { PetForHomeDTO } from "../dto/pet-dto";

export async function findPetForHome(): Promise<PetForHomeDTO[]>{
  const sql =`
              SELECT
                pet_id AS "petId",
                pet_grade AS "petGrade",
                pet_name AS "petName",
                pet_portrait_url AS "petPortraitUrl"
              FROM pet
              ORDER BY pet_grade ASC;
             `
    try {
    const { rows } = await pool.query<PetForHomeDTO>(sql);
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
                    p.pet_id,
                    p.pet_name,
                
                    p.pet_grade,
                    ig.grade_name,
                
                    bs1.stat_name  AS main_stat_first_name,
                    bs1.stat_decs  AS main_stat_first_desc,
                    bs1.related_stat AS main_stat_first_related,
                
                    bs2.stat_name  AS main_stat_second_name,
                    bs2.stat_decs  AS main_stat_second_desc,
                    bs2.related_stat AS main_stat_second_related,
                
                    -- 기타 정보
                    p.pet_portrait_url
                FROM pet AS p
                JOIN item_grade   AS ig  ON p.pet_grade            = ig.grade_num
                JOIN bonus_stats  AS bs1 ON p.pet_main_stat_first  = bs1.stat_id
                JOIN bonus_stats  AS bs2 ON p.pet_main_stat_second = bs2.stat_id
                ORDER BY p.pet_id;
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