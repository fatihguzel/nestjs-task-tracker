import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Todo } from 'src/modules/todo/entity/todo.entity';

@Entity()
export class User {
  @ApiProperty({ description: 'Özgün kimlik' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Kullanıcı adı' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Şifre' })
  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  @JoinColumn()
  todos: Todo[];
}
