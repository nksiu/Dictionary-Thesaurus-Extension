document.addEventListener('DOMContentLoaded', function() {
	var submitPageButton = document.getElementById('enter_button');
	submitPageButton.addEventListener('click', function(){

		var numSubDef = 2;

		var infield = document.getElementById('input_text').value;
		document.getElementById("word_input").innerHTML = infield;
		var arr = [];

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;


		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4 && this.status == 200) {
				xhr.responseText.encoding = 'utf-8';
				var data = xhr.responseText;
				var jsonResponse = JSON.parse(data);

				//Get the main definition
				var mainDef = JSON.stringify(jsonResponse.results[0].lexicalEntries[0].entries[0].senses[0].definitions);
				mainDef = clean_sentence(mainDef);
				arr.push(mainDef);

				//Get the sub definitions
				var subDef = jsonResponse.results[0].lexicalEntries[0].entries[0].senses[0];
				if (JSON.stringify(subDef.subsenses) != undefined){
					for (var i = 0; i < numSubDef; i++){
						if (subDef.subsenses.length == i){
							break;
						}
						var tmp_def = JSON.stringify(subDef.subsenses[i].definitions);
						tmp_def = clean_sentence(tmp_def);
						arr.push(tmp_def);
					}
				}

				document.getElementById("dictionary_input").innerHTML = "";
				document.getElementById("dictionary_input").appendChild(makeOL(arr));

			}

			if (this.status == 404){
				document.getElementById("dictionary_input").innerHTML = "No entry found matching supplied word";
			}

			if (this.status == 500){
				document.getElementById("dictionary_input").innerHTML = "Please try tomorrow, daily usage exceeded"
			}
			
		});

		xhr.open("GET", `https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${infield}`);
		xhr.setRequestHeader("app_id", "845a25e1");
		xhr.setRequestHeader("app_key", "c1de3ed848bb9f39e6dd340ecd654e85");;

		xhr.send();


	}, false);
}, false);

function clean_sentence (str){
	var newstr = "";
	
	for (var i = 0; i < str.length; i++){
		if (!(str.charAt(i) == '"' || str.charAt(i) == ']' || str.charAt(i) == '[')) {
			newstr += str[i];
		}
	}

	return newstr;
}

function makeOL(array){
	var list = document.createElement('ol');

	for (var i = 0; i < array.length; i++){
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(array[i]));
		list.appendChild(item);
	}

	return list;
}

