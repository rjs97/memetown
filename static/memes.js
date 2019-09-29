var change_id;

var display_memes = function(memes){
	$("#user_info").empty()

	console.log(memes)

	if (memes.length == null || memes.length == 0) {
		$("#memes").append("<h5> No memes found <h5>")
	} else {
		memes.reverse()
		$.each(memes, function(i, meme) {
			var figure = $("<figure>")

			var image = document.createElement("img")
			image.src = meme["photo"]
			$(figure).append(image)

			var figcaption = $("<figcaption>")
			$(figcaption).append("<h5>" + meme["title"] + "</h5>")
			$(figcaption).append(meme["caption"])
			$(figcaption).append("<br> $" + meme["price"])
			$(figure).append(figcaption)

			var id = meme["id"]
			figure = add_buttons(figure, id)

			$("#memes").append(figure)
		})
	}
}

var submitMeme = function(save){
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
		if (save) {
			sell_meme_and_save(new_meme)
		} else {
			sell_meme(new_meme)
		}
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
			var memes = data["memes"]
			$("#memes").empty()
			display_memes(memes)
			$("#user_info").append("<h3>Meme successfully posted!</h3>")

			$("#enter_title").val("")
			$("#enter_caption").val("")
			$("#enter_price").val("")
			document.getElementById("file_label").innerText = "Upload your meme"
			// clear photo
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

var sell_meme_and_save = function(new_meme){
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
			// clear photo
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

var buy_meme = function(id){
	$.ajax({
		type: "POST",
		url: "buy_meme",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"id": id}),
		success: function(data, text){
			var memes = data["memes"]
			$("#memes").empty()
			display_memes(memes)
			$("#user_info").append("<h3>Meme bought!</h3>")
			$("#user_info").focus()
		},
		error: function(request, status, error){
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	})
}

var resetMeme = function(sold){
	$("#change_price").modal('hide')
	var title = document.getElementById("alternate_title").value
	var price = document.getElementById("alternate_price").value
	var caption = document.getElementById("alternate_caption").value
	console.log("new title: " + title)
	console.log("new caption: " + caption)
	console.log("new price: " + price)
	console.log("id to change: " + change_id)
	if (sold) {
		update_sold_memes(title, caption, price, change_id)
	} else {
		update_meme(title, caption, price, change_id)
	}
}

var update_meme = function(title, caption, price, id) {
	$.ajax({
		type: "POST",
		url: "update_meme",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"title": title, "caption": caption, "price": price, "id": id}),
		success: function(data, text){
			var memes = data["memes"]
			$("#memes").empty()
			display_memes(memes)
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

var update_sold_memes = function(title, caption, price, id) {
	$.ajax({
		type: "POST",
		url: "update_meme",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({"title": title, "caption": caption, "price": price, "id": id}),
		success: function(data, text){
			var memes = data["sold_memes"]
			$("#memes").empty()
			display_memes(memes)
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