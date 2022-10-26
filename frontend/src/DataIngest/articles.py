import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import csv
import ast
import os

#gets access to the database
cred = credentials.Certificate('access.json')
firebase_admin.initialize_app(cred, {

    'databaseURL': 'https://se-naacp-journalism-bias-default-rtdb.firebaseio.com/'

})

#gets a reference of the database and creates the articles collection
database = db.reference('/')
database.child('articles')
artbase = db.reference('/articles')

"""
Returns an array of languages of the article.
input -> string str
output -> arr lst
"""
def formatLangToList(str):
    if str == "":
        return []
    lst = [str.strip("[]")]
    return lst

"""
Returns an array of terms of the article.
input -> string str
output -> arr lst
"""
def formatStrToList(str):
    if str == "":
        return []
    lst = str.split(',')
    return lst

"""
"""
def getFileName(file_path):
    for index, char in reversed(list(enumerate(file_path))):
        if char == "/":
            return file_path[index+1:]
    return file_path

"""
"""
def getNeighborhoodList(article):
    #gets a reference of the database and creates the articles collection
    subsAndNeighNames = ['Brighton', 'Allston', 'Fenway', 'Longwood Medical Area', 'Back Bay', 'Beacon Hill', 'West End', 'North End', 'Downtown', 'Charlestown', 'East Boston', 'South Boston', 'South Boston Waterfront', 'South End', 'Roxbury', 'Mission Hill', 'Jamaica Plain', 'Dorchester', 'Mattapan', 'Roslindale', 'West Roxbury', 'Hyde Park', 'Harbor Islands', 'Lower Allston', 'Oak Square', 'Hunnwell Hill', 'Brighton', "St. Elizabeth's", 'Chestnut Hill Neighborhood Association', 'Aberdeen', 'Salisbury Road Corey Farm', 'Allston', 'Back Bay', 'West Fens', 'Fenway Kenmore', 'Frederick Douglas Square Historic District', 'West End', 'Bunker Hill', 'Charlestown', 'Boston', 'East Boston', 'Eagle Hill', 'Orient Heights', 'Jeffries Point', 'City Point', 'Telegraph Hill', 'Seaport District', 'South Boston', 'Downtown Crossing', 'China Town', 'Bay Village', 'Shawmut', 'Columbus', 'South End', 'Lower Roxbury', 'Nubian Square', 'Mission Hill', 'Central Village', 'Fort Hill', 'Washington Park', 'Roxbury', 'Grove Hall', 'Franklin Field South', 'Uphams Corner', 'Jones Hill', 'Meeting House Hill', 'Dorchester', 'Clam Point', 'Fields Corner Wester', 'Dorchester Center', 'Codman Square', 'St. Marks', 'Adams Village', 'Ashmount', 'Milton Hill', 'Southern Mattapan', 'Mattapan', 'Wellington Hill', 'Washington Hill', 'Roslindale', 'Centre South', 'Jamaica Hills', 'Jamaica Plain', 'Stonybrook', 'Egleston Square', 'High Street Hill', 'Brook Farm', 'Bellevue Hill', 'Hyde Park', 'Georgetown', 'Ashcroft', 'Beachmont']
    result = {}
    id = article[0]
    hl1 = article[4]
    hl2 = article[5]
    lede = article[7]
    body = article[8]

    def lookUp(text):
        for name in subsAndNeighNames:
            if name in text:
                if name not in result:
                    result[name] = 0

    lookUp(id)
    lookUp(hl1)
    lookUp(hl2)
    lookUp(lede)
    lookUp(body)

    if len(result) == 0:
        return ['none']
    return(list(result))


def processDate(dateStr):
    date = {
        "day": int(dateStr[:2]),
        "month": int(dateStr[3:5]),
        "year": int(dateStr[6:]),
    }
    return date


"""
Iterates line by line through the suburbs csv file and populates the articles collection in database.
"""
def addArticles(articles):
    #track number of database inputs
    lineCounter = -1
    with open(articles,"r") as file:
        file_reader = csv.reader(file)
        #hash table keeps track of neighborhoods inputed in database
        seen = {}

        #format each neighborhood follows
        format = {
            "body":"", 
            "language": '', 
            "word_count": 0,
            "content_id": '',
            "publisher": '',
            "date": {},
            'author': '',
            'position': '',
            'subposition': '',
            'titles':{},
            'neighborhoods': [],
            "licensor_terms": [],
            'indexing_terms': {},
            'meta': {
                'copyright': '', 
                'volume': '', 
                'issue_number': '',
            },
            "file_name": getFileName(articles),
            "folder_name": '',
        }
        folder_path = articles[:(len(articles)-len(format["file_name"]))-1]
        format["folder_name"] = getFileName(folder_path)

        for line in file_reader:
            lineCounter += 1
            #neighborhood name
            artId = line[12]
            #if the name is not avaiable, move to next entry
            if artId == '' or lineCounter <= 0:
                continue
            newArt = format.copy()
            if artId not in seen:
                seen[artId] = 1
                #add data to article
                newArt['body'] = line[8]
                newArt['language'] = formatLangToList(line[9])
                newArt['word_count'] = int(line[10])
                newArt['content_id'] = artId
                newArt['publisher'] = line[16]
                newArt['date'] = line[17] #processDate(line[17])
                newArt['author'] = line[6]
                newArt['neighborhoods'] = getNeighborhoodList(line)
                newArt['licensor_terms'] = formatStrToList(line[18])
                newArt['position'] = line[2]
                newArt['subposition'] = line[3]
                newArt['titles'] = {'title_one': line[4], 'title_two': line[5]}

                #prevent error caused by blank column
                if line[19] != "" and line[19] != " " and line[19] != None:
                    newArt['indexing_terms'] = ast.literal_eval(line[19])
                else:
                    newArt['indexing_terms'] = {}
                 
                newArt['meta']['copyright'] = line[11]
                newArt['meta']['volume'] = line[13]
                newArt['meta']['issue_number'] = line[14]
                #add article to collection
                artbase.child(artId).set(newArt)

        print(len(seen))
        #print(seen)

def firebaseUpload():
    #csv file containing the article information
    path = "data-out"
    folders = os.listdir(path)
    for folder in folders:
        articles = os.listdir(path+"/"+folder)
        for article in articles:
            addArticles(path+"/"+folder+"/"+article)

firebaseUpload()


