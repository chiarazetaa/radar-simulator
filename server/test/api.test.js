const supertest = require('supertest');
const { expect } = require('chai');
const { app } = require('../app.js');

const request = supertest(app);

describe('API Tests', function () {
  it('Check terms', async function () {
    const response = await request
      .post('/check-terms')
      .send({ url: 'https://www.wikipedia.org/' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('lang');
    expect(response.body).to.have.property('targetURL');
    expect(response.body).to.have.property('matchingString');
  });
});