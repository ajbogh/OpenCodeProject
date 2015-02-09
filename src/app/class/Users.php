<?php

/**
 * Projects holds an array of projects and has methods to select projects.
 */

class Users {
	private $users = [];
	private $pdo;
	public $length = 0;

	/**
	 * Projects is a container for selecting a set of projects.
	 * @param {database} $pdo The PDO connection.
	 */
	public function __construct($pdo, $pwOptions){
		$this->pdo = $pdo;
		$this->pwOptions = $pwOptions;
	}

	public function select($limit=25){
		$query = "SELECT id, title, date_submitted, subtext, description, thumbnail_filename, submitted_by 
				FROM projects as p, users as u 
				WHERE p.submitted_by=u.id 
				ORDER BY date_submitted";
		$this->projects = $pdo->query($query);
	}

	public function login($usernameOrEmail, $password){
		$query = "SELECT id, username, email, last_login, date_created, display_name, first_name, last_name, gender, dob, state_region, country 
				FROM users
				WHERE (username=:username OR email=:username) AND password=:password";
		$q = $this->pdo->prepare($query);
		$q->execute(array(
				':username'=>$usernameOrEmail,
				':password'=>password_hash($password, PASSWORD_BCRYPT, ["cost" => $this->pwOptions['cost'], "salt" => $this->pwOptions['salt']])
			)
		);
		$result = $q->fetch(PDO::FETCH_ASSOC);
		if($result !== false){
			$query = "INSERT INTO USERS (last_login) 
				VALUES (NOW())
				WHERE (id=:id)
				LIMIT 1";
			$q = $this->pdo->prepare($query);
			$q->execute(array(
					':id'=>$result['id']
				)
			);
			$user = new User($result, $this->pdo, $this->pwOptions);
			return $user;
		}else{
			return null;
		}
		
	}
}