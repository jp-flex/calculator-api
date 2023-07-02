import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from '../entities/record.entity';
import { Operation } from '../entities/operation.entity';

@Injectable()
export class RecordService {

  public static readonly USER_INITIAL_BALANCE = 200;

  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async createRecord(
    userId: number,
    userBalance:number,
    operation: Operation,
    response: string ,
  ): Promise<Record> {
    const record = new Record();
    record.user_id = userId;
    record.user_balance = userBalance;
    record.amount = operation.cost;
    record.operation = operation;
    record.operation_response = response;

    return this.recordRepository.save(record);
  }

  async getRecords(userId:number, pageOptionsFromClient: { page: number; limit: number; }, filter:any) 
  : Promise<{ records: Record[]; total: number }> {
    
    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.operation', 'operation')
      .where('record.user_id = :user_id', { user_id:userId })
      .andWhere('record.deleted_at IS NULL')
      .orderBy('record.created_at', 'DESC')
      .skip((pageOptionsFromClient.page - 1) * pageOptionsFromClient.limit)
      .take(pageOptionsFromClient.limit);
    
    this.applyQueryFilters(queryBuilder, filter);

    const [records, total] = await queryBuilder.getManyAndCount();

    return { records, total };

  }

  async softDeleteRecord(id: number) {
    const resource = await this.recordRepository.findOne({ where: { id: id } });

    if (!resource)
      throw Error(`Not found Record with id: ${id}`);
    
    resource.deleted_at = new Date();
    await this.recordRepository.save(resource);
  }

  async getTotalAmount(userId: number):Promise<number> {
    const queryResult = await this.recordRepository
      .createQueryBuilder('record')
      .select('SUM(record.amount)', 'sum')
      .where('record.user_id = :user_id', { user_id: userId })
      .andWhere('record.deleted_at IS NULL')
      .getRawOne();

    return Number(queryResult.sum);
  }

  private applyQueryFilters(queryBuilder:any, params:any) {
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
