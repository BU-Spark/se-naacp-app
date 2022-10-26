from webbrowser import get
from xml.etree.ElementPath import prepare_parent
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import csv
import json

#gets access to the database
cred = credentials.Certificate('access.json')
firebase_admin.initialize_app(cred, {

    'databaseURL': 'https://se-naacp-journalism-bias-default-rtdb.firebaseio.com/'

})

#gets a reference of the database and creates the subneighborhoods collection
database = db.reference('/')
database.child('subneighborhoods')
subase = db.reference('/subneighborhoods')

#csv file containing the suburb information
subs = "subs.csv"

"""
Creates the appropriate code for a suburb name.
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
Removes apostrophes, periods, slashes, and hyphens from names.
This prevents errors when adding to database.
input -> string str
output -> string processed
"""
def processName(str):
    processed = str.replace("'", "")
    processed = processed.replace(".", "")
    # processed = processed.replace("/", " ")
    # processed = processed.replace(" / ", " ")
    # processed = processed.replace(" /", " ")
    # processed = processed.replace("/ ", " ")
    processed = processed.replace("-", " ")
    if processed[-1] == " ":
        processed = processed[:len(processed)-1]
    return processed

"""
Iterates line by line through the suburbs csv file and populates the subneighborhoods collection in database.
"""
def addSubs():
    #track number of database inputs
    lineCounter = -1
    with open(subs,"r") as file:
        file_reader = csv.reader(file)
        #hash table keeps track of neighborhoods inputed in database
        seen = {}

        #format each subneighborhood follows
        format = {
            "name":"", 
            "code": '', 
            'parent_neighborhood_code': [], 
            'demographic_data': {'black': 0, 'white': 0, 'american_indian_alaskan_native': 0, 'asian': 0, }
        }
        
        for line in file_reader:
            lineCounter += 1
            #subneighborhood name
            subName = line[19].lower()
            #if the name is not avaiable, move to next entry
            if subName == 'n/a' or subName == '' or lineCounter <= 0:
                continue
            #ommits neighborhoods with a slash in their name
            if '/' in subName:
                continue
            #only alpha and spaces in name
            psn = processName(subName)
            if psn not in seen:
                seen[psn] = 1
                newSub = format.copy()
                
                #meta info
                newSub['name'] = psn
                newSub['code'] = getCode(newSub['name'])

                #add demographic info
                newSub['demographic_data']['black'] = int(line[5].replace(",",""))
                newSub['demographic_data']['white'] = int(line[7].replace(",",""))
                newSub['demographic_data']['american_indian_alaskan_native'] = int(line[9].replace(",",""))
                newSub['demographic_data']['asian'] = int(line[11].replace(",",""))

                #add subneighborhood to collection
                subase.child(psn.replace(" ","_")).set(newSub)

            #create a code for parent neighborhood and add it if not in the list already
            parentCode = getCode(line[2]).lower()
            if parentCode not in newSub['parent_neighborhood_code']:
                newSub['parent_neighborhood_code'].append(parentCode)

        print(len(seen))
        print(list(seen))

addSubs()