export default {
	async parse () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
		await LookupEGDoctor.run()
		// Query results are available as the `data` variable
		function mapDOM(element, json) {
			var treeObject = {};

			//  // Regular expression to match the table block
			//  const regex = /table/;

			// Extracting the matched table block
			//  console.log("element:" + element.toString());
			const match = element.indexOf("<table");
			console.log("match: " + match);

			// Check if a match is found
			if (match >= 0) {
					const match2 = element.indexOf("</table>", match+1);
					element = element.substring(match, match2+8);
					console.log("cut element:" + element.toString());
			} else {
					console.log("Table block not found in the text");
					return [];
			}

			// If string convert to document Node
			if (typeof element === "string") {
				if (window.DOMParser) {
					console.log("DOMParse is available");
					parser = new DOMParser();
					docNode = parser.parseFromString(element, "text/html");
				} // Microsoft strikes again
				else {
					console.log("Microsoft.XMLDOM");
					docNode = new ActiveXObject("Microsoft.XMLDOM");
					docNode.async = false;
					docNode.loadXML(element);
				}

				element = docNode.firstChild;
			} else {
				console.log("data is : " + typeof(data));
			}

			//Recursively loop through DOM elements and assign properties to object
			function treeHTML(element, object) {
				object["type"] = element.nodeName;
				var nodeList = element.childNodes;
				if (nodeList != null) {
					if (nodeList.length) {
						object["content"] = [];
						for (var i = 0; i < nodeList.length; i++) {
							if (nodeList[i].nodeType == 3) {
								//  console.log("pushing " + nodeList[i].nodeValue);
								object["content"].push(nodeList[i].nodeValue);
							} else {
								object["content"].push({});
								treeHTML(
									nodeList[i],
									object["content"][object["content"].length - 1]
								);
							}
						}
					}
				}

				if (element.attributes != null) {
					if (element.attributes.length) {
						object["attributes"] = {};
						for (var i = 0; i < element.attributes.length; i++) {
							object["attributes"][element.attributes[i].nodeName] =
								element.attributes[i].nodeValue;
						}
					}
				}
			}

			treeHTML(element, treeObject);

			return json ? JSON.stringify(treeObject) : treeObject;
		}

		var initElement = LookupEGDoctor.data;
		var json = mapDOM(initElement, false);
		//  `$.content[1].content[0].content[3].content[*].content[?(@.type == "TH" || @.type == "TD")].content`
		//  json = json.content[1].content[0].content[3].content.map(c =>{ if (c.type == "TH" || c.type == "TD") {return c.content;} else { return null;}});
		if (json.content) {
			console.log(json.content[3].content.map(c => c.content))
			json = json.content[3].content.map(c => c.content).map(o => {
				if (o && o[1] && o[3]) {
					return {
						"name": o[1].content[0],
						"speciality": o[3].content[0]
						};
				}
			}).filter(v => v != null);
		}
		
		return json;
	}
}