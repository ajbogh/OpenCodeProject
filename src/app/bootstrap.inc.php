<?php


$app = []; //application variables
$lang = []; //language variables

function injectLanguage(){
	global $lang;
	//load default language
	require_once('locale/en/en_US/strings.php');

	//TODO: figure out headers
	//figure out query strings
	//find directory if language is set
	//load language if it's available to override default
}

function getLang($id){
	global $lang;
	return $lang[$id];
}
function echoLang($id){
	echo getLang($id);
}

function __autoload($class_name) {
	if(file_exists($_SERVER['DOCUMENT_ROOT'].'/app/class/' . $class_name . '.php')){
		include $_SERVER['DOCUMENT_ROOT'].'/app/class/' . $class_name . '.php';	
	}else if(file_exists($_SERVER['DOCUMENT_ROOT'].'/app/controllers/' . $class_name . '.php')){
		include $_SERVER['DOCUMENT_ROOT'].'/app/controllers/' . $class_name . '.php';
	}else{
		throw new Exception("AUTOLOAD_FILE_NOT_FOUND: ".$class_name, 404);
	}
}

session_start();