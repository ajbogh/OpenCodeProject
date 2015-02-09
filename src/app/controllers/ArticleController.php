<?php
require_once('../bootstrap.inc.php');
require_once('../../config/config.inc.php');

class UserController extends Controller {
	function __construct($pdo, $app){
		parent::__construct($pdo, $app);
	}

	public function 

	/**
	 * creates a new user.
	 * @return [JSON] JSON encoded user object.
	 */
	public function create(){
		//no auth necessary
		if(isset($_POST["username"])){
			$user = new User($_POST, $this->pdo, $this->app['pwOptions']);
			try{
				$result = $user->create();
				if(is_numeric($result->userInfo['id'])){ 
					return json_encode($user->userInfo); 
				}
			}catch(Exception $ex){
				switch($ex->getCode()){
					case 1:
						throw new HttpException("USERNAME_PASSWORD_REQUIRED", 409);
						break;
					case 2:
						throw new HttpException("PASSWORDS_DONT_MATCH", 409);
						break;
					case 3:
						throw new HttpException("USER_EXISTS", 409);
						break;
					default:
						throw new HttpException('USER_CREATION_ERROR', 500);
				}
			}
		}else{
			throw new HttpException('BAD_REQUEST', 400);
		}
	}
}

$userController = new UserController($pdo, $app);