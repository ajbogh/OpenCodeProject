<?php

class User {
	public $userInfo = array();
	private $pdo;
	private $pwOptions;

	/**
	 * Constructs a user object given an associative array of user information.
	 * @param [assoc] $userInfo [username, password, confirmPassword (opt), email, displayName, firstName, lastName, gender, dob, state]
	 */
	public function __construct($userInfo, $pdo, $pwOptions){
		$this->userInfo = $userInfo;
		$this->pdo = $pdo;
		$this->pwOptions = $pwOptions;
	}

	public function create(){
		$query = "INSERT INTO users (username, password, email, date_created, display_name, first_name, last_name, gender, dob, state_region, country) 
					VALUES(:username, :password, :email, NOW(), :display_name, :first_name, :last_name, :gender, :dob, :state_region, :country)";
		$this->pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
		$q = $this->pdo->prepare($query);
		$result = false;
		if(empty($this->userInfo['username']) || empty($this->userInfo['password'])){
			throw new Exception("Username and Password are required", 1);
		}
		if(isset($this->userInfo['confirmPassword']) && $this->userInfo['confirmPassword'] !== $this->userInfo['password']){
			throw new Exception("Password and Confirmation do not match", 2);
		}
		try{
			$result = $q->execute(array(
					':username'=>$this->userInfo['username'],
					':password'=>password_hash($this->userInfo['password'], PASSWORD_BCRYPT, ["cost" => $this->pwOptions['cost'], "salt" => $this->pwOptions['salt']]),
					':email'=>$this->userInfo['email'],
					':display_name'=>(isset($this->userInfo['displayName']) ? $this->userInfo['displayName'] : null),
					':first_name'=>(isset($this->userInfo['firstName']) ? $this->userInfo['firstName'] : null),
					':last_name'=>(isset($this->userInfo['lastName']) ? $this->userInfo['lastName'] : null),
					':gender'=>(isset($this->userInfo['gender']) ? $this->userInfo['gender'] : null),
					':dob'=>(isset($this->userInfo['dob']) ? $this->userInfo['dob'] : null),
					':state_region'=>(isset($this->userInfo['state']) ? $this->userInfo['state'] : null),
					':country'=>(isset($this->userInfo['country']) ? $this->userInfo['country'] : null)
				)
			);
			$this->userInfo['id'] = $this->pdo->lastInsertId();
			return $this;
		}catch(Exception $ex){
			if($ex->errorInfo[0] == 23000){
				throw new Exception('Username already exists', 3);
			}else{ //bubble exception up
				throw new Exception($ex->errorInfo[2]);
			}
		}
	}
}