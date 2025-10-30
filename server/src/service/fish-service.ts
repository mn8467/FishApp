import { FishForHomeDTO, FishRequestDTO} from "../dto/fish-dto";
import { FishMapper } from "../mapper/fish-mapper";
import { findByFishId, listFish ,findFishesForHome} from "../repository/fish-repository";

//Home
export async function getFishListForHome() : Promise<FishForHomeDTO[]>{
    const rows = await findFishesForHome();
    return rows;
}

//Home에서 선택한 Fish 데이터 가져올때 사용
export async function getFishData(fish_id:number): Promise<Object>{
    const rows = await findByFishId(fish_id);
    return rows;
} 

//fishDetail Page에서 사용
export async function getFishList(): Promise<FishRequestDTO[]> {
    const rows = await listFish();
    return FishMapper.toEntityList(rows);
}

