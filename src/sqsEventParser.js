const AWS = require('aws-sdk');

const pubSubBucket = 'PubSub_S3Bucket';
const pubSubKey = 'PubSub_S3Key';

const s3 = new AWS.S3();

function shouldDownload(eventRecord) {
  return (
    eventRecord &&
    eventRecord.body &&
    eventRecord.body === '#' &&
    eventRecord.messageAttributes &&
    eventRecord.messageAttributes[pubSubBucket]
  );
}

function getS3Params(eventRecord) {
  const bucket = eventRecord.messageAttributes[pubSubBucket].stringValue;
  const key = eventRecord.messageAttributes[pubSubKey].stringValue;

  return { Bucket: bucket, Key: key };
}

function convertResponse(data) {
  const messageObject = data.toString('utf-8');
  const json = JSON.parse(messageObject);

  return json.Message;
}

async function parse(eventRecord) {
  if (!shouldDownload(eventRecord)) return Promise.resolve(eventRecord.body);

  const params = getS3Params(eventRecord);

  try {
    const data = await s3.getObject(params).promise();
    const dataBuffer = data.Body;
    return convertResponse(dataBuffer);
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`);
  }
}

module.exports = {
  convertResponse,
  getS3Params,
  parse,
  shouldDownload
};
