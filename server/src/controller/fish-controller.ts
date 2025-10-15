import { Response,Request,NextFunction } from "express";
import { getFishList } from "../service/fish-service";

export const findAllFish = async (req:Request,res:Response,next:NextFunction) => {
    try {
    const fish = await getFishList(); // 전체 조회
    res.status(200).json(fish);       // 그대로 전달
  } catch (err) {
    next(err);
  }
};