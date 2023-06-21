# BASH FUNCS
connectAndPopulate() {
    trap "exit" INT
    for (( c=1; c<=5; c++ )) # five pings, if successful, run node.js populate
    do 
        echo "Pinging MongDB using HTTP ()"
        rawResponse=mongostat --uri=mongodb://localhost:27017
        if [[ $rawResponse == *"error"* ]]; then
            echo "It's there!"
        fi
        
    done
}

echo '  ________  ___  ___'     
echo ' |\   __  \|\  \|\  \'    
echo ' \ \  \|\ /\ \  \ \  \'   
echo '  \ \   __  \ \  \ \  \'  
echo '   \ \  \|\  \ \  \_\  \' 
echo '    \ \_______\ \_______\'
echo '     \|_______|\|_______|'

echo ' ________  ________  ________  ________  ___  __'       
echo '|\   ____\|\   __  \|\   __  \|\   __  \|\  \|\  \'      
echo '\ \  \___|\ \  \|\  \ \  \|\  \ \  \|\  \ \  \/ /|\'     
echo ' \ \_____  \ \   ____\ \   __  \ \   _  _\ \   ___ \'    
echo '  \|____|\  \ \  \___|\ \  \ \  \ \  \ \  \\ \  \\ \  \'   
echo '    ____\_\  \ \__\    \ \__\ \__\ \__\ \ _\\ \__\\ \__\'   
echo '   |\_________\|__|     \|__|\|__|\|__|\|__|\|__| \|__|' 
echo '   \|_________|'

echo "Running Mongo Spin Up Script! Please make sure Docker Dameon is running."
echo "Please wait as Mongo Community Edition is spinning up on docker!"
sleep 1
echo "Executing Docker checks!"
if [[ "$(docker images -q arm64v8/mongo:latest 2> /dev/null)" == "" ]]; then
  echo "Mongo Not Image found! Fetching and Building..."
  docker pull arm64v8/mongo # Pull the Mac M1 Version
  docker build . -t arm64v8/mongo # Build
fi
docker run --rm -p 27017:27017 arm64v8/mongo # run image

# Run these in parallel
# connectAndPopulate
