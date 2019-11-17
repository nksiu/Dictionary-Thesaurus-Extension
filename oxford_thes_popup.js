document.addEventListener('DOMContentLoaded', function() {
	var submitPageButton = document.getElementById('enter_button');
	submitPageButton.addEventListener('click', function(){

		var numSyn = 5;
		var arr = [];

		var infield = document.getElementById('input_text').value;
		var api_key = '8e1520fa513ce2990706e6a73a93f57b'


		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;


		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4 && this.status == 200) {
				xhr.responseText.encoding = 'utf-8';
				var data = xhr.responseText;
				var jsonResponse = JSON.parse(data);

				var synonym = confirmType(jsonResponse);

				for (var i = 0; i < numSyn; i++){
					if (synonym.length == i){
						break;
					}
					var tmp_syn = JSON.stringify(synonym[i]);
					tmp_syn = clean_sentence(tmp_syn);
					arr.push(tmp_syn);
				}
				document.getElementById("thesaurus_input").innerHTML = "";
				document.getElementById("thesaurus_input").appendChild(makeUL(arr));
			}

			if (this.status == 404){
				document.getElementById("thesaurus_input").innerHTML = "No entry found matching supplied word";
			}

			if (this.status == 500){
				document.getElementById("thesaurus_input").innerHTML = "Please try tomorrow, daily usage exceeded"
			}
			
		});

		xhr.open("GET", `https://words.bighugelabs.com/api/2/${api_key}/${infield}/json`);
		xhr.send();

		document.getElementById('input_text').value = "";

	}, false);
}, false);

function clean_word (str){
	var newstr = "";
	for (var i = 0; i < str.length; i++){
		if (!(str.charAt(i) == '"' || str.charAt(i) == ']' || str.charAt(i) == '[')) {
			newstr += str[i];
		}
	}
	return newstr;
}

function makeUL(array){
	var list = document.createElement('ul');

	for (var i = 0; i < array.length; i++){
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(array[i]));
		list.appendChild(item);
	}
	return list;

}

function confirmType(jsonResponse){
	if (jsonResponse.hasOwnProperty('noun')){
		if (jsonResponse.noun.hasOwnProperty('syn')){
			return jsonResponse.noun.syn;
		}else{
			return jsonResponse.noun.sim;
		}
	}
	if (jsonResponse.hasOwnProperty('adjective')){
		if (jsonResponse.adjective.hasOwnProperty('syn')){
			return jsonResponse.adjective.syn;
		}else{
			return jsonResponse.adjective.sim;
		}
	}
	if(jsonResponse.hasOwnProperty('adverb')){
		if (jsonResponse.adverb.hasOwnProperty('syn')){
			return jsonResponse.adverb.syn;
		}else{
			return jsonResponse.adverb.sim;
		}
	}
	if (jsonResponse.hasOwnProperty('verb')){
		if (jsonResponse.verb.hasOwnProperty('syn')){
			return jsonResponse.verb.syn;
		}else{
			return jsonResponse.verb.sim;
		}
	}
}

