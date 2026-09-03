# Backend

This directory contains the backend server for the Spoonful application.

#### Running the Backend

To start the backend services, run the following command. This will build the Docker images and start the containers in detached mode.

###### (Depending on your environment, all docker commands may need to be preceeded by `sudo`)

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

Use this command when you want to start the backend server for the first time or when you have made changes to the Dockerfile or the backend code.

#### Stopping the Backend

To stop the backend services, 
1. press `docker ps` to get the list of docker processes
2. `docker stop 1b997d` the ones you want to stop (1b997d being just an example, use the id from your `docker ps` list)

Use this when you want to stop the running backend services.

#### Viewing Logs

To view the logs for a specific service, use the following commands.

For the API service:

```bash
docker compose -f docker-compose.dev.yml logs -f api
```

For the database service:

```bash
docker compose -f docker-compose.dev.yml logs -f mongo
```

Use these commands to debug issues or monitor the output of the backend services. The `-f` flag follows the log output.

#### Pruning Containers

To remove stopped containers, run the following command:

```bash
docker container prune
```

Use this command to clean up your system and remove unused containers. This can help free up disk space.

#### Deployment

Review the deployment lesson from earlier in the course for the steps to deploy this backend.
