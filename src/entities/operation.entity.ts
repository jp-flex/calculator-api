// src/entities/operation.entity.ts
import { OneToMany } from '@mikro-orm/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Record } from './record.entity';

@Entity()
export class Operation {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  cost: number;

  @OneToMany(() => Record, record => record.operation)
  records: Record[];
}