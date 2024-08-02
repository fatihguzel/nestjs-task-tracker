import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the todo' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Title of the todo' })
  title: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Completion status of the todo', default: false })
  completed: boolean;

  @ApiProperty({ description: 'User who created the todo' })
  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Date and time the todo was created' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Date and time the todo was last updated' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Date and time the todo was completed' })
  completedAt: Date;
}
