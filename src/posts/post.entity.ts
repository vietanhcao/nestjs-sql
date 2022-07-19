import { Transform } from 'class-transformer';
import Category from 'src/categories/category.entity';
import User from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({nullable: true})
  public addedColumn: string;

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];

  @ManyToOne(
    () => User,
    (author: User) => author.posts,
  )
  public author: User;
}

export default Post;
