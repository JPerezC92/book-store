import { Delete, Post } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roleType.enum';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto';

@Controller('book')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @UseGuards(AuthGuard())
  @Get()
  findAll(): Promise<ReadBookDto[]> {
    return this._bookService.findAll();
  }

  @Get(':bookId')
  findOne(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this._bookService.findOne(bookId);
  }

  @Get('author/:authorId')
  getBookByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBookByAuthor(authorId);
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this._bookService.create(book);
  }

  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBookByAuthor(
    @Body() book: Partial<CreateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.createByAuthor(book, authorId);
  }

  @Patch(':bookId')
  updateBook(
    @Body() book: Partial<UpdateBookDto>,
    @Param('bookId') bookId: number,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.update(bookId, book, authorId);
  }

  @Delete(':bookId')
  remove(@Param('bookId', ParseIntPipe) bookId: number): Promise<void> {
    return this._bookService.delete(bookId);
  }
}
