function Frigg($){
	this.directives = [];
	self = this;

	function linkViews(){
		var linkViews = $("[frg-link-view]"), attrVal, attrSplit, easing="none", $lv, $lvElem;
		function createFactory($lvElem){
			return function(){
				//hide any active views within this container
				$lvElem.parents("[frg-view-container]").first().find(".active").removeClass("active").hide();
				$lvElem.show().addClass("active");
			};
		}
		for(var i=0; i<linkViews.length; i++){
			$lv = $(linkViews[i]);
			attrVal = $lv.attr("frg-link-view");
			attrSplit = attrVal.split(":");
			if(attrSplit.length == 2){
				easing = attrSplit[1];
			}
			attrVal = attrSplit[0];

			$lvElem = $("#"+attrVal);
			$lv.on("click", createFactory($lvElem));

			if(!$lvElem.hasClass("active")){
				$lvElem.hide();
			}
		}
	}
	this.directives.push(linkViews);

	function hidden(){
		var hidden = $("[frg-hidden]"), $elem;
		for(var i=0; i<hidden.length; i++){
			$(hidden[i]).hide().removeClass("active");
		}
	}
	this.directives.push(hidden);
	

	this.App = {
		create: function(){
			// find all data-frg elements and apply necessary events.
			for(var i = 0; i < self.directives.length; i++){
				self.directives[i]();
			}

			//start router, clicks on whatever view is in the hash
			var hash = document.location.hash;
			hash = hash.replace("#", "");
			$("[frg-link-view='"+hash+"']").click();
		}
	};
}

Frg = new Frigg($);