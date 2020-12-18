const AWS = require('aws-sdk');

const pubSubBucket = 'PubSub_S3Bucket';
const pubSubKey = 'PubSub_S3Key';

const s3 = new AWS.S3();

function shouldDownload(eventRecord) {
  return eventRecord && eventRecord.body && eventRecord.body === '#';
}

async function parse(eventRecord) {
  if (!shouldDownload(eventRecord)) return Promise.resolve(eventRecord.body);

  if (!eventRecord.MessageAttributes[pubSubBucket]) {
    return Promise.resolve(eventRecord.body);
  }

  const bucket = eventRecord.MessageAttributes[pubSubBucket].StringValue;
  const key = eventRecord.MessageAttributes[pubSubKey].StringValue;

  const params = { Bucket: bucket, Key: key };

  try {
    const data = await s3.getObject(params).promise();
    const dataBuffer = data.Body;
    return dataBuffer;
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
}

module.exports = {
  parse,
  shouldDownload
};
