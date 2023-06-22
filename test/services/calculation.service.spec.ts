import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CalculationService } from '../src/services/calculation.service';
import { RecordService } from '../src/services/record.service';
import { UserService } from '../src/services/user.service';
import { Operation } from '../src/entities/operation.entity';
import { InvalidOperatorException } from 'src/exceptions/invalid.operator.exception';
import { DivisionByZeroException } from 'src/exceptions/division.by.zero.exception';
import { ThirdPartyException } from 'src/exceptions/third.party.exception';
import axios from 'axios';

describe('CalculationService', () => {
  let calculationService: CalculationService;
  let recordService: RecordService;
  let userService: UserService;
  let operationRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculationService,
        RecordService,
        UserService,
        {
          provide: getRepositoryToken(Operation),
          useValue: {},
        },
      ],
    }).compile();

    calculationService = module.get<CalculationService>(CalculationService);
    recordService = module.get<RecordService>(RecordService);
    userService = module.get<UserService>(UserService);
    operationRepository = module.get<any>(getRepositoryToken(Operation));
  });

  describe('performTwoOperandsCalc', () => {
    it('should perform addition correctly', async () => {
      const operation = { id: 1, type: 'addition', cost: 5 };
      jest.spyOn(operationRepository, 'findOne').mockResolvedValueOnce(operation);
      jest.spyOn(recordService, 'createRecord').mockImplementation();
      jest.spyOn(userService, 'get').mockResolvedValueOnce({ id: 1, balance: 10 , username: 'name', 
      password: '123', status:'active'});

      const result = await calculationService.performTwoOperandsCalc(5, 3, 1, 'addition');

      expect(result).toBe(8);
      expect(recordService.createRecord).toHaveBeenCalledWith(1, 1, 5, '8');
      expect(userService.update).toHaveBeenCalled();
    });

    it('should throw InvalidOperatorException for unknown operator', async () => {
      jest.spyOn(operationRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(calculationService.performTwoOperandsCalc(5, 3, 1, 'unknown')).rejects.toThrow(
        InvalidOperatorException,
      );
    });

    // Add more test cases for other operators and scenarios
  });

  describe('performSquareRoot', () => {
    it('should calculate square root correctly', async () => {
      const operation = { id: 2, type: 'square-root', cost: 3 };
      jest.spyOn(operationRepository, 'findOne').mockResolvedValueOnce(operation);
      jest.spyOn(recordService, 'createRecord').mockImplementation();
      jest.spyOn(userService, 'get').mockResolvedValueOnce({ id: 1, balance: 10 , username: 'name', 
      password: '123', status:'active'});

      const result = await calculationService.performSquareRoot(9, 1);

      expect(result).toBe(81);
      expect(recordService.createRecord).toHaveBeenCalledWith(1, 2, 3, '81');
      expect(userService.update).toHaveBeenCalled();
    });

    // Add more test cases for other scenarios
  });

  describe('generateRandomString', () => {
    it('should generate random string correctly', async () => {
      const operation = { id: 3, type: 'random-string', cost: 0 };
      const mockResponse = {
        data: 'random-string-value',
      };
      const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
      jest.spyOn(operationRepository, 'findOne').mockResolvedValueOnce(operation);
      jest.spyOn(recordService, 'createRecord').mockImplementation();
      jest.spyOn(userService, 'get').mockResolvedValueOnce({ id: 1, balance: 10 , username: 'name', 
      password: '123', status:'active'});

      const result = await calculationService.generateRandomString(1);

      expect(result).toBe('random-string-value');
      expect(axiosGetSpy).toHaveBeenCalledWith(
        'https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&format=plain',
      );
      expect(recordService.createRecord).toHaveBeenCalledWith(1, 3, 0, 'random-string-value');
      expect(userService.update).toHaveBeenCalled();
    });

    it('should throw ThirdPartyException on error', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('API error'));
      jest.spyOn(operationRepository, 'findOne').mockResolvedValueOnce({ id: 3, type: 'random-string', cost: 0 });

      await expect(calculationService.generateRandomString(1)).rejects.toThrow(ThirdPartyException);
    });

  });
});