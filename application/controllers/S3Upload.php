<?php
defined('BASEPATH') OR exit('No direct script access allowed');


class s3Upload extends CI_Controller {


	function __construct() 
		{ 
			parent::__construct();   
			
			$this->load->library("S3");

		}


	public function fileUpload()
	{

		$name=time().'_'.$_FILES['media']['name'];
		$tmp_name=$_FILES['media']['tmp_name'];

		
		
 		if($this->s3->putObjectFile($tmp_name, "aifabucket", $name, S3::ACL_PUBLIC_READ)) {

 			
 			echo S3URL.''.$name;die();

 		}else{
 			echo "<strong>Something went wrong while uploading your file... sorry.</strong>";die();
 		}	


 		/* function to delete empty test.txt file to subfolders /folder/ on S3 bucketname */
		// $this->s3->deleteObject('bucketName', 'testbucket/1574843063_new_arival.jpeg');
		// die();
	}


	public function listOfBucket()
	{
		$buckets = $this->s3->listBuckets();
		foreach ($buckets as $bucket) {
		    echo $bucket . "\n";
		}
	}




}
