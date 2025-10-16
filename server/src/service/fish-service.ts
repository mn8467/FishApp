import { FishRequestDTO} from "../dto/fish-dto";
import { FishMapper } from "../mapper/fish-mapper";
import { findByFishId, listFish } from "../repository/fish-repository";

export async function getFishList(): Promise<FishRequestDTO[]> {
    const rows = await listFish();
    return FishMapper.toEntityList(rows);
}

export async function getFishData(fish_id:number): Promise<Object>{
    const rows = await findByFishId(fish_id);
    return rows;
} 