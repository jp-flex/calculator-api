import { INestApplication } from "@nestjs/common";
import { RecordController } from "../../src/controllers/record.controller";
import { RecordService } from "../../src/services/record.service";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { Record } from "../../src/entities/record.entity";
import { GetRecord } from "../../src/dtos/get.record";
import { Operation } from "../../src/entities/operation.entity";

describe('RecordController', () => {
    let app: INestApplication;
    let recordService: RecordService;

    const mockJwtMiddleware = (req, res, next) => {
        req.user = {
          id: '1',
        };
        next();
      };
  
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        controllers: [RecordController],
        providers: [
          {
            provide: RecordService,
            useValue: {
              getRecords: jest.fn(),
              softDeleteRecord: jest.fn(),
            },
          },
        ],
      }).compile();


  
      app = moduleFixture.createNestApplication();
      app.use(mockJwtMiddleware);
      recordService = moduleFixture.get<RecordService>(RecordService);
      await app.init();
    });
  
    describe('GET /records', () => {
      it('should return records and total count', async () => {
        const amount = 10;
        const userBalance = 200;
        const userId = 1;
        const id = 1;
        const type = 'addition';
        const createdAt = new Date();
        const operationResponse = "100";
        const deletedAt = null;
        const op = new Operation();
        const records = [{ id: id, user_id: userId, user_balance: userBalance, amount: amount, operation: op, 
            operation_response: operationResponse , created_at:createdAt, deleted_at: deletedAt} as Record];

        const expectedTotal = 1;
       
        jest.spyOn(recordService, "getRecords").mockImplementation( async () => {
            return  {
                records: records,
                total: expectedTotal,
              }
        }
           
        );
  
        const response = await request(app.getHttpServer()).get('/records').query({
          page: 1,
          limit: 10,
          operation: type,
          amount: amount.toString(),
          operationResponse: operationResponse,
          userBalance: userBalance,
        });
  
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          records: [{id: 1, userId: userId, userBalance: userBalance, amount: amount, operation: op, 
            operationResponse: operationResponse , createdAt:createdAt.toISOString(), deletedAt: null}],
          total: expectedTotal,
        });
        expect(recordService.getRecords).toHaveBeenCalledWith(
            "1",
             {limit: "10", page: "1"},
              {amount: "10", "operation_response": "100",
               "type": "addition", "user_balance": "200"}
        );
      });
    });
  
    describe('DELETE /records/:id', () => {
      it('should delete the record', async () => {
        const recordId = 123;

        jest.spyOn(recordService, "softDeleteRecord").mockImplementation( async () => {});
         
        const response = await request(app.getHttpServer()).delete(
          `/records/${recordId}`,
        );
  
        expect(response.status).toBe(204);
        expect(recordService.softDeleteRecord).toHaveBeenCalledWith(recordId);
      });
  
      it('should return 404 if record not found', async () => {
        const recordId = 999;
        jest.spyOn(recordService, "softDeleteRecord")
            .mockRejectedValue(new Error( `Not found Record with id: ${recordId}`));
  
        const response = await request(app.getHttpServer()).delete(
          `/records/${recordId}`,
        );
  
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual(`Not found Record with id: ${recordId}`);
        expect(recordService.softDeleteRecord).toHaveBeenCalledWith(recordId);
      });
    });
  
    afterAll(async () => {
      await app.close();
    });
  });
