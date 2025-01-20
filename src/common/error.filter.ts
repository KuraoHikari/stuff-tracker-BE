import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException, PrismaClientKnownRequestError)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        error: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: exception.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
      });
    } else if (exception instanceof PrismaClientKnownRequestError) {
      let message = 'Database error';
      switch (exception.code) {
        case 'P2002':
          message = 'Unique constraint failed';
          break;
        case 'P2003':
          message = 'Foreign key constraint failed';
          break;
        case 'P2004':
          message = 'A constraint failed on the database';
          break;
        case 'P2005':
          message = 'The value stored in the database is invalid for the field';
          break;
        case 'P2006':
          message = 'The provided value for the field is invalid';
          break;
        case 'P2007':
          message = 'Data validation error';
          break;
        case 'P2008':
          message = 'Failed to parse the query';
          break;
        case 'P2009':
          message = 'Failed to validate the query';
          break;
        case 'P2010':
          message = 'Raw query failed';
          break;
        case 'P2011':
          message = 'Null constraint violation';
          break;
        case 'P2012':
          message = 'Missing a required value';
          break;
        case 'P2013':
          message = 'Missing the required argument';
          break;
        case 'P2014':
          message = 'Relation violation';
          break;
        case 'P2015':
          message = 'Related record not found';
          break;
        case 'P2016':
          message = 'Query interpretation error';
          break;
        case 'P2017':
          message = 'Records for relation not found';
          break;
        case 'P2018':
          message = 'The required connected records were not found';
          break;
        case 'P2019':
          message = 'Input error';
          break;
        case 'P2020':
          message = 'Value out of range for the type';
          break;
        case 'P2021':
          message = 'The table does not exist in the current database';
          break;
        case 'P2022':
          message = 'The column does not exist in the current database';
          break;
        case 'P2023':
          message = 'Inconsistent column data';
          break;
        case 'P2024':
          message =
            'Timed out fetching a new connection from the connection pool';
          break;
        case 'P2025':
          message = 'Record not found';
          break;
        // Add more Prisma error codes as needed
      }
      response.status(400).json({
        error: message,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
