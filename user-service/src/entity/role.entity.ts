import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
  } from 'typeorm';
  import { User } from './user.entity';
  import { v4 as uuidv4 } from 'uuid';
  
  @Entity('roles')
  export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    name: string;
  
    @Column('jsonb')
    permissions: string[];
  
    @OneToMany(() => User, (user) => user.role)
    users: User[];
  
    @BeforeInsert()
    generateUUID() {
      this.id = uuidv4();
    }
  }