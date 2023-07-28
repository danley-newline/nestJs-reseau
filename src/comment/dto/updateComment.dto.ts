import { IsNotEmpty } from "class-validator";

export class updateCommentDto{
    @IsNotEmpty()   
    readonly content?: string;
    @IsNotEmpty()
    readonly postId?: number;
}