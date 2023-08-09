import rss_acq
from pymongo import MongoClient





client = MongoClient("mongodb://localhost:27017")

# Get the database
db = client['se_naacp_gbh']

# Get the collection
collection = db['rss_links']

# Retrieve all the documents
documents = collection.find()

# Extract the links
links = [doc['link'] for doc in documents]

# Print the links
for link in links:
    print(link)
    pipli = rss_acq.rss_acquisition(link)
    pipli.rss_request(pipli.rss_url)
    temp = pipli.rss_parse()
    pipli.saveFeed()

    