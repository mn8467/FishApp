import { FishRequestDTO, FishResponseDTO } from "../dto/fish-dto";
import { MappingError } from "../utils/error";
import { toUserEntity } from "./user-mapper";


export const FishMapper = {
  // JS → DB 변환 (camelCase → snake_case)
//   toRow(entity: ) {
//     return {
//     };
//   },  아직 정의 X

//단건 조회용
 toEntity(row: FishResponseDTO | null | undefined) : FishRequestDTO {
     if (!row) throw new MappingError("FishResData is null/undefined");
     return {
       fishId: row.fish_id,
       fishName: row.fish_name,
       familyName: row.family_name,
       habitat: row.habitat,
       bodyLength: row.body_length,
       description: row.description,
       imageUrl: row.image_url,
       createdAt: row.createdAt,
       updatedAt: row.updatedAt,
     }
   },
  // DB → JS 변환 (snake_case → camelCase)
 toEntityList(rows: Array<FishResponseDTO | null | undefined>): FishRequestDTO[] {
    if (!rows || rows.length === 0) return [];

    return rows.map((row) => {
      if (!row) throw new MappingError("FishResData is null/undefined");
      return {
        fishId: row.fish_id,
        fishName: row.fish_name,
        familyName: row.family_name,
        habitat: row.habitat,
        bodyLength: row.body_length,
        description: row.description,
        imageUrl: row.image_url,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    }); // ← 여기 콤마(,) 제거 + 괄호/중괄호 정리
  },
};
