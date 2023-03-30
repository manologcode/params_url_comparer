document.getElementById('submit').addEventListener('click', submit)
document.getElementById('clean1').addEventListener('click', ()=> document.getElementById('url1').value="")
document.getElementById('clean2').addEventListener('click', ()=> document.getElementById('url2').value="")
Array.prototype.count = function(obj){
	var count = this.length;
	if(typeof(obj) !== "undefined"){
	  var array = this.slice(0), count = 0; // clone array and reset count
	  for(i = 0; i < array.length; i++){
		if(array[i] == obj){ count++ }
	  }
	}
	return count;
  }


function readInput(id) {
	let url = document.getElementById(id).value
	if (url) {
		url_query = url.split('?')[1]
		const urlParams = new URLSearchParams(url_query);
		const data = paramsToObject(urlParams.entries())
		return data
	} else {
		return null
	}
}

function paramsToObject(entries) {
	const result = {}
	for(const [key, value] of entries) {
		if (Array.isArray(result[key])){
			result[key].push(value)
		}else{
			if (key in result){
				result[key] = [result[key]]
				result[key].push(value)
			}else{
				result[key] = value;
			}
		}
	}
	return result;
}

function submit() {
	let obj_url1 = readInput('url1')
	let obj_url2 = readInput('url2')
	if (obj_url2) {
		createHtmlcompare(obj_url1, obj_url2)
	} else {
		createHtml(obj_url1)
	}
}

function createHtml(obj_url) {
	let html = ""
	for (var key in obj_url) {
		item = `<div class="column"><span>${key}<span>: <span>${obj_url[key]}<span></div>`
		html += item
	}
	document.getElementById('html').innerHTML = html
}

function createHtmlcompare(obj_url1, obj_url2) {
	let html = ""
	all_keys = array_unique(Object.keys(obj_url1), Object.keys(obj_url2))
	for (const key of all_keys) {
		let item1 = `<div class="column"></div>`
		let item2 = `<div class="column"></div>`
		if (obj_url1[key] && obj_url2[key]) {
			if (Array.isArray(obj_url1[key])) {
				let data_compared = compore_arrays(obj_url1[key], obj_url2[key])

				console.log(obj_url1[key])
				console.log(obj_url2[key])
				
				console.log(".............................")
				console.log(data_compared)
				console.log(".............................")

				res = draw_array_html(data_compared)
			} else {
				res = compareValues(obj_url1[key], obj_url2[key])
			}
			item1 = `<div class="column"><span>${key}</span>: ${res[0]}</div>`
			item2 = `<div class="column"><span>${key}</span>: ${res[1]}</div>`
		} else {
			if (obj_url1[key]) {
				item1 = `<div class="column red"><span>${key}</span>: <span>${obj_url1[key]}</span></div>`
			} else {
				item2 = `<div class="column red"><span>${key}</span>: <span>${obj_url2[key]}</span></div>`
			}
		}
		html += `<div class="row">${item1}${item2}</div>`
	}
	document.getElementById('html').innerHTML = html
}
function draw_array_html(data){
	all_data = array_unique(Object.keys(data[0]), Object.keys(data[1]))

	resp=["",""]
	all_data.forEach(item => {
		item0="" ; item1 =""
		ok0 = data[0][item] == 1
		ok1 = data[1][item] == 1
		console.log(`----${item}---${ok0} - ${ok1}`)
		if (ok0 && ok1){
			item0 = `<span class="arr">${item}</span>`
			item1 = `<span class="arr">${item}</span>`
		}else{
			item0 = ok0 ? `<span class="red arr">${item}</span>` : `<span></span>`
			item1 = ok1 ? `<span class="red arr">${item}</span>` : `<span></span>`
		}
		if (data[0][item] > 1){
			item0 = draw_array_multiple(data[0][item], item) 
		}
		if (data[1][item] > 1){
			item1 = draw_array_multiple(data[1][item], item) 
		}
		resp[0] += item0
		resp[1] += item1
	})
	return resp
}
function draw_array_multiple(num, item){
	response=""
		for(let i=1; i<=num ; i++ ){
			response += `<span class="red arr">${item}</span>`
		}
	return response
}
function compore_arrays(arr0,arr1){
	all_data = array_unique(arr0, arr1)
	rep = [{},{}]
	all_data.forEach(item => {
		rep[0][item] = arr0.count(item)
		rep[1][item] = arr1.count(item)
	});
	return rep
}

function removeItemOnce(arr, value) {
var index = arr.indexOf(value);
if (index > -1) {
	arr.splice(index, 1);
}
return arr;
}
function array_unique(obj0, obj1) {
	allobj = obj0.concat(obj1)
	let unic_keys = [...new Set(allobj)]
	return unic_keys.sort()
}
function compareValues(val0, val1) {
	response = [`<span>${val0}</span>`,`<span>${val1}</span>`]
	if (val0 != val1 && val0!='true')
		response = [`<span class="red">${val0}</span>`,`<span class="red">${val1}</span>`]
	return response
}
