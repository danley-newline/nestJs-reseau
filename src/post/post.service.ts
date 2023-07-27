import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostService {
   
    constructor( private readonly prismaService: PrismaService ){}
    
    async create(createPostDto: CreatePostDto, userId: any) {
        const { title, body } = createPostDto;
        await this.prismaService.post.create({ data : { title, body, userId } })
        return { data: "Post Created" };
    }

    async getAll() {
        return await this.prismaService.post.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        username: true,
                        password: false
                    }
                },
                comment: {
                    include:{
                        user: {
                            select: {
                                email: true,
                                username: true,
                                password: false
                            }
                        }
                    }
                }
            }
        });
    }

    async delete(postId: number, userId: number) {
        const post = await this.prismaService.post.findUnique({ where : {postId} });
        if (!post) throw new NotFoundException("Post not found");
        if (post.userId !== userId) throw new ForbiddenException("Forbidden action");
        await this.prismaService.post.delete({ where: { postId } });

        return { data: 'Post deleted' };
    }

    async update(postId: number, userId: any, updatePostDto: UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({ where: { postId} });
        if (!post) throw new NotFoundException("Post not found");
        if (post.userId !== userId) throw new ForbiddenException("Forbidden action");
        await this.prismaService.post.update({ where: { postId }, data: {...updatePostDto} });

        return { data: "Post Updated!"}
    }
}
