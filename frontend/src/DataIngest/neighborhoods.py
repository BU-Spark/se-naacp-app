from re import subn
from webbrowser import get
from xml.etree.ElementPath import prepare_parent
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import csv

#gets access to the database
cred = credentials.Certificate('access.json')
firebase_admin.initialize_app(cred, {

    'databaseURL': 'https://se-naacp-journalism-bias-default-rtdb.firebaseio.com/'

})

#gets a reference of the database and creates the neighborhoods collection
database = db.reference('/')
database.child('neighborhoods')
neighbase = db.reference('/neighborhoods')

#csv file containing the neighborhood information
neigh = "subs.csv"

"""
Creates the appropriate code for a neighborhood name.
input -> string str
output -> string oupt
"""
def getCode(str):
    lst = str.split()
    oupt = ""
    #If the name is one word, then the code is the first three letters of the name
    if len(lst) == 1:
        oupt = (lst[0])[:3]
    #If the name is more than one word, then the code is the first letter of each word
    else:
        for word in lst:
            oupt += word[0]

    oupt = oupt.lower()
    return oupt

"""
Iterates line by line through the suburbs csv file and populates the neighborhoods collection in database.
"""
def addNeighs():
    #track number of database inputs
    lineCounter = -1
    with open(neigh,"r") as file:
        file_reader = csv.reader(file)
        #hash table keeps track of neighborhoods inputed in database
        seen = {}

        #format each neighborhood follows
        format = {
            "name":"",
            "code": '', 
            'demographic_data': {'black': 0, 'white': 0, 'american_indian_alaskan_native': 0, 'asian': 0, },
            'articles':['test'],
        }
        
        for line in file_reader:
            lineCounter += 1
            #neighborhood name
            neighName = line[2].lower()
            #if the name is not avaiable, move to next entry
            if neighName == '' or lineCounter <= 0:
                continue
            newNeigh = format.copy()
            if neighName not in seen:
                #name and code
                newNeigh['name'] = neighName
                newNeigh['code'] = getCode(newNeigh['name'])

                #add demographic info
                newNeigh['demographic_data']['black'] = int(line[5].replace(",", ""))
                newNeigh['demographic_data']['white'] = int(line[7].replace(",", ""))
                newNeigh['demographic_data']['american_indian_alaskan_native'] = int(line[9].replace(",", ""))
                newNeigh['demographic_data']['asian'] = int(line[11].replace(",", ""))

                seen[neighName] = newNeigh
            else:
                #since the neighborhood has been seen, we update its demographic data
                seen[neighName]['demographic_data']['black'] += int(line[5].replace(",", ""))
                seen[neighName]['demographic_data']['white'] += int(line[7].replace(",", ""))
                seen[neighName]['demographic_data']['american_indian_alaskan_native'] += int(line[9].replace(",", ""))
                seen[neighName]['demographic_data']['asian'] += int(line[11].replace(",", ""))

                newNeigh = seen[neighName]
            #add neighborhood to collection
            neighbase.child(neighName.replace(" ", "_")).set(newNeigh)
        print(len(seen))
        print(list(seen))

addNeighs()