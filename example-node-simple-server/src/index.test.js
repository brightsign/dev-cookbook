const http = require('http');
const diClass = require('@brightsign/deviceinfo');


describe('HTTP Server Response', () => {
  let server = require('./index')
  const port = 13131;

  afterAll(() => {
    server.close();
  });

  it('should respond with JSON containing mocked device info', done => {
    http.get(`http://localhost:${port}`, res => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const receivedData = JSON.parse(data);

        // Verify that the response contains the mocked device info
        expect(receivedData.model).toBe('MockModel');
        expect(receivedData.osVersion).toBe('MockOSVersion');
        expect(receivedData.serialNumber).toBe('MockSerialNumber');
        done();
        
      });
    }).on('error', err => {
      done(err);
    });
  });
});
