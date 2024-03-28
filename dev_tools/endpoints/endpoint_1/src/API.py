from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException, Query, Body, Form

from pymongo import MongoClient # For MongoDB
from datetime import datetime # For Dates
import uuid # For upload ID unique generation

import time
import threading
from typing import Callable
from concurrent import futures

from urllib.parse import unquote_plus

router = APIRouter()

@router.post("/test_endpoint")
async def dummy_string_endpoint(Payload: str = Body(..., description="Some String payload")):
	try:
		decoded_payload = str(unquote_plus(Payload)[8:])
		print("Passed in String:", decoded_payload)
		return JSONResponse(content={"String Payload": decoded_payload, "status": "String Successfully Uploaded"}, status_code=200)
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
	

@router.post("/upload_csv")
async def dummy_csv_endpoint(file: UploadFile = None, user_id: str = Form(...)):
	try:
		# Break the computation into two threads...
		# Thread 1 -> Simulate CSV
		# Thread 2 (this function) -> Return with status 200

		thread_1 = threading.Thread(target=simulate_csv_upload, args=((user_id,)))
		thread_1.start() # Start a thread to simulate CSV Upload

		return JSONResponse(content={"status": "CSV Successfully recieved from endpoint!"}, status_code=200)
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
	

def simulate_csv_upload(user_id):
	"""
	A quick function to simulate a csv upload process. Takes fully 7 seconds to reach to success.
	"""
	# We dont do anything with the CSV and we just simulate an CSV upload
	client = bootstrap_MongoDB_Prod() # Instantiate a MongoDB connection and add necessary collections
	db_prod = client["se_naacp_db"]
	upload_id = str(uuid.uuid4()) # This doesnt change
	timestamp = datetime.now() # This doesnt change as well

	update_job_status(
		db_prod,
		upload_id,
		user_id,
		timestamp,
		100, # Dummy number
		"VALIDATING",
		"JOB IS ENQUEUED"
	) 

	time.sleep(2) # Simulate validating the CSV
		
	update_job_status(
		db_prod,
		upload_id,
		user_id,
		timestamp,
		100, # Dummy number
		"PROCESSING",
		"INFERENCE PIPELINE IS PROCESSING."
	) 

	time.sleep(5) # Simulate inferencing on CSV

	update_job_status( # We finished the job
		db_prod,
		upload_id,
		user_id,
		timestamp,
		100, # Dummy number
		"SUCCESS",
		"COMPLETE"
	) 
	client.close()
	print("[INFO] DB Connection closed successfully!")
	return


# Some imported bootstrapping logic from ml-naacp repo
def bootstrap_MongoDB_Prod():
    """
    Connects to local DB and just adds the 'uploads' and 'discarded' collections
    """
    try:
        client = MongoClient("mongodb://localhost:27017") # Local Development Port
        defined_collection_names = ["uploads", "discarded"]
        
        if (client == None):
            raise Exception("No database was given!")

        db_prod = client["se_naacp_db"]
            
        # Here we check for the upload collection and make it if it doesn't exist
        collection_list = db_prod.list_collection_names()
        for collection in defined_collection_names:
            if collection not in collection_list:
                db_prod.create_collection(collection)
                print(f"[INFO] Collection '{collection}' created.\n")
                
        return client
    except Exception as err:
        print(f"[Error!] Error in Bootstrapping MongoDB Prod DB\nError: {err}")
        raise Exception("Fatal Error in MongoDB Boostrap")
    
# The upload job status function
def update_job_status(db_prod, upload_id, user_id, timestamp, article_cnt, status, message):
	"""
	Updates the Job Status in the local DB
	"""
	try:
		db = db_prod
		upload_collection = db["uploads"]
		if (upload_collection.find_one({'uploadID': upload_id})):
			upload_collection.find_one_and_update(
				{'uploadID': upload_id},
				{'$set': {'status': status}}
			)
			upload_collection.find_one_and_update(
				{'uploadID': upload_id},
				{'$set': {'message': message}}
			)
			upload_collection.find_one_and_update(
				{'uploadID': upload_id},
				{'$set': {'article_cnt': article_cnt}}
			)
		else: # We didn't find one and we have to label it as unknown
			new_status = {
				"uploadID": upload_id, 
				"userID":user_id,
				"timestamp": str(timestamp), 
				"article_cnt": article_cnt, 
				"status" : status,
				"message": message
			}
			upload_collection.insert_one(new_status)
		print(f"[INFO] Job: {upload_id} is now of status {status}.")
	except Exception as err:
		print(f"[Job Error!] {err}")
		raise Exception("[Job Error!] Failed to update Job Status")
	return 


