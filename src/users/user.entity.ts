import { Exclude, Expose } from 'class-transformer';
import Post from 'src/posts/post.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Address from './address.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column({ nullable: true })
  @Expose()
  public name: string;

  @Column()
  public password: string;

  @OneToOne(() => Address, { eager: true, cascade: true }) // one to one relationship
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
}

export default User;
