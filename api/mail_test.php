<?php
    
    // require_once("../classes/ConnectDB.php");
    
    class SFMailer {
        
        
        function getCompiledTemplate($templateURL, $arr) {
            $template = file_get_contents($templateURL);
            
            foreach($arr as $key => $value) {
                $template = str_replace('{{'.$key.'}}', $value, $template);
            }
            
            return $template;
        }
        
        
        function send($to, $from, $subject, $body) {
            require '../sendgrid/vendor/autoload.php';
            
            if(!$from) {
                $from = 'support@stylflip.com';
            }
            
            $sendgrid = new SendGrid('rspatil6181', 'rohan6181');
            
            $email = new SendGrid\Email();
            $email
            ->addTo($to)
            ->setFrom($from)
            ->setSubject($subject)
            ->setText($body)
            ->setHtml($body)
            ;
            
            $sendgrid->send($email);
        }
        
    };
    
    
    $sf = new SFMailer();
    
    $variables = array();
    $variables['name'] = "Robert";
    $body = $sf -> getCompiledTemplate('signUp.html', $variables);
    
    $sf -> send('sushantahirrao@gmail.com', false, 'Registrattion Successful!', $body);
?>