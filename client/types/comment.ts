export interface Comment {
  commentId: string;
  userId: string;
  nickname: string;
  fishId: string;
  body: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isModified : boolean;
  likeCount: string;
  liked: boolean;
}

export interface WriteComment {
  fishId: string;
  body: string;
}