<?php

/**
 * Articles holds an array of articles and has methods to select articles.
 */

class Articles {
	private $articles = [];
	private $pdo;

	/**
	 * Projects is a container for selecting a set of projects.
	 * @param {database} $pdo The PDO connection.
	 */
	public function __construct($pdo){
		$this->pdo = $pdo;
	}

	public function select($limit=25, $offset=0){
		$query = "SELECT a.id, title, datesubmitted, lastupdated, createdby, article, display_name, first_name, last_name, username 
					FROM articles as a, users as u 
					WHERE a.createdby=u.id 
					ORDER BY datesubmitted";
		$stmt = $this->pdo->query($query);
		$this->articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $this->articles;
	}
}