const request = require('supertest');
const { app, server } = require('../index'); // Import app and server

describe('Calculator API', () => {

  // Test for addition
  it('should return the sum of two numbers', async () => {
    const response = await request(app).get('/add?num1=5&num2=3');
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(8);
  });

  // Test for subtraction
  it('should return the difference of two numbers', async () => {
    const response = await request(app).get('/subtract?num1=5&num2=3');
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(2);
  });

  // Test for multiplication
  it('should return the product of two numbers', async () => {
    const response = await request(app).get('/multiply?num1=5&num2=3');
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(15);
  });

  // Test for division
  it('should return the quotient of two numbers', async () => {
    const response = await request(app).get('/divide?num1=6&num2=3');
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(2);
  });

  // Test for division by zero
  it('should return an error when dividing by zero', async () => {
    const response = await request(app).get('/divide?num1=5&num2=0');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Cannot divide by zero');
  });

  // Test for missing parameters
  it('should return an error when parameters are missing', async () => {
    const response = await request(app).get('/add');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Please provide two numbers');
  });

  // Close the server after tests
  afterAll(() => {
    server.close();
  });
});
