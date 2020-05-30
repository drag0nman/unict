create_env_file() {
  echo "SETTING ENV VARIABLES: Start"
  touch .env
  echo 'CODECOV_TOKEN=3c4e7842-11c1-4d90-ab84-13cfa22d4e4f' > .env
  echo "SETTING ENV VARIABLES: End"
}

if [ ! -f ".env" ]
  then
    create_env_file
  fi
    rm -rf .env
    create_env_file