import json

def write_data(filename, data):
	with open(filename + '.txt', 'w') as outfile:
		json.dump(data, outfile)

def read_data(filename):
	with open(filename + '.txt', 'r') as infile:
		data = json.load(infile)

	return data