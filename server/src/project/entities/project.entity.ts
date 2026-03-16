import { Client } from "server/src/client/entities/client.entity";
import { User } from "server/src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('simple-array', { nullable: true })
  techStack?: string[];

  @Column({ default: 'ONGOING' })
  status?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  startDate!: Date;

  @Column({ type:'timestamp', nullable: true})
  endDate!: Date;


  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Client, {onDelete: 'CASCADE'})
  client!: Client;
}
