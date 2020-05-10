//https://medium.com/@swappyp20/automated-video-transcoding-in-amazon-web-services-using-serverless-approach-ae7560c9890d


'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    apiVersion: '2012–09–25'
});
var eltr = new AWS.ElasticTranscoder({
    apiVersion: '2012–09–25',
    region: 'us-west-2'
});
exports.handler = function(event, context) {
    console.log('Executing Elastic Transcoder Orchestrator');
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    var pipelineId = '1572941177908-v4e06t';
    if (bucket !== 'bucketName') {
        context.fail('Incorrect Video Input Bucket');
        return;
    }
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces  
    //var newKey = key.split('.')[0];
    var newKey = event.Records[0].s3.object.key;
    var params = {
        PipelineId: pipelineId,
        OutputKeyPrefix: 'sterkla_mp4/',
        Input: {
            Key: srcKey,
            FrameRate: 'auto',
            Resolution: 'auto',
            AspectRatio: 'auto',
            Interlaced: 'auto',
            Container: 'auto'
        },
        Outputs: [{
            Key: 'mp4-' + newKey + '.mp4',
            ThumbnailPattern: 'thumbs-' + newKey + '-{count}',
            PresetId: '1351620000001-000040', //Generic 720p

        }]
    };
    console.log('Starting Job');
    eltr.createJob(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
        context.succeed('Job well done');
    });
};