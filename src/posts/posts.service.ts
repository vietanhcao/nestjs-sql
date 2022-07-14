import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './post.entity';
import { PostNotFoundException } from './exception/postNotFund.exception';
import User from 'src/users/user.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private readonly categoriesService: CategoriesService,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({ select: { title: true, author: { email: true } }, relations: ['author'] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async replacePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const arrCatagories = post.categories.map(id => this.categoriesService.getCategoryById(id));
    const resolveArrCategories = await Promise.all(arrCatagories);
    const newPost = this.postsRepository.create({ ...post, author: user, categories: resolveArrCategories });

    newPost.author.password = undefined;
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
