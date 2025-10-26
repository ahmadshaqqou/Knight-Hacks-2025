from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
from bson.objectid import ObjectId


database_name = "db"


def get_mongo_client():
    load_dotenv()

    uri = os.getenv("MONGO_CONNNECTION_STRING")
    print(uri)

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)
        return None
    
def get_lawyers_collection(client):
    try:
        database = client.get_database(database_name)
        return database.get_collection("lawyers")
    except Exception as e:
        print("get_lawyers_collection")
        print(e)
        return None

def get_cases_collection(client):
    try:
        database = client.get_database(database_name)
        return database.get_collection("cases")
    except Exception as e:
        print("get_cases_collection")
        print(e)
        return None
    

def create_lawyer(email: str, name: str, picture: str):
    try:
        client = get_mongo_client()
        collection = get_lawyers_collection(client)
        collection.insert_one({
            "email": email,
            "name": name,
            "picture": picture,
            "cases": []
        })
        client.close()
    except Exception as e:
        print("create_lawyer")
        print(e)


def get_lawyer(email: str):
    try:
        client = get_mongo_client()
        collection = get_lawyers_collection(client)
        lawyer = collection.find_one({"email": email})
        client.close()
        return lawyer
    except Exception as e:
        print("get_lawyer")
        print(e)
        return None
    
def create_case(user_id: str, case_name: str, case_summary: str, client_name: str, client_email: str):
    try:
        client = get_mongo_client()
        cases_collection = get_cases_collection(client)
        db_res = cases_collection.insert_one({
            "user_id": user_id,
            "case_name": case_name,
            "case_summary": case_summary,
            "client_name": client_name,
            "client_email": client_email,
            "documents": [],
            "history": [],
            "emails": []
        })
        lawyers_collection = get_lawyers_collection(client)
        lawyer = lawyers_collection.find_one({"user_id": ObjectId(user_id)})
        if lawyer is not None:
            lawyers_collection.update_one({"_id": ObjectId(user_id)}, {"$push": {"cases": db_res.inserted_id}})
        client.close()
    except Exception as e:
        print("create_case")
        print(e)

def update_case_summary(case_id: str, case_summary: str):
    try:
        client = get_mongo_client()
        collection = get_cases_collection(client)
        case = collection.find_one({"_id": ObjectId(case_id)})
        if case is not None:
            collection.update_one({"_id": ObjectId(case_id)}, {"$set": {"case_summary": case_summary}})
        client.close()
    except Exception as e:
        print("update_case_summary")
        print(e)

def get_cases(user_id: str):
    try:
        client = get_mongo_client()
        collection = get_cases_collection(client)
        cases = list(collection.find({"_id": ObjectId(user_id)}))
        client.close()
        return cases
    except Exception as e:
        print("get_cases")
        print(e)
        return None