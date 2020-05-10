const AWS = require('aws-sdk');
const fs = require('fs');
let uploadImages = (files, callback) => {

    var s3 = new AWS.S3();

    s3.config.update({
        accessKeyId: '********************',
        secretAccessKey: '****************************************'
    });
    s3.config.region = 'us-west-2';
    let fileData = fs.readFileSync(files.images[0].path);
    var params = {
        Bucket: 'bucketName',
        Key: files.images[0].originalFilename,
        Body: fileData,
        ContentType: files.images[0].type,
        ACL: 'public-read'
    };


    // s3.upload(params).on('httpUploadProgress', function(evt) {
    //     console.log("File Uploading: " + parseInt((evt.loaded * 100) / evt.total) + '%');
    // }).send(function(err, data) {
    //     callback(data)

    // });




    s3.putObject(params, function(err, pres) {
        if (err) {
            console.log("Error uploading image: ", err);
            return;
        } else {
            console.log("uploading image successfully URL: https://bucketName.s3-us-west-2.amazonaws.com/" + files.images[0].originalFilename);
            callback(files.images[0].originalFilename);
            return
        }
    });




}

/*End image upload common function*/



/*===================updateProfile=============================*/
router.post('/uploadImages', (req, res) => {

    console.log('uploadImages');

    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        uploadImages(files, (images) => {

            //Trasncoder Fucntion
            transcodeVideo(files.images[0].originalFilename, (ThumbnailRes) => {

                let retrunData = { "statusCode": 200, "statusMessage": "Images", "result": ThumbnailRes }

                res.send(retrunData);

            });
        });

    });
});








function transcodeVideo(key, callback) {

    var transcoder = new AWS.ElasticTranscoder({
        apiVersion: '2012–09–25',
        region: 'us-west-2',
        accessKeyId: '********************',
        secretAccessKey: '****************************************',
        endpoint: 'elastictranscoder.us-west-2.amazonaws.com'
    });

    let config = {
        videoBucket: 'outsterklaimages',
        transcode: {
            video: {
                pipelineId: '1572941177908-v4e06t',
                outputKeyPrefix: 'sterkla_mp4/', // put the video into the transcoded folder
                presets: [ // Comes from AWS console
                    { presetId: '1351620000001-000061' }
                ]
            }
        }
    }


    let params = {
        PipelineId: config.transcode.video.pipelineId, // specifies output/input buckets in S3 
        Input: {
            Key: key,
        },
        OutputKeyPrefix: config.transcode.video.outputKeyPrefix,
        Outputs: [{
            Key: 'mp4-' + key + '.mp4',
            ThumbnailPattern: `${key}-{count}`,
            PresetId: '1351620000001-000061',
        }]
    };
    transcoder.createJob(params, function(err, data) {


        if (!!err) {
            console.log(err);
            return;
        }
        let jobId = data.Job.Id;
        console.log('AWS transcoder job created (' + jobId + ')');
        transcoder.waitFor('jobComplete', { Id: jobId }, callback(params.Outputs));
    });
};