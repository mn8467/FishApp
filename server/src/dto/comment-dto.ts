
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