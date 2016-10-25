<?php

/*
 *	Mailer class
 */

 
class Mailer {
	
	/*	Send email	*/

	function sendEmail ($to, $subject, $msg, $from) {
		return mail($to, $subject, $msg, $from);			
	}
    
    function getCompiledTemplate($templateURL, $arr) {
        $template = file_get_contents($templateURL);
        
		if(count($arr) > 0) {
			foreach($arr as $key => $value) {
	            $template = str_replace('{{'.$key.'}}', $value, $template);
	        }
		}
        
        return $template;
    }
    
    
    function send($to, $from, $subject, $body) {
        require '../sendgrid/vendor/autoload.php';
        
        if(!$from) {
            $from = 'support@stylflip.com';
        }
        
        $sendgrid = new SendGrid('stylflip', 'placard2015'); //$sendgrid = new SendGrid('rspatil6181', 'rohan6181');
        
        $email = new SendGrid\Email();
        $email
        ->addTo($to)
		->addCc('support@stylflip.com')
        ->setFrom($from)
        ->setSubject($subject)
        ->setText($body)
        ->setHtml($body)
        ;
        
        $sendgrid->send($email);
    }
	
	
	function sendTest($to, $from, $subject, $body) {
        require '../sendgrid/vendor/autoload.php';
        
        if(!$from) {
            $from = 'support@stylflip.com';
        }
        
        $sendgrid = new SendGrid('rspatil6181', 'rohan6181');
        
        $email = new SendGrid\Email();
        $email
        ->addTo($to)
		->addCc('sushantahirrao@gmail.com')
        ->setFrom($from)
        ->setSubject($subject)
        ->setText($body)
        ->setHtml($body)
        ;
        
        $sendgrid->send($email);
    }
	
};

?>