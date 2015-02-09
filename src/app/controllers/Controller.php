<?php

class Controller {
	protected $pdo;
	protected $app;

	//implement HTTP listener
	function __construct($pdo, $app, $requireAuth = true){
		$this->pdo = $pdo;
		$this->app = $app;

		switch($_SERVER['REQUEST_METHOD']){
			case 'GET':
				if(method_exists($this, $_GET['action'])){
					$action = $_GET['action'];
					unset($_GET['action']);
					echo $this->$action();
				}
				break;
			//case 'HEAD':
			//	break;
			case 'POST':
				if(method_exists($this, $_POST['action'])){
					$action = $_POST['action'];
					unset($_POST['action']);
					echo $this->$action();
				}
				break;
			//case 'PUT':
			//	break;
			default:
				throw new HttpException('METHOD_NOT_IMPLEMENTED', 501);
		}
	}

	public function checkAuthenticated(){
		if(!isset($_SESSION["logged_in"]) || $_SESSION["logged_in"] !== true){
			throw new HttpException("UNAUTHORIZED", 401);
		}
	}
}