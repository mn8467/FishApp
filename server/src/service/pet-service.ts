import { ResponsePetInfoDTO } from "../dto/pet-dto";
import { findPetForHome } from "../repository/pet-repository";

export async function getPetListForHome() : Promise<ResponsePetInfoDTO[]>{
    const rows = await findPetForHome();
    return rows;
}