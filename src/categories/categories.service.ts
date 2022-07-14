import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from './category.entity';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import { CategoryNotFoundException } from './exception/categoryNotFoundException';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoriesRepository.find({});
  }

  async getCategoryById(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (category) {
      return category;
    }
    throw new CategoryNotFoundException(id);
  }

  /**
   * See the [definition of the UpdateCategoryDto file]{@link UpdateCategoryDto} to see a list of required properties
   */
  async updateCategory(id: number, category: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
      withDeleted: true,
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  /**
   * See the [definition of the CreateCategoryDto file]{@link CreateCategoryDto} to see a list of required properties
   */
  async createCategory(category: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category);
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }
}
