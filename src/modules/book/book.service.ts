import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { status } from 'src/shared/entity-status.enum';
import { In } from 'typeorm';
import { RoleType } from '../role/roleType.enum';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/entities/user.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto';
import { Book } from './entities/book.entity';
import { BookRepository } from './entities/book.repository';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async findAll(): Promise<ReadBookDto[]> {
    const books = await this._bookRepository.find({
      where: { status: status.ACTIVE },
    });
    if (!books) {
      throw new NotFoundException();
    }

    const bookObjectArray = books.map((book) => classToPlain(book));

    return plainToClass(ReadBookDto, bookObjectArray);
  }

  async findOne(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('bookId must be provided');
    }

    const book = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('Book does not exist');
    }

    const bookObject = classToPlain(book);

    return plainToClass(ReadBookDto, bookObject);
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: status.ACTIVE },
      });

      if (!authorExists) {
        throw new NotFoundException(
          `There is not an author with this id: ${authorId}`,
        );
      }

      const isAuthor = authorExists.roles.some(
        (role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        );
      }

      authors.push(authorExists);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    const bookObject = classToPlain(savedBook);

    return plainToClass(ReadBookDto, bookObject);
  }

  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('authorId must be provided');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE },
    });

    const bookObjectArray = books.map((book) => classToPlain(book));

    return plainToClass(ReadBookDto, bookObjectArray);
  }

  async createByAuthor(
    book: Partial<CreateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: status.ACTIVE },
    });

    const isAuthor = author.roles.some((role) => role.name === RoleType.AUTHOR);

    if (!isAuthor) {
      throw new UnauthorizedException(`this user ${authorId} is not an author`);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    const bookObject = classToPlain(savedBook);

    return plainToClass(ReadBookDto, bookObject);
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!bookExists) {
      throw new NotFoundException(`This book does not exist`);
    }

    const isOwnBook = bookExists.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new UnauthorizedException(`This user isn't the book's owner`);
    }

    const updatedBook = await this._bookRepository.update(bookId, book);

    const updatedBookObject = classToPlain(updatedBook);

    return plainToClass(ReadBookDto, updatedBookObject);
  }

  async delete(bookId: number): Promise<void> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!bookExists) {
      throw new NotFoundException(`This book does not exist`);
    }

    await this._bookRepository.update(bookId, { status: status.INACTIVE });
  }
}
