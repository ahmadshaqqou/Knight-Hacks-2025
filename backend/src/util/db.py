from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

database_name = "DB"


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

def create_lawyer(email: str, name: str, picture: str):
    try:
        client = get_mongo_client()
        collection = get_lawyers_collection(client)
        collection.insert_one({
            "email": email,
            "name": name,
            "picture": picture
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