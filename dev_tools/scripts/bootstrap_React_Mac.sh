echo '________  _______   ________  ________ _________    '
echo '|\   __  \|\  ___ \ |\   __  \|\   ____\\\___   ___\ '
echo '\ \  \|\  \ \   __/|\ \  \|\  \ \  \___\|___ \  \_| '
echo ' \ \   _  _\ \  \_|/_\ \   __  \ \  \       \ \  \  '
echo '  \ \  \\\  \\\ \  \_|\ \ \  \ \  \ \  \____   \ \  \ '
echo '   \ \__\\\ _\\\ \_______\ \__\ \__\ \_______\  \ \__\'
echo '    \|__|\|__|\|_______|\|__|\|__|\|_______|   \|__|'

echo "Bootstrapping React Client!"
echo "--------------------------------------------------------"
echo "Exporting ENV vars..."
source ./env_react.sh # Exports the ENV vars we need!
echo "Done!"
echo "Confirming successful export..."
printenv | grep "REACT_APP_NAACP_DEPLOYMENT_URI"
printenv | grep "REACT_APP_AUTH0_DOMAIN"
printenv | grep "REACT_APP_AUTH0_CLIENT_ID"
printenv | grep "REACT_APP_AUTH0_REDIRECT_URI"
printenv | grep "REACT_APP_ML_PIP_URL"
printenv | grep "REACT_APP_CLERK_PUBLISHABLE_KEY"
echo "Done!"
echo "Starting React Client server..."

# Find GraphQL folder
DIR_NAME="se-naacp-app"
#SEARCH_PATH="/" # Root is the default, but you can change it
SEARCH_PATH="/Users/zacharyg/Documents/Github" # For me

# Find the directory and read the first result into a variable
PROJECT_ROOT_DIR=$(find "$SEARCH_PATH" -type d -name "$DIR_NAME" 2>&1 | grep -v "Permission denied" | head -n 1)

# Check if the directory was found and print its path
if [ -n "$PROJECT_ROOT_DIR" ]; then
    cd $PROJECT_ROOT_DIR/frontend/src
    npm install # Just incase
    npm run dev
else
    echo "Project directory not found. React Client Bootstrap Failed!"
fi