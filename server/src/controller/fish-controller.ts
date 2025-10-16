import { Response,Request,NextFunction } from "express";
import { getFishData, getFishList } from "../service/fish-service";

export const findAllFish = async (req:Request,res:Response,next:NextFunction) => {
    try {
    const fish = await getFishList(); // 전체 조회
    res.status(200).json(fish);       // 그대로 전달
  } catch (err) {
    next(err);
  }
};

export const getByFishId = async(req:Request,res:Response,next:NextFunction) => {
  try {
    const id = Number(req.params.fishId);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "fishId must be a positive integer" });
    }
    
    const fish = await getFishData(id);
    
    if (!fish) {
      return res.status(404).json({ message: "Fish not found" });
    }
    
    res.status(200).json(fish);
  } catch (err) { next(err); }
};