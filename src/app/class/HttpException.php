<?php

class HttpException extends Exception {
	public function __construct($message, $code=0){
		parent::__construct($message, $code);
	}

	public function __toString(){
		$message = $this->getCode().": ".htmlentities($this->getMessage())." in file ".$this->getFile().":".$this->getLine()."\n\n".$this->getTraceAsString();
		error_log($message);
      	ob_end_clean(); // try to purge content sent so far
		header('HTTP/1.1 '.($this->getCode()?$this->getCode():500).' '.$this->getMessage());
		return $message;
	}

	public function getException(){
		print $this; // This will print the return from the above method __toString()
	}
	
	public static function getStaticException($exception){
		$exception->getException(); // $exception is an instance of this class
	}
}

set_exception_handler('HttpException', 'getStaticException');