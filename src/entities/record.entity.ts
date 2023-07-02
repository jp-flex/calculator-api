import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Operation } from './operation.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
  user_id: number;

  @Column()
  amount: number;

  @Column( {default: () => '0'})
  user_balance:number

  @Column()
  operation_response: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: () => 'null' })
  deleted_at: Date;

  @ManyToOne(() => Operation, (operation) => operation.records)
  operation: Operation
}
