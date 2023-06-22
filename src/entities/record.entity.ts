// src/entities/record.entity.ts

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Operation } from './operation.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column( {default: () => '0'})
  userBalance:number

  @Column()
  operationResponse: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
  deletedAt: Date;

  @ManyToOne(() => Operation, (operation) => operation.records)
  operation: Operation
}
