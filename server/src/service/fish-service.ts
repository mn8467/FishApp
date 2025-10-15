import { FishRequestDTO} from "../dto/fish-dto";
import { FishMapper } from "../mapper/fish-mapper";
import { listFish } from "../repository/fish-repository";

export async function getFishList(): Promise<FishRequestDTO[]> {
    const rows = await listFish();
    return FishMapper.toEntityList(rows);
}