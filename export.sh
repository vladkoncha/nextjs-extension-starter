#!/bin/bash

# Must be the same as in remove-inline-scripts.js
NEXT_FOLDER="next"

# Remove the existing folder if it exists
rm -rf ./out/$NEXT_FOLDER

# Rename the _next folder to next-assets
mv ./out/_next ./out/$NEXT_FOLDER

# Replace occurrences of _next with your desired folder name
find ./out -type f -name '*.html' -exec sed -i '' "s@/_next/@/$NEXT_FOLDER/@g" {} +

echo 'successfully renamed _next folder'
