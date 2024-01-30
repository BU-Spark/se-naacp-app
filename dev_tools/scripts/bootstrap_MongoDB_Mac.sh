echo ' _____ ______   ________  ________   ________  ________  ________  ________'
echo '|\   _ \  _   \|\   __  \|\   ___  \|\   ____\|\   __  \|\   ___ \|\   __  \'
echo '\ \  \\\\\__\ \  \ \  \|\  \ \  \\\ \  \ \  \___|\ \  \|\  \ \  \_|\ \ \  \|\ /_'
echo ' \ \  \\\|__| \  \ \  \\\\\  \ \  \\\ \  \ \  \  __\ \  \\ \\  \ \  \ \\\ \ \   __  \'
echo '  \ \  \    \ \  \ \  \\\\\  \ \  \\\ \  \ \  \|\  \ \  \\_\\  \ \  \_\\\ \ \  \|\  \'
echo '   \ \__\    \ \__\ \_______\ \__\\\ \__\ \_______\ \_______\ \_______\ \_______\'
echo '    \|__|     \|__|\|_______|\|__| \|__|\|_______|\|_______|\|_______|\|_______|'

echo "Bootstrapping MongoDB!"
echo "--------------------------------------------------------"

# Some local variables
MONGO_HOST="localhost"
MONGO_PORT="27017"
JSON_DIR="$(pwd)/sample_data"
MONGO_DB="se_naacp_db" # TODO: This is an env defined from bootstrap script

echo "Conducting Docker Checks..."

docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Docker daemon is not running."
    exit 1
fi
if [[ "$(docker images -q arm64v8/mongo:latest 2> /dev/null)" == "" ]]; then
  echo "Mongo Not Image found! Fetching and Building..."
  docker pull arm64v8/mongo # Pull the Mac M1 Version
  docker build . -t arm64v8/mongo # Build
fi
echo "Done!"

echo "Starting MongoDB server at default port: 27017!"
docker run -d -p 27017:27017 --name shiply-db arm64v8/mongo # Run image, and detach it to be a background process

# Potential Bug pitfall if we have to wait for MongoDB forever...
wait_for_mongo_and_insert() {
    echo "Waiting for MongoDB to be ready..."
    while ! docker exec shiply-db mongosh --eval "db.stats()" > /dev/null 2>&1; do
        sleep 1
    done
    echo "MongoDB is ready!"
    echo "Inserting Data..."
    for json_file in "$JSON_DIR"/*.json; do
        COLLECTION_NAME=$(basename "$json_file" .json) # Collection name is in the files

        # Import JSON file into MongoDB
        mongoimport --host "$MONGO_HOST" --port "$MONGO_PORT" --db "$MONGO_DB" --collection "$COLLECTION_NAME" --jsonArray --file "$json_file"
        
        if [ $? -ne 0 ]; then
            echo "Failed to import $json_file"
            exit 1
        else
            echo "Successfully imported $json_file"
        fi
    done
    echo "Done!"
}

wait_for_mongo_and_insert