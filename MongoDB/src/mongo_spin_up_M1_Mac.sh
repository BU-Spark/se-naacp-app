echo "Running Mongo Spin Up Script! Please make sure Docker Dameon is running."
echo "Please wait as Mongo Community Edition is spinning up on docker!"
docker pull arm64v8/mongo # Pull the Mac M1 Version
docker build . -t arm64v8/mongo # Build
docker run -p 27017:27017 arm64v8/mongo # run image
echo "\nMongoDB is running on instance: mongodb://localhost:27017\n"
