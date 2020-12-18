const tested = require('./sqsEventParser');

describe('download', () => {
  it('should download large messages', () => {
    expect(tested.shouldDownload({ body: '#' })).toBeTruthy();
  });
  it('should not download inline messages', () => {
    expect(tested.shouldDownload({ body: '"{"id": 1}"' })).toBeFalsy();
  });
});
