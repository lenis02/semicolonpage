import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['provider', 'socialId'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  provider!: string;

  @Column()
  socialId!: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
