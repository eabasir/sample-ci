#!/bin/bash

git clone https://${GIT_CLIENT_CREDENTIALS}@${GIT_CLIENT_REPO}
cd ./his-client
npm i
git branch -r