import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { updateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
   
    constructor( private readonly prismaService: PrismaService ){}


    async create(createCommentDto: CreateCommentDto, userId: any) {
        const { content , postId} = createCommentDto;
        const post = await this.prismaService.post.findUnique({ where: { postId } });
        if(!post) throw new NotFoundException("Post not found");
        await this.prismaService.comment.create({ 
            data: { content, userId , postId} 
        });
        return { data: "Comment Created!" };
    }

    async getAll() {
        return this.prismaService.comment.findMany({
            include: {
                user:{
                    select:{
                        email: false,
                        username: true,
                        password: false
                    }
                },
                post:{
                    select: {
                        title: true,
                        body: false,
                        userId: false,
                        postId: false,
                        user: false
                    },
                }
            }
        });
    }

    async update(commentId: number, userId: number, updateCommentDto: updateCommentDto) {
        const { content, postId } = updateCommentDto;
        const comment = await this.prismaService.comment.findUnique({ where: { commentId } });
        if(!comment) throw new NotFoundException("Comment not found");
        if(comment.postId !== postId) throw new UnauthorizedException("Post it does not match");
        if(comment.userId !== userId) throw new ForbiddenException("Forbidden action");
        await this.prismaService.comment.update({ where: { commentId }, data: {content} });

        return { data: "Comment updated" };
    }

    async delete(commentId: number, userId: number, postId: number) {
        const comment = await this.prismaService.comment.findUnique({ where: { commentId } });
        if(!comment) throw new NotFoundException("Comment not found");
        if(comment.userId !== userId) throw new ForbiddenException("Forbidden action");
        if(comment.postId !== postId) throw new UnauthorizedException("Post it does not match");
        await this.prismaService.comment.delete({ where: { commentId } });

        return { data: "Comment deleted" }
    }
}
