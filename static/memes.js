var change_id;

var display_memes = function(memes){
	$("#user_info").empty()

	if (memes.length == null || memes.length == 0) {
		$("#memes").append("<h5> No memes found <h5>")
	} else {
		memes.reverse()
		$.each(memes, function(i, meme) {
			var figure = document.createElement("figure")
			var image = document.createElement("img")
			var id = meme["id"]
			var caption = meme["caption"]

			figure.id = "figure" + id
			image.src = meme["photo"]
			$(figure).append(image)

			var figcaption = $("<figcaption>")
			$(figcaption).append("<h5>" + meme["title"] + "</h5>")
			$(figcaption).append(caption)
			$(figcaption).append("<br> $" + meme["price"])
			$(figure).append(figcaption)

			figure = add_buttons(figure, id)

			$("#memes").append(figure)
		})
	}
}

var createUserTabs = function(users){
	$("#user_tabs").empty()

	var list = document.createElement("ul")
	var listClass = document.createAttribute("class")
	listClass.value = "nav nav-tabs"
	list.setAttributeNode(listClass)
	var listRole = document.createAttribute("role")
	listRole.value = "tablist"
	list.setAttributeNode(listRole)
	list.id = "user_tab_list"

	var div = document.createElement("div")
	var outerDivClass = document.createAttribute("class")
	outerDivClass.value = "tab-content"
	div.setAttributeNode(outerDivClass)
	div.id = "user_tab_listContent"

	$.each(users, function(i, user) {
		var item = document.createElement("li")
		var itemClass = document.createAttribute("nav-item")
		itemClass.value = "nav-item"
		item.setAttributeNode(itemClass)

		var link = document.createElement("a")
		var aria_selected = document.createAttribute("aria-selected")
		var linkClass = document.createAttribute("class")
		if (i == 0) {
			linkClass.value = "nav-link active"
			aria_selected.value = "true"
		} else {
			linkClass.value = "nav-link"
			aria_selected.value = "false"
		}
		link.setAttributeNode(linkClass)
		link.setAttributeNode(aria_selected)
		
		var linkRole = document.createAttribute("role")
		linkRole.value = "tab"
		link.setAttributeNode(linkRole)

		var data_toggle = document.createAttribute("data-toggle")
		data_toggle.value = "tab"
		link.setAttributeNode(data_toggle)

		var aria_controls = document.createAttribute("aria-controls")
		aria_controls.value = user
		link.setAttributeNode(aria_controls)
		

		link.href = "#" + user
		link.id = user + "-tab"

		link.appendChild(document.createTextNode(user))

		item.appendChild(link)
		list.appendChild(item)

		var divContent = document.createElement("div")
		var divClass = document.createAttribute("class")
		if (i == 0) {
			divClass.value = "tab-pane fade active show"
		} else {
			divClass.value = "tab-pane fade"
		}
		divContent.setAttributeNode(divClass)
		var divRole = document.createAttribute("role")
		divRole.value = "tabpanel"
		divContent.setAttributeNode(divRole)
		var aria_labeled = document.createAttribute("aria-labelledby")
		aria_labeled.value = user + "-tab"
		divContent.setAttributeNode(aria_labeled)

		divContent.id = user

		div.append(divContent)

	})

	$("#user_tabs").append(list)
	$("#user_tabs").append(div)
}

var displayMemesByUser = function(saved){
	for (let [user, content] of Object.entries(saved)) {
		var user_div = "#" + user
		$(user_div).empty()
		if (content.length == null || content.length == 0) {
			$(user_div).append("<h5> No memes found <h5>")
		} else {
			content.reverse()
			$.each(content, function(i, meme) {
				var figure = document.createElement("figure")
				var image = document.createElement("img")
				var id = meme["id"]
				var caption = meme["caption"]

				figure.id = "figure" + id
				image.src = meme["photo"]
				image.id = "img" + id
				$(figure).append(image)

				var figcaption = $("<figcaption>")
				$(figcaption).append("<h5>" + meme["title"] + "</h5>")
				$(figcaption).append(caption)
				$(figcaption).append("<br> $" + meme["price"])
				$(figure).append(figcaption)

				figure = add_buttons(figure, id, image.src, meme["title"])

				$(user_div).append(figure)
			})
		}
	}
}

var addUsers = function(users){
	$("#user_list").empty()
	$("#user_list").append("<option disabled selected> Save to a user </option>")
	$.each(users, function(i, user) {
		var option = "<option value=" + user + ">" + user + "</option>"
		$("#user_list").append(option)
	})
	var other = "<option value=other>Add User</option>"
	$("#user_list").append(other)

}

var submitMeme = function(){
	var title = $("#enter_title").val()
	var caption = $("#enter_caption").val()
	var price = $("#enter_price").val()

	var photo = previewFile()

	if ($.trim(title) == "") {
		alert("Gotta have a title!")
		$("#enter_title").val("")
		$("#enter_title").focus()
	} else if (!$.isNumeric(price)) {
		alert("The price has to be a number!")
		$("#enter_price").focus()
	} else if (document.getElementById("upload_photo").files.length == 0) {
		alert("You forgot a meme!")
	} else {
		var new_meme = {
			"title": title,
			"caption": caption,
			"price": price,
			"photo": photo
		}
		sell_meme(new_meme)
	}
}

function previewFile() {
	var preview = document.querySelector('img');
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.onloadend = function(){
		preview.src = reader.result;
		document.getElementById("file_label").innerText = file.name
	}

	if (file) {
		reader.readAsDataURL(file);
	}
	return preview.src;
}

var sell_meme = function(new_meme){
	$.ajax({
		type: "POST",
		url: "sell_meme",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(new_meme),
		success: function(data, text){
			var sold_memes = data["sold_memes"]
			$("#memes").empty()
			display_memes(sold_memes)
			$("#user_info").append("<h3>Meme successfully posted!</h3>")

			$("#enter_title").val("")
			$("#enter_caption").val("")
			$("#enter_price").val("")
			document.getElementById("file_label").innerText = "Upload your meme"
			// clear photo ??
			$("#enter_caption").focus()
		},
		error: function(request, status, error){
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	});
}

var buy_meme = function(id, user){
	$.ajax({
		type: "POST",
		url: "buy_meme",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"id": id, "user": user}),
		success: function(data, text){
			var memes = data["memes"]
			$("#memes").empty()
			display_memes(memes)
			$("#user_info").append("<h3>Meme bought!</h3>")
			$("#user_info").focus()
			$("#add_name").val("")
		},
		error: function(request, status, error){
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	})
}

var resetMeme = function(){
	// only used in SELLING memes
	$("#change_data").modal('hide')
	var title = document.getElementById("alternate_title").value
	var price = document.getElementById("alternate_price").value
	var caption = document.getElementById("alternate_caption").value

	update_meme(title, caption, price, change_id)
}

var update_meme = function(title, caption, price, id) {
	// only used in SELLING memes
	$.ajax({
		type: "POST",
		url: "update_meme",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"title": title, "caption": caption, "price": price, "id": id}),
		success: function(data, text){
			var sold_memes = data["sold_memes"]
			$("#memes").empty()
			display_memes(sold_memes)
			$("#alternate_title").val("")
			$("#alternate_caption").val("")
			$("#alternate_price").val("")
		},
		error: function(request, status, error){
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	})
}

var searchMemes = function(){
	var search_term = $("#search_query").val()
	console.log("search term: " + search_term)
	submit_search(search_term)
}

var submit_search = function(query) {
	$.ajax({
		type: "POST",
		url: "search",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"query": query}),
		success: function(data, text){
			var results = data["results"]
			$("#memes").empty()
			$("#memes").append("<h3>Search results: </h3>")
			display_memes(results)

			$("#user_info").append("<button class='btn btn-outline-secondary' id='return' onclick='location = location'>Back</button>")
			$("#search_query").val("")
		},
		error: function(request, status, error){
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	})
}