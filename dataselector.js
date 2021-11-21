class dataselector {
	constructor(title, normalizer, colorScale){
		this.title = title;
		this.normalizer = normalizer;
		this.colorScale = colorScale;		
	}

	textErrorHandling(data, d, text){
		let name = d.properties == undefined ? d.key : d.properties.name;
		console.log(name);
		if (data.get(name)===undefined){
			return "There is no data for " +name
		}
		return text;
	}
}

class cumData extends dataselector {
	selector(row) {
		return row.cumulativetotal 
	}

	tooltipText(data, d) {
		let name = d.properties == undefined ? d.key : d.properties.name;
		//return "There are " + data.get(d.properties.name) + " cumulative cases in " +d.properties.name
		return super.textErrorHandling(data, d,"There are " + data.get(name) + " cumulative cases in " +name)
	}
}

class cumCasesPer extends dataselector {
	selector(row) {
		return row.cumulativetotalper100000

	}

	tooltipText(data, d) {
		let name = d.properties == undefined ? d.key : d.properties.name;
		return super.textErrorHandling(data, d,"There are " + data.get(name) + " cumulative deaths in " +name)
	}
}

class totDeaths extends dataselector {
	selector(row) {
		return row.deathsper100000
	}

	tooltipText(data, d) {
		let name = d.properties == undefined ? d.key : d.properties.name;
		return super.textErrorHandling(data, d,"There are " + data.get(name) + " Deaths per 100,000 population in " +name)
	}
}

class totCumDeaths extends dataselector {
	selector(row) {
		return row.cumulativedeathstotal

	}

	tooltipText(data, d) {
		let name = d.properties == undefined ? d.key : d.properties.name;
		return super.textErrorHandling(data, d,"There are " + data.get(name) + " cumulative deaths in " +name)
	}
}


class casesNew24 extends dataselector {
	selector(row) {
		return row.casesnew24h

	}

	tooltipText(data, d) {
		let name = d.properties == undefined ? d.key : d.properties.name;
		return super.textErrorHandling(data, d,"There are " + data.get(name) + " new cases in " +name + " in the last 24 hours ")
	}
}

class deathsNew24 extends dataselector {
	selector(row) {
		return row.deathsnew24h

	}

	tooltipText(data, d) {
		let name = d.properties == undefined ? d.key : d.properties.name;
		return super.textErrorHandling(data, d,"There are " + data.get(name) + " new deaths in " +name + " in the last 24 hours ")
	}
}

var cumulativeCases = new cumData(
	"COVID Cases",
	//function(data, d){return "This country is " +d.properties.name + " " + data.get(d.properties.name)},
	function(val){return Math.pow(val, 1/4)},
	d3.interpolateOrRd);

var cumTotalDeaths = new totCumDeaths(
	"Total Cumulative Deaths",
	//function(data, d){return "There are " + data.get(d.properties.name)} + " in " + d.properties.name ,
	function(val){return Math.pow(val, 1/4)},
	d3.interpolateOrRd);

var cumulativeCasesPer = new cumCasesPer(
	"COVID Cases per 100,000",
	//function(data, d){return "This country is " +d.properties.name + " " + data.get(d.properties.name)},
	function(val){return Math.pow(val, 1/4)},
	d3.interpolateOrRd);

var totalDeathsPer = new totDeaths(
	"Deaths per 100,000",
	//function(data, d){return "There are " + data.get(d.properties.name)} + " in " + d.properties.name ,
	function(val){return Math.pow(val, 1/4)},
	d3.interpolateOrRd);

var newCases24 = new casesNew24(
	"New cases in last 24 hours",
	//function(data, d){return "There are " + data.get(d.properties.name)} + " in " + d.properties.name ,
	function(val){return Math.pow(val, 1/4)},
	d3.interpolateOrRd);

var newDeaths24 = new deathsNew24(
	"New deaths in last 24 hours",
	//function(data, d){return "There are " + data.get(d.properties.name)} + " in " + d.properties.name ,
	function(val){return Math.pow(val, 1/4)},
	d3.interpolateOrRd);

var myData = [cumulativeCases, cumTotalDeaths, newCases24, newDeaths24, cumulativeCasesPer, totalDeathsPer];


//renaming column names in table
function GetPrettyText(text) {
	switch(text) {
		case "cumulativetotal" : return "Cumulative Total Cases";
		case "cumulativetotalper100000" : return " Cases per 100,000 Population";
		case "deathsper100000" : return "Deaths per 100,000 Population";
		case "cumulativedeathstotal" : return "Cumulative Total Deaths";
		case "casesnew24h" : return "Cases - Newly Reported In Last 24 Hours";
		case "deathsnew7total" : return "Deaths - Newly Reported In Last 7 Days"
		case "deathsnew24h" : return "Deaths - Newly Reported In Last 24 Hours"
		default: return text;
	}
}

