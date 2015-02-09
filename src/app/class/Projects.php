<?php

/**
 * Projects holds an array of projects and has methods to select projects.
 */

class Projects {
	private $projects = [];
	private $pdo;
	public $length = 0;

	/**
	 * Projects is a container for selecting a set of projects.
	 * @param {database} $pdo The PDO connection.
	 */
	public function __construct($pdo){
		$this->pdo = $pdo;
	}

	public function select($limit=25, $offset=0){
		$query = "SELECT p.id, title, date_submitted, subtext, description, thumbnail_filename, project_url, u.id as user_id, display_name, first_name, last_name, username 
					FROM projects as p, users as u 
					WHERE p.submitted_by=u.id 
					ORDER BY date_submitted";
		$stmt = $this->pdo->query($query);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	 * Creates a new project in the database.
	 * @param  [string] $title              Project title
	 * @param  [string] $subtext            Subtext that provides links or bits of other info
	 * @param  [string] $description        The full project description
	 * @param  [string] $thumbnail_filename The filename of a thumbnail to use
	 * @param  [int] $userid                The ID of the user submitting the project
	 * @return [array]                      The result of the database insert
	 */
	public function create($title, $subtext=null, $description, $thumbnail_filename=null, $project_url, $userid){
		$query = "INSERT INTO projects (title, date_submitted, subtext, description, thumbnail_filename, project_url, submitted_by) 
					VALUES(:title, :date_submitted, :subtext, :description, :thumbnail_filename, :project_url, :submitted_by)";
		$q = $this->pdo->prepare($query);
		$q->execute(array(
				':title'=>$title,
				':date_submitted'=>'NOW()',
				':subtext'=>$subtext,
				':description'=>$description,
				':thumbnail_filename'=>$thumbnail_filename,
				':project_url'=>$project_url,
				':submitted_by'=>$userid
			)
		);
		return $this->pdo->lastInsertId();
	}
}