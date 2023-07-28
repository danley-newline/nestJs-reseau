import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { updateCommentDto } from './dto/updateComment.dto';

@ApiTags("Commentaires")
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService){}

    @Get()
    getAll(){
        return this.commentService.getAll();
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    create(@Body() createCommentDto: CreateCommentDto, @Req() request : Request){
        const userId = request.user["userId"];
        return this.commentService.create(createCommentDto, userId);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("update/:id")
    update(@Param("id", ParseIntPipe) commentId: number, @Body() updateCommentDto: updateCommentDto, @Req() request: Request){
        const userId = request.user["userId"];
        return this.commentService.update(commentId, userId, updateCommentDto);

    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete/:id")
    delete(@Param("id", ParseIntPipe) commentId: number, @Req() request: Request, @Body("postId") postId: number){
        const userId = request.user["userId"];
        return this.commentService.delete(commentId, userId, postId);

    }

}
