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
docker pull mongo 
docker build . -t mongo # Build
docker run -p 27017:27017 mongo # run image