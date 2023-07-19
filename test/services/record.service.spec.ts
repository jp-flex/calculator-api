import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from 'src/entities/operation.entity';
import { RecordService } from '../../src/services/record.service';
import { Record } from '../../src/entities/record.entity';


describe('RecordService', () => {
  let recordService: RecordService;
  let recordRepository: Repository<Record>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        {
          provide: getRepositoryToken(Record),
          useClass: Repository,
        },
      ],
    }).compile();

    recordService = module.get<RecordService>(RecordService);
    recordRepository = module.get<Repository<Record>>(getRepositoryToken(Record));
  });

  describe('createRecord', () => {
    it('should create a new record', async () => {
      const mockOperation: Operation = { id: 1, cost: 10, type: 'addition', records: [] };
      const mockResponse = 'Success';

      jest.spyOn(recordRepository, 'save').mockImplementation(() => Promise.resolve(new Record()));

      const result = await recordService.createRecord(1, 200, mockOperation, mockResponse);

      expect(result).toBeInstanceOf(Record);
      expect(recordRepository.save).toBeCalledWith(expect.any(Record));
    });
  });

  describe('getRecords', () => {
    it('should return records and total count', async () => {
      const userId = 1;
      const pageOptions = { page: 1, limit: 10 };
      const filter = { operation: 'sub' , amount: 2};
      const mockRecords: Record[] = [new Record(), new Record()];
      const mockTotal = 2;

      const createQueryBuilder: any = {
        leftJoinAndSelect: () => createQueryBuilder,
        where: () => createQueryBuilder,
        andWhere: () => createQueryBuilder,
        orderBy: () => createQueryBuilder,
        skip: () => createQueryBuilder,
        take: () => createQueryBuilder,
        getManyAndCount: () => [mockRecords, mockTotal]
      };
      jest.spyOn(recordRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);

      // Call the getRecords method
      const result = await recordService.getRecords(userId, pageOptions, filter);

      // Assertions
      expect(result.records).toEqual(mockRecords);
      expect(result.total).toBe(mockTotal);
      expect(recordRepository.createQueryBuilder).toBeCalledTimes(1);
    });
  });

  describe('softDeleteRecord', () => {
    it('should soft delete a record', async () => {
      // Create a mock record
      const mockRecord: Record = { id: 1, user_id: 1, user_balance: 200, amount: 10, operation: null, 
        operation_response: null , created_at:new Date(), deleted_at: new Date()};

      // Mock the findOne and save methods of the recordRepository
      jest.spyOn(recordRepository, 'findOne').mockResolvedValueOnce(mockRecord);
      jest.spyOn(recordRepository, 'save').mockImplementation(() => Promise.resolve(mockRecord));

      // Call the softDeleteRecord method
      await recordService.softDeleteRecord(1);

      // Assertions
      expect(recordRepository.findOne).toBeCalledWith({ where: { id: 1 } });
      expect(recordRepository.save).toBeCalledWith(mockRecord);
    });
  });

  describe('getTotalAmount', () => {
    it('should return the total amount', async () => {
      // Create mock query result
      const mockQueryResult = { sum: 100 };

      // Mock the getRawOne method of the queryBuilder

      const createQueryBuilder: any = {
        select: () => createQueryBuilder,
        where: () => createQueryBuilder,
        andWhere: () => createQueryBuilder,
        getRawOne: () => mockQueryResult,
      };


      jest.spyOn(recordRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = await recordService.getTotalAmount(1);

      expect(result).toBe(mockQueryResult.sum);
      expect(recordRepository.createQueryBuilder).toBeCalledTimes(1);
    });
  });
});

