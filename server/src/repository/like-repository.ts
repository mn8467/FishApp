
// 좋아요 누르기 기능
// ON CONFLICT DO NOTHING 기능의 목적은 중복 좋아요가 생기지 않으며 요청을 여러 번 보내도 안전하게 하기 위함
// Client에 자동입력방지 완료 , DB에 여러 요청 입력 방지 완료
export async function insertLikeComment(fish_id:Number, comment_id:Number){
    const sql = `
                    INSERT INTO comment_likes (user_id, comment_id)
                    VALUES ($1, $2)
                    ON CONFLICT (user_id, comment_id) DO NOTHING;
                    RETURNING 1;
                `

}