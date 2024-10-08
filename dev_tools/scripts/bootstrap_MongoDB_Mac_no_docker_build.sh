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
JSON_DIR="$(pwd)/sample_data" # This depends on your shell pwd!
MONGO_DB="se_naacp_db" # TODO: This is an env defined from bootstrap script

# Potential Bug pitfall if we have to wait for MongoDB forever...
wait_for_mongo_and_insert() {
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