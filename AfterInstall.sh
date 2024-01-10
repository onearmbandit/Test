#!/bin/bash
#npm install

echo "DEPLOYMENT_GROUP_NAME = $DEPLOYMENT_GROUP_NAME"
echo "LIFECYCLE_EVENT = $LIFECYCLE_EVENT"
echo "DEPLOYMENT_ID = $DEPLOYMENT_ID"
echo "APPLICATION_NAME = $APPLICATION_NAME"
echo "DEPLOYMENT_GROUP_ID = $DEPLOYMENT_GROUP_ID"
echo "==================="
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export HOME="/home/ubuntu/"

if [[ "${DEPLOYMENT_GROUP_NAME}" = "DG-C3-Dev" ]]; then
  cd /home/ubuntu/project/C3/
  git checkout .
  git pull origin dev
  echo "in dev if"
elif [[ "${DEPLOYMENT_GROUP_NAME}" = "DG-C3-Stage" ]]; then
  /home/ubuntu/project/C3/
  git checkout .
  git pull origin stage
  echo "in stage if"
else
  cd /home/ubuntu/sites/C3/
  git checkout .
  git pull origin master
  echo "in master else"
fi
cd api/
nvm use
yarn install
yarn build
cp .env build/
cd build
yarn install --production
cd ../../

cd web/
nvm use
npm install
npm run build

pm2 restart all
