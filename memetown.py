from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import re
import utils as utils

app = Flask(__name__)

current_id = 31

memes = [
	{
		"id": 1,
		"title": "bye bye",
		"caption": "guess this'll be the day that i die",
		"price": 1971,
		"photo": "/static/img/american pie.jpg"
	},
	{
		"id": 2,
		"title": "wholesome content",
		"caption": " ",
		"price": 1987,
		"photo": "/static/img/another one bites the dust.jpg"
	},
	{
		"id": 3,
		"title": "roses are red, ",
		"caption": "price is the number of people who understand the joke",
		"price": 2,
		"photo": "/static/img/baby groot super suit.jpg"
	},
	{
		"id": 4,
		"title": "anger",
		"caption": " ",
		"price": 4,
		"photo": "/static/img/angery.jpg"
	},
	{
		"id": 5,
		"title": "james shapiro 101",
		"caption": "price is percent of plays i read",
		"price": 15,
		"photo": "/static/img/but soft.jpeg"
	},
	{
		"id": 6,
		"title": "#deep",
		"caption": "the greatest poet of our generation",
		"price": 401,
		"photo": "/static/img/april fools.jpg"
	},
	{
		"id": 7,
		"title": "columbia could never",
		"caption": "the ivy league never taught me this",
		"price": 420,
		"photo": "/static/img/cook it again.png"
	},
	{
		"id": 8,
		"title": "before the SAD hits",
		"caption": "price is the first day of fall i think",
		"price": 921,
		"photo": "/static/img/fall scented candle.jpeg"
	},
	{
		"id": 9,
		"title": "welcome back to barnard",
		"caption": "",
		"price": 2020,
		"photo": "/static/img/gay panic.jpg"
	},
	{
		"id": 10,
		"title": "for the ~prestige~",
		"caption": "because who wants to go to a women's college",
		"price": 0,
		"photo": "/static/img/fancy barnard.PNG"
	},
	{
		"id": 11,
		"title": "hell anxiety",
		"caption": "",
		"price": 666,
		"photo": "/static/img/hell anxiety.jpg"
	},
	{
		"id": 12,
		"title": "engineering but make it wholesome",
		"caption": "price is the number of people killed in the atomic bomb",
		"price": 146000,
		"photo": "/static/img/hi greta.jpg"
	},	
	{
		"id": 13,
		"title": "jeff bezos has so much money",
		"caption": "price is how much i want him to have",
		"price": 0,
		"photo": "/static/img/home page.png"
	},
	{
		"id": 14,
		"title": "humpty dumpty had a great fall",
		"caption": "but make it wholesome",
		"price": 0,
		"photo": "/static/img/humpty dumpty had a great fall.jpg"
	},
	{
		"id": 15,
		"title": "i'm bitches",
		"caption": "",
		"price": 0,
		"photo": "/static/img/i'm bitches.PNG"
	},
	{
		"id": 16,
		"title": "when the add/drop period ends and you're still in 23 credits",
		"caption": "",
		"price": 0,
		"photo": "/static/img/im in danger.jpg"
	},
	{
		"id": 17,
		"title": "class of 2020 rn",
		"caption": "price is googles starting salary",
		"price": 106000,
		"photo": "/static/img/kombucha money.jpeg"
	},
	{
		"id": 18,
		"title": "quality english joke",
		"caption": "that is all",
		"price": 0,
		"photo": "/static/img/moped.JPG"
	},
	{
		"id": 19,
		"title": "COLUMBIA UNIVERSITY IN THE CITY OF NEW YORK",
		"caption": "",
		"price": 1754,
		"photo": "/static/img/nyc skyline.jpg"
	},
	{
		"id": 20,
		"title": "'Did you like...study abroad?'",
		"caption": "price are the tix rn",
		"price": 2000,
		"photo": "/static/img/pandalucia.PNG"
	},
	{
		"id": 21,
		"title": "the only professional skills i've learned working",
		"caption": "",
		"price": 15,
		"photo": "/static/img/per my last email.jpg"
	},
	{
		"id": 22,
		"title": "absolutely wrong",
		"caption": "i'm an english major",
		"price": 100,
		"photo": "/static/img/school.JPG"
	},
	{
		"id": 23,
		"title": "youuuuuuuuuuuuuuuu",
		"caption": "",
		"price": 6789998212,
		"photo": "/static/img/soulja board.JPG"
	},
	{
		"id": 24,
		"title": "living in EC as a barnard student",
		"caption": "and walking past all your peers on friday nights",
		"price": 100,
		"photo": "/static/img/that that has.jpg"
	},
	{
		"id": 25,
		"title": "that's just showbiz baby",
		"caption": "because we live in new york get it",
		"price": 0,
		"photo": "/static/img/therapy.jpg"
	},
	{
		"id": 26,
		"title": "half of barnard moms",
		"caption": "i.e. mine",
		"price": 0,
		"photo": "/static/img/there's nothing funny about being a lesbian.jpg"
	},
	{
		"id": 27,
		"title": "wack",
		"caption": "wack",
		"price": 0,
		"photo": "/static/img/wack.JPG"
	},
	{
		"id": 28,
		"title": "thank god elections are coming up",
		"caption": "this has been the worst trade deal",
		"price": 2020,
		"photo": "/static/img/worst trade deal.jpg"
	},
	{
		"id": 29,
		"title": "YEET",
		"caption": "teach em young",
		"price": 6,
		"photo": "/static/img/yearn for educational excellence.jpg"
	},
	{
		"id": 30,
		"title": "hamlet (abridged)",
		"caption": "",
		"price": 48,
		"photo": "/static/img/yeet the fuck off this mortal coil.PNG"
	},
]

sold_memes = []

mine = []

@app.route('/')
@app.route('/index.html')
def index():
	return render_template('index.html')

@app.route('/load')
def load():
	utils.write_data('memes', memes)
	return "<h1 style='color:blue'>Hello There!</h1>"

@app.route('/memepage')
def memepage():
	return render_template('memepage.html', memes = memes)

@app.route('/sell')
def sell():
	return render_template('sell.html', sold_memes = sold_memes)

@app.route('/buy')
def buy():
	print('buy:')
	print(len(memes))
	return render_template('buy.html', memes = memes)

@app.route('/my_memes')
def my_memes():
	print('my_memes:')
	print(len(mine))
	return render_template('my_memes.html', mine = mine)

@app.route('/sell_meme', methods=['GET', 'POST'])
def sell_meme():
	print("selling your meme")
	global memes
	global current_id

	meme_data = request.get_json()
	meme_data["id"] = current_id
	current_id += 1
	sold_memes.append(meme_data)
	memes.append(meme_data)

	return jsonify(sold_memes = sold_memes)


@app.route('/buy_meme', methods=['GET', 'POST'])
def buy_meme():
	print("buying a meme")
	global memes

	json_to_buy = request.get_json()

	id_to_buy = int(json_to_buy["id"])

	deleting = None
	for (i, m) in enumerate(memes):
		meme_id = m["id"]
		if meme_id == id_to_buy:
			deleting = i

			break
	if deleting is not None:
		print("finalizing your purchase of meme, id: ", deleting)
		mine.append(memes[deleting])
		del memes[deleting]

	return jsonify(memes = memes)

@app.route('/update_meme', methods=['GET', 'POST'])
def change_meme():
	print("updating the meme")
	global memes

	json_to_change = request.get_json()
	id_to_change = int(json_to_change["id"])

	for (i, m) in enumerate(memes):
		meme_id = m["id"]
		if meme_id == id_to_change:
			if json_to_change["title"]:
				m["title"] = json_to_change["title"]
				print("title changed!")
			if json_to_change["caption"]:
				m["caption"] = json_to_change["caption"]
				print("caption changed!")
			if json_to_change["price"]:
				m["price"] = int(json_to_change["price"])
				print("price changed!")
			break

	return jsonify(sold_memes = sold_memes, memes = memes)


@app.route('/search', methods=['GET', 'POST'])
def search():
	print("searching...")
	global memes

	results = []

	json_search = request.get_json()
	search_term = json_search["query"]
	print(search_term)

	for (i, m) in enumerate(memes):
		if re.search(r'\b' + search_term + r'\b', m["title"]):
			results.append(m)
			print(m["title"])
		elif re.search(r'\b' + search_term + r'\b', m["caption"]):
			results.append(m)
			print(m["caption"])

	if not results:
		return jsonify(results = [])

	return jsonify(results = results)

if __name__ == '__main__':
   app.run(debug=True)