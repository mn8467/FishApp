import { Response,Request,NextFunction } from "express";
import { getPetListForHome } from "../service/pet-service";

export const getPetIdandName = async(req:Request,res:Response,next:NextFunction) => {
  try{
    const petId = await getPetListForHome();
    res.status(200).json(petId); 
  } catch (err){
    next(err);
  }
}