
export interface UserWriteCommentDTO{
    commentId: number;
    userId: number;
    nickname: string;
    fishId: number;
    body: string;
    isDelated: boolean;
    createdAt : Date;
    updatedAt : Date;
    likeCount : number;
    liked : boolean | null;
}

export interface ResponseCommentDTO{
    commentId: number;
    userId: number;
    nickname: string;
    fishId: number;
    body: string;
    isDelated: boolean;
    createdAt : Date;
    updatedAt : Date;
}

export interface CommentDTO{
    commentId:number;
    userId:number;
    fishId:number;
    body:string;
    isDeleted:boolean;
    createdAt : Date;
    updatedAt : Date;
}

export interface CommentCreateDTO{
    userId: number;
    fishId: number;
    body: string;
} 