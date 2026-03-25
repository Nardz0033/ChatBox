<?php
echo file_exists("data.json") ? file_get_contents("data.json") : "[]";
?>
