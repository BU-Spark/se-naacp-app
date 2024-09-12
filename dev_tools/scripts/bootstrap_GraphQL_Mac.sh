echo ' ________  ________  ________  ________  ___  ___  ________  ___          '
echo '/|\   ___\|\   __  \|\   __  \|\   __  \|\  \|\  \|\   __  \|\  \        '
echo '\ \  \___|\ \  \|\  \ \  \|\  \ \  \|\  \ \  \\\\\  \ \  \|\  \ \  \        '
echo ' \ \  \  __\ \   _  _\ \   __  \ \   ____\ \   __  \ \  \\\\\  \ \  \       '
echo '  \ \  \|\  \ \  \\\  \\\ \  \ \  \ \  \___|\ \  \ \  \ \  \\\\\  \ \  \____  '
echo '   \ \_______\ \__\\\ _\\\ \__\ \__\ \__\    \ \__\ \__\ \_____  \ \_______\'
echo '    \|_______|\|__|\|__|\|__|\|__|\|__|     \|__|\|__|\|___| \__\|_______|'
echo '                                                            \|__|         '

echo "Bootstrapping Apollo Server GraphQL!"
echo "--------------------------------------------------------"
echo "Exporting ENV vars..."
source ./env_graphql.sh # Exports the ENV vars we need!
echo "Done!"
echo "Confirming successful export..."
printenv | grep "DB_NAME"
printenv | grep "NAACP_MONGODB"
echo "Done!"
echo "Starting GraphQL server..."

# Find GraphQL folder
DIR_NAME="se-naacp-app"
#SEARCH_PATH="/" # Root is the default, but you can change it
SEARCH_PATH="/Users/User/raheeqi/" # For me

# Find the directory and read the first result into a variable
PROJECT_ROOT_DIR=$(find "$SEARCH_PATH" -type d -name "$DIR_NAME" 2>&1 | grep -v "Permission denied" | head -n 1)

# Check if the directory was found and print its path
if [ -n "$PROJECT_ROOT_DIR" ]; then
cd /c/Users/User/se-naacp-app
    #cd $PROJECT_ROOT_DIR/backend
    npm install # Just incase
    pwd
    npm start
else
    echo "Project directory not found. GraphQL Bootstrap Failed!"
fi

