<?php
	require '../sendgrid/vendor/autoload.php';
	
    $sendgrid = new SendGrid('rspatil6181', 'rohan6181');
	
	$email = new SendGrid\Email();
	$email
		->addTo('rohanpatil6181@rediffmail.com')
		->setFrom('rspatil6181@gmail.com')
		->setSubject('Subject goes here')
		->setText('Hello World!')
		->setHtml('<strong>Hello World!</strong>')
	;

	try {
    $sendgrid->send($email);
	} catch(\SendGrid\Exception $e) {
    echo $e->getCode();
    foreach($e->getErrors() as $er) {
        echo $er;
    }
}
?>