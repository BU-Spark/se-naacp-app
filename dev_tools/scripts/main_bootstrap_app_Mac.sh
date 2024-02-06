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

echo "Running Bootstrap Script. Starting process now..."
echo "--------------------------------------------------------"
echo "Please make sure that docker daemon is running!"
echo "ENVS are based on per terminal sessions, closing the shell session will lose exported ENV vars!"
echo "Performing startup checks..."
sleep 1
echo "Done!"
echo "Handing off bootstrap process to osascripts..."

# Here we start our seperate terminal sessions
# There is no concurrency control because I don't want to sit here and figure out inter-terminal communication
# One solution could use the fork() and jump to the processes needed to execute...

BOOTSTRAP_DIR=$(pwd) # Bootstrap dir

# MongoDB
osascript -e "tell application \"Terminal\" to do script \"cd $BOOTSTRAP_DIR; clear; sh ./bootstrap_MongoDB_Mac.sh\""
# GraphQL
osascript -e "tell application \"Terminal\" to do script \"cd $BOOTSTRAP_DIR; clear; sh ./bootstrap_GraphQL_Mac.sh\""
# React
osascript -e "tell application \"Terminal\" to do script \"cd $BOOTSTRAP_DIR; clear; sh ./bootstrap_React_Mac.sh\""

echo "Bootstrapping Done!" 
echo "Happy Coding!"
