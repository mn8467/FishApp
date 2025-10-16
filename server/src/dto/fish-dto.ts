export interface FishRequestDTO {
    fishId:number;
    fishName:string     
    familyName:string      
    habitat:string			
    bodyLength:string 	
    description:string     
    imageUrl: string | null;   // 이미지 없으면 null 권장
    createdAt: Date | string;
    updatedAt: Date | string; 
}

//DB에서 데이터를 가져올때 틀
export interface FishResponseDTO{
    fish_id:number;
    fish_name:string;     
    family_name:string;      
    habitat:string;			
    body_length:string;	
    description:string;
    image_url: string | null;   // 이미지 없으면 null 권장
    createdAt: Date | string;   // 드라이버에 따라 string 가능
    updatedAt: Date | string;
}

export interface FishAllDataDTO{
   fishId:number
   fishName:string
   familyName:string
   habitat:string
   bodyLength:string
   description:string
   imageUrl:string
   totalStats:number
   hp:number
   hpDesc:string
   attack:number
   attackDesc:string
   defense:number
   defenseDesc:string
   special:number
   specialDesc:string
   speed:number
   speedDesc:string
}