import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { RecordService } from '../../src/services/record.service';
import { Operation } from '../../src/entities/operation.entity';
import { ThirdPartyException } from '../../src/exceptions/third.party.exception';
import { InvalidOperatorException } from '../../src/exceptions/invalid.operator.exception'
import { DivisionByZeroException } from '../../src/exceptions/division.by.zero.exception';
import { CalculationService } from '../../src/services/calculation.service';
import { Record } from '../../src/entities/record.entity';

describe('CalculationService', () => {
  let calculationService: CalculationService;
  let recordService: RecordService;
  let operationRepository: any;
  let recordRepository: any;
  const mockOperation: Operation = {
    id: 1,
    type: 'addition',
    cost: 10,
    records: [],
  };
  const userId = 1;
  const userBalance = 180

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculationService,
        RecordService,
        {
          provide: getRepositoryToken(Operation),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Record),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    calculationService = module.get<CalculationService>(CalculationService);
    recordService = module.get<RecordService>(RecordService);
    operationRepository = module.get(getRepositoryToken(Operation));
    recordRepository = module.get(getRepositoryToken(Record));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('performTwoOperandsCalc', () => {
    const firstOperand = 20;
    const secondOperand = 5;
    

    it('should perform addition correctly', async () => {
      // Arrange
      const expectedResult = 25;
      mockOperation.type = 'addition';
     
      const mockGetTotalAmount = jest.spyOn(recordService, 'getTotalAmount')
        .mockResolvedValueOnce(10);
      const mockCreateRecord = jest.spyOn(recordService, 'createRecord')
        .mockResolvedValueOnce({} as any);

      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;

      // Act
      const result = await calculationService.performArithmeticCalc(userId,
        mockOperation.type, [firstOperand, secondOperand]);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockOperationRepository.findOne)
        .toHaveBeenCalledWith({ where: { type: mockOperation.type } });
      expect(mockGetTotalAmount).toHaveBeenCalledWith(userId);
      expect(mockCreateRecord)
        .toHaveBeenCalledWith(userId, userBalance, mockOperation, expect.any(String));
    });

    it('should perform subtraction correctly', async () => {
      const expectedResult = 15;
      mockOperation.type = 'subtraction';
     
      const mockGetTotalAmount = jest.spyOn(recordService, 'getTotalAmount').mockResolvedValueOnce(10);
      const mockCreateRecord = jest.spyOn(recordService, 'createRecord').mockResolvedValueOnce({} as any);

      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;

      // Act
      const result = await calculationService.performArithmeticCalc(userId,
        mockOperation.type, [firstOperand, secondOperand]);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockOperationRepository.findOne).toHaveBeenCalledWith({ where: { type: mockOperation.type } });
      expect(mockGetTotalAmount).toHaveBeenCalledWith(userId);
      expect(mockCreateRecord).toHaveBeenCalledWith(userId, userBalance, mockOperation, expect.any(String));
    });

    it('should perform multiplication correctly', async () => {
      const expectedResult = 100;
      mockOperation.type = 'multiplication';
     
      const mockGetTotalAmount = jest.spyOn(recordService, 'getTotalAmount')
        .mockResolvedValueOnce(10);
      const mockCreateRecord = jest.spyOn(recordService, 'createRecord')
        .mockResolvedValueOnce({} as any);

      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;

      // Act
      const result = await calculationService.performArithmeticCalc(userId,
        mockOperation.type, [firstOperand, secondOperand]);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockOperationRepository.findOne).toHaveBeenCalledWith({ where: { type: mockOperation.type } });
      expect(mockGetTotalAmount).toHaveBeenCalledWith(userId);
      expect(mockCreateRecord).toHaveBeenCalledWith(userId, userBalance, mockOperation, expect.any(String));
    });

    it('should perform division correctly', async () => {
      const expectedResult = 4;
      mockOperation.type = 'division';
     
      const mockGetTotalAmount = jest.spyOn(recordService, 'getTotalAmount')
        .mockResolvedValueOnce(10);
      const mockCreateRecord = jest.spyOn(recordService, 'createRecord')
        .mockResolvedValueOnce({} as any);

      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;

      // Act
      const result = await calculationService.performArithmeticCalc(userId,
        mockOperation.type, [firstOperand, secondOperand]);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockOperationRepository.findOne)
        .toHaveBeenCalledWith({ where: { type: mockOperation.type } });
      expect(mockGetTotalAmount)
        .toHaveBeenCalledWith(userId);
      expect(mockCreateRecord)
        .toHaveBeenCalledWith(userId, userBalance, mockOperation, expect.any(String));
    });

    it('should throw InvalidOperatorException when operator is not valid', async () => {
      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(null),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;
      await expect(calculationService.performArithmeticCalc(2, 'invalidOp', [firstOperand, secondOperand]))
      .rejects.toThrow(InvalidOperatorException);
    });

    it('should throw DivisionByZeroException when dividing by zero', async () => {
      mockOperation.type = 'division';
      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;
      await expect(calculationService.performArithmeticCalc(1, 'division', [firstOperand,0]))
      .rejects.toThrow(DivisionByZeroException);
    });
  });

  describe('performOneOperandsCalc', () => {
    it('should perform square root correctly', async () => {
      const expectedResult = 5;
      mockOperation.type = 'square-root';
      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      const mockGetTotalAmount = jest.spyOn(recordService, 'getTotalAmount').mockResolvedValueOnce(10);
      const mockCreateRecord = jest.spyOn(recordService, 'createRecord').mockResolvedValueOnce({} as any);

      calculationService['operationRepository'] = mockOperationRepository as any;
      const result = await calculationService.performArithmeticCalc(userId, mockOperation.type, [25]);

      expect(result).toBe(expectedResult);
      expect(mockOperationRepository.findOne).toHaveBeenCalledWith({ where: { type: mockOperation.type } });
      expect(mockGetTotalAmount).toHaveBeenCalledWith(userId);
      expect(mockCreateRecord).toHaveBeenCalledWith(userId, userBalance, mockOperation, expect.any(String));
    });
  });

  describe('generateRandomString', () => {
    it('should generate random string correctly', async () => {
      const mockResponse = { data: 'randomString' };
    
      mockOperation.type = 'random-string';
      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };

      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const mockGetTotalAmount = jest.spyOn(recordService, 'getTotalAmount').mockResolvedValueOnce(10);
      const mockCreateRecord = jest.spyOn(recordService, 'createRecord').mockResolvedValueOnce({} as any);

      calculationService['operationRepository'] = mockOperationRepository as any;
      const result = await calculationService.performNonArithmeticCalc(userId, 'random-string');

      expect(result).toBe('randomString');
      expect(mockOperationRepository.findOne).toHaveBeenCalledWith({ where: { type: mockOperation.type } });
      expect(mockGetTotalAmount).toHaveBeenCalledWith(userId);
      expect(mockCreateRecord).toHaveBeenCalledWith(userId, userBalance, mockOperation, expect.any(String));
    });

    it('should throw ThirdPartyException when axios request fails', async () => {
      mockOperation.type = 'random-string';
      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(mockOperation),
      };
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Request failed'));

      calculationService['operationRepository'] = mockOperationRepository as any;
      await expect(calculationService.performNonArithmeticCalc(userId, "random-string"))
        .rejects.toThrow(ThirdPartyException);
    });

    it('should throw InvalidOperatorException when there is no RandomString operator', async () => {
      mockOperation.type = 'random-string';
      const mockOperationRepository = {
        findOne: jest.fn().mockResolvedValueOnce(null),
      };

      calculationService['operationRepository'] = mockOperationRepository as any;
      await expect(calculationService.performNonArithmeticCalc(userId, "randomString"))
        .rejects.toThrow(InvalidOperatorException);
    });
  });
});
