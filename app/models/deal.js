//Will be used with mongoose and get the info on the database

module.exports = {
	getAllDeals: function(){
		deals = {
			1: {location: "Amsterdam", link: "http://google.fr"},
			2: {location: "London", link: "http://google.fr"},
			3: {location: "Milan", link: "http://google.fr"}
		}
		return {data: deals, status: 200}
	}
}
