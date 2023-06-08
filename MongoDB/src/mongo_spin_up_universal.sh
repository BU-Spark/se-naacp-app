echo "Running Mongo Spin Up Script! Please make sure Docker Dameon is running."
echo "Please wait as Mongo Community Edition is spinning up on docker!"
docker pull mongo # Pull the Mac M1 Version
docker build . -t mongo # Build
docker run -p 27017:27017 mongo # run image
