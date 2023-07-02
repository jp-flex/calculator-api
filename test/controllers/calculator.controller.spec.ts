import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CalculationService } from '../../src/services/calculation.service';
import { CalculatorController } from '../../src/controllers/calculator.controller';
import { InvalidOperatorException } from '../../src/exceptions/invalid.operator.exception';
import { DivisionByZeroException } from '../../src/exceptions/division.by.zero.exception';
import { ZeroBalanceException } from '../../src/exceptions/zero.balance.exception';
import { InvalidOperandsException } from '../../src/exceptions/invalid.operatands.exception';

describe('CalculatorController', () => {
  let app: INestApplication;
  let calculationService: CalculationService;

  const mockJwtMiddleware = (req, res, next) => {
    req.user = {
      id: '1',
    };
    next();
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
      providers: [{
        provide: CalculationService,
        useValue: {
        performArithmeticCalc: jest.fn(),
        performNonArithmeticCalc: jest.fn(),
        getOperations: jest.fn(),
        },
      }],
      
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(mockJwtMiddleware);
    await app.init();

    calculationService = moduleFixture.get<CalculationService>(CalculationService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /calculator/arithmetic-operation/:operator', () => {
    it('should return the result of arithmetic operation', async () => {
      const operandsDto = { operands: [5, 4] };
      const expectedResult = { result: 9 };

      jest.spyOn(calculationService, 'performArithmeticCalc').mockResolvedValueOnce(expectedResult.result);

      const response = await request(app.getHttpServer())
        .post('/calculator/arithmetic-operation/addition')
        .send(operandsDto)
        .expect(201);

      expect(response.body).toEqual(expectedResult);
    });

    it('should handle DivisionByZeroException and return 400 Bad Request', async () => {
      const operandsDto = { operands: [5, 0] };

      jest.spyOn(calculationService, 'performArithmeticCalc')
        .mockRejectedValueOnce(new DivisionByZeroException());

      const response = await request(app.getHttpServer())
        .post('/calculator/arithmetic-operation/divide')
        .send(operandsDto)
        .expect(400);

      expect(response.body.message).toEqual('Division by zero is not allowed');
    });

    it('should handle ZeroBalanceException and return 400 Bad Request', async () => {
        const operandsDto = { operands: [5, 0] };
        const errorMsg = `There is not enough balance to proceed with this operation`;
  
        jest.spyOn(calculationService, 'performArithmeticCalc')
        .mockRejectedValueOnce(new ZeroBalanceException(errorMsg));
  
        const response = await request(app.getHttpServer())
          .post('/calculator/arithmetic-operation/divide')
          .send(operandsDto)
          .expect(400);
  
        expect(response.body.message).toEqual(errorMsg);
      });

      it('should handle InvalidOperandsException and return 400 Bad Request', async () => {
        const operandsDto = { operands: [5, 0] };
        const errorMsg = 'The number of operands is not correct for the operator';
  
        jest.spyOn(calculationService, 'performArithmeticCalc')
        .mockRejectedValueOnce(new InvalidOperandsException());
  
        const response = await request(app.getHttpServer())
          .post('/calculator/arithmetic-operation/divide')
          .send(operandsDto)
          .expect(400);
  
        expect(response.body.message).toEqual(errorMsg);
      });

  });

  describe('POST /calculator/non-arithmetic-operation/:operator', () => {
    it('should return the result of non-arithmetic operation', async () => {
      const expectedResult = { result: 'Result' };

      jest.spyOn(calculationService, 'performNonArithmeticCalc').mockResolvedValueOnce(expectedResult.result);

      const response = await request(app.getHttpServer())
        .post('/calculator/non-arithmetic-operation/someOperator')
        .expect(201);

      expect(response.body).toEqual(expectedResult);
    });

    it('should handle InvalidOperatorException and return 400 Bad Request', async () => {
      jest.spyOn(calculationService, 'performNonArithmeticCalc').mockRejectedValueOnce(new InvalidOperatorException());

      const response = await request(app.getHttpServer())
        .post('/calculator/non-arithmetic-operation/invalidOperator')
        .expect(400);

      expect(response.body.message).toEqual('Invalid operator');
    });

  });

  describe('GET /calculator/operations', () => {
    it('should return the list of operations', async () => {
      const operations = [
        { id: 1, operation: 'addition' },
        { id: 2, operation: 'subtraction' },
      ];
      const expectedResponse = { operations };

      jest.spyOn(calculationService, 'getOperations').mockImplementation(()=>
        Promise.resolve([ {id:1, type:'addition', cost: 2, records:null},
        {id:2, type:'subtraction', cost: 2, records:null} ]));

      const response = await request(app.getHttpServer())
        .get('/calculator/operations')
        .expect(200);

      expect(response.body).toEqual(expectedResponse);
    });

  });
});
