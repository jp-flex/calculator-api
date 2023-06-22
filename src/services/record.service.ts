import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from '../entities/record.entity';
import { Operation } from 'src/entities/operation.entity';

@Injectable()
export class RecordService {

  public static readonly USER_INITIAL_BALANCE = 200;

  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async createRecord(
    userId: number,
    userBalance:number,
    operation: Operation,
    response: string ,
  ): Promise<Record> {
    const record = new Record();
    record.userId = userId;
    record.userBalance = userBalance;
    record.amount = operation.cost;
    record.operation = operation;
    record.operationResponse = response;

    return this.recordRepository.save(record);
  }

  async getRecords(userId:number, pageOptionsFromClient: { page: number; limit: number; }, filter:any) 
  : Promise<{ records: Record[]; total: number }> {
    
    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.operation', 'operation')
      .where('record.userId = :userId', { userId })
      .andWhere('record.deletedAt IS NULL')
      .orderBy('record.createdAt', 'DESC')
      .skip((pageOptionsFromClient.page - 1) * pageOptionsFromClient.limit)
      .take(pageOptionsFromClient.limit);
    
    this.applyQueryFilters(queryBuilder, filter);

    const [records, total] = await queryBuilder.getManyAndCount();

    return { records, total };

  }

  async softDeleteRecord(id: number): Promise<Record> {
    const resource = await this.recordRepository.findOne({ where: { id: id } });
    
    resource.deletedAt = new Date();
    return await this.recordRepository.save(resource);
  }

  async getTotalAmount(userId: number):Promise<number> {
    const queryResult = await this.recordRepository
    .createQueryBuilder('record')
    .select('SUM(record.amount)', 'sum')
    .where('record.userId = :userId', { userId })
    .andWhere('record.deletedAt IS NULL')
    .getRawOne();

    return Number(queryResult.sum);
  }

  applyQueryFilters(queryBuilder:any, params:any) {
    for (const key in params) {
        const value = params[key];
        if (value) {
            if (!isNaN(Number(value))) {
              queryBuilder.andWhere( `${key} = :${key}`, {[key]:Number(value)})
            } else {
              queryBuilder.andWhere( `${key} LIKE :${key}`, {[key]:`%${value}%`})
            }
        }
    }
  }
}
