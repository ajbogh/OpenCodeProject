<?php 

class Genders{

	private $genders = array(
		"Female" => "Female",
		"Male" => "Male",
		"Agender" => "Agender",
		"Androgynous" => "Androgynous",
		"Bigender" => "Bigender",
		"Gender Fluid" => "Gender Fluid",
		"Gender Nonconforming" => "Gender Nonconforming",
		"Gender Questioning" => "Gender Questioning",
		"Intersex" => "Intersex",
		"Neither" => "Neither",
		"Neutrois" => "Neutrois",
		"Non-binary" => "Non-binary",
		"Other" => "Other",
		"Pangender" => "Pangender",
		"Transgender" => "Transgender",
		"Transgender FTM" => "Transgender FTM",
		"Transgender MTF" => "Transgender MTF",
		"Transfeminine" => "Transfeminine",
		"Transmasculine" => "Transmasculine"
	);

	public function __get($code){
		if(array_key_exists($code, $this->genders)){
			return $this->genders[$code];
		}
	}

	public function getFullList(){
		return $this->genders;
	}

	/**
	 * Returns a string of HTML options representing the entire options list. The values are the codes
	 * while the text will be the country name. 
	 * A blank default option can be added, with placeholder text, and a default option can be selected.
	 * @param  [type] $withBlank   true if the first position should be blank, null or false if no first position.
	 * @param  [type] $placeholder $withBlank must be true to use this placeholder. Set to any string to display placeholder text.
	 * @param  [type] $default [description]
	 * @return [type]              [description]
	 */
	public function getHTMLOptionsList($withBlank, $placeholder, $default=null){
		$out = "";
		if($placeholder){
			$out .= '<option value="" disabled '.(is_null($default)?'selected':'').' class="placeholder">'.$placeholder.'</option>';
		}
		if($withBlank === true){
			$out .= '<option value=""></option>';
		}
		foreach($this->genders as $code=>$name){
			$out .= '<option value="'.$code.'" '.($code == $default?'selected':'').'>'.htmlentities($name).'</option>';
		}
		return $out;
	}
}