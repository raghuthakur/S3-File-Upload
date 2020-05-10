$(document).ready(function() {
    $("#uploadForm").submit(function() {
        var bucket = new AWS.S3({ params: { Bucket: 'bucketName', ACL: 'public-read' } });

        var uploadFiles = $('#upFile')[0];
        var upFile = uploadFiles.files[0];
        if (upFile) {
            var uploadParams = { Key: upFile.name, ContentType: upFile.type, Body: upFile };
            bucket.upload(uploadParams).on('httpUploadProgress', function(evt) {
                console.log("File Uploading: " + parseInt((evt.loaded * 100) / evt.total) + '%');
                $("#upload_status").html("File Uploading: " + parseInt((evt.loaded * 100) / evt.total) + '%');

            }).send(function(err, data) {




                $('#upFile').val(null);
                $("#showMessage").show();
            });
        }
        return false;
    });
});