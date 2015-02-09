<?php
require_once('../bootstrap.inc.php');
require_once('../../config/config.inc.php');

class LoginController extends Controller {
	function __construct($pdo, $app){
		parent::__construct($pdo, $app);
	}

	/**
	 * creates a new user.
	 * @return [JSON String] JSON encoded user object.
	 */
	public function login(){
		//no auth necessary
		if(isset($_POST["username"]) && isset($_POST["password"])){

			$users = new Users($this->pdo, $this->app['pwOptions']);
			$user = $users->login($_POST['username'], $_POST['password']);
		
			//if valid user, set session values with user info
			if(!is_null($user)){
				$_SESSION["logged_in"] = true;
				foreach($user as $key=>$value){
					$_SESSION[$key] = $value;
				}
				return json_encode($user->userInfo);
			}else{
				throw new HttpException("BAD_USERNAME_PASSWORD", 401);
			}
		}else{
			throw new HttpException('BAD_REQUEST', 400);
		}
	}
}

$userController = new LoginController($pdo, $app);