import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService){}

    @Get()
    getAll(){
        return this.postService.getAll();
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    create(@Body() createPostDto : CreatePostDto, @Req() request: Request){
        const userId = request.user["userId"];
        return this.postService.create(createPostDto, userId)
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete/:id")
    delete(@Param("id", ParseIntPipe) postId: number, @Req() request: Request){
        const userId = request.user["userId"];
        return this.postService.delete(postId, userId);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("update/:id")
    update(@Param("id", ParseIntPipe) postId: number,@Body() updatePostDto : UpdatePostDto , @Req() request: Request ){
        const userId = request.user["userId"];
        return this.postService.update(postId, userId, updatePostDto);
    }
}
