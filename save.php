<?php
$file = "data.json";
$messages = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

$data = json_decode(file_get_contents("php://input"), true);

// DELETE MESSAGE
if (isset($data["delete"])) {
	    array_splice($messages, $data["delete"], 1);
	        file_put_contents($file, json_encode($messages, JSON_PRETTY_PRINT));
	            exit;
	            }

          // MARK AS SEEN (only messages NOT from current user)
         if (isset($data["seenBy"])) {
         $viewer = $data["seenBy"];

         foreach ($messages as &$msg) {
         if ($msg["name"] !== $viewer) {
         $msg["seen"] = true;
         }
        }

        file_put_contents($file, json_encode($messages, JSON_PRETTY_PRINT));
        exit;
         }    

	        // ADD MESSAGE
	      $name = htmlspecialchars($data["name"]);
	      $message = htmlspecialchars($data["message"]);
	      $time = date("Y-m-d H:i:s");

	       $messages[] = [
	       "name"=>$name,
	       "message"=>$message,
	       "time"=>$time,
	       "seen"=>false
	        ];

	      file_put_contents($file, json_encode($messages, JSON_PRETTY_PRINT));

	        // XML SAVE
	     $xmlFile = "data.xml";
	      $xml = file_exists($xmlFile) ? simplexml_load_file($xmlFile) : new SimpleXMLElement("<messages/>");

	       $msg = $xml->addChild("message");
	       $msg->addChild("name", $name);
	       $msg->addChild("text", $message);
	       $msg->addChild("time", $time);

	       $xml->asXML($xmlFile);

	       echo "OK";
	        ?>
	            	    	                    
	            	    
	            
