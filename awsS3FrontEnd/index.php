

<?php 
header('Access-Control-Allow-Origin: *');
include('header.php');
?>
<title>AWS S3</title>
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
<script src="aws_config.js"></script>
<script src="s3_upload.js"></script>

<div class="container">	
	<h2>Amazon S3 File Upload using JavaScript</h2>	
	<br>		
	<form id="uploadForm" method='post' enctype="multipart/form-data">
		<h3>Upload File</h3><br/>
		<span id="showMessage" style="display:none;color:red;">File uploaded to Amazon server.</span>	
		<input type='file' name="upFile" id="upFile" required="" /> 
		<br>

		<span id="upload_status"></span>
		<input type='submit' value='Upload'/>	

		

	</form>	
	
</div>
<?php include('footer.php');?>
