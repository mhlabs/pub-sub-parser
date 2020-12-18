const tested = require('./sqsEventParser');

const testRecord = require('../testData/sqsRecord');

describe('download', () => {
  it('should download large messages', () => {
    expect(tested.shouldDownload(testRecord)).toBeTruthy();
  });
  it('should not download inline messages', () => {
    expect(tested.shouldDownload({ body: '"{"id": 1}"' })).toBeFalsy();
  });
});

describe('s3 params', () => {
  it('should parse params from event record', () => {
    const params = tested.getS3Params(testRecord);
    expect(params.Bucket).toBe('s3-bucket');
    expect(params.Key).toBe('s3-key');
  });
});

describe('convert data', () => {
  it('should convert data as string', () => {
    const data = tested.convertData(Buffer.from([65, 66, 67]));
    expect(data).toBe('ABC');
  });
});
