from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException, Query, Body, Form

from typing import Callable
from concurrent import futures

from urllib.parse import unquote_plus

router = APIRouter()

@router.post("/test_endpoint")
async def upload_RSS(Payload: str = Body(..., description="Some String payload")):
	try:
		decoded_payload = str(unquote_plus(Payload)[8:])
		print("Passed in String:", decoded_payload)
		return JSONResponse(content={"String Payload": decoded_payload, "status": "String Successfully Uploaded"}, status_code=200)
	except Exception as e:
		raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")




