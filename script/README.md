# Running the Climate Change Script Locally with Docker

This guide will help you build and run the climate change script locally using Docker. By following these steps, you can easily set up a containerized environment for development or testing, without needing to install dependencies directly on your machine.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system.

## Steps to Run Locally

1. **Clone the Repository**

   If you haven't already, clone the repository to your local machine:

   ```bash
   git clone https://github.com/BHK4321/climate-change.git
   cd climate-change/script
   ```

2. **Build the Docker Image**

   Build the Docker image using the following command:

   ```bash
   docker build -t climate-change-script .
   ```

3. **Run the Docker Container**

   Run the container, mapping port `8000` on your host to port `8000` in the container:

   ```bash
   docker run -p 8000:8000 climate-change-script
   ```

4. **Access the Application**

   Once the container is running, the application will be accessible at:

   ```
   http://localhost:8000
   ```

## Stopping the Container

To stop the running container, press `Ctrl+C` in the terminal where it's running, or use `docker ps` to find the container ID and stop it:

```bash
docker ps
docker stop <container_id>
```

## Troubleshooting

- **Port Already in Use:**  
  If you get an error that port `8000` is already in use, either stop the process using that port or change the mapping (e.g., `-p 8080:8000`).
- **Docker Not Installed:**  
  Ensure Docker is installed and running by executing `docker --version`.

## Additional Notes

- Make sure to update the Dockerfile if there are changes to dependencies or application code.
- You can pass environment variables or mount volumes as needed by extending the `docker run` command.

---

For more information, refer to the [official Docker documentation](https://docs.docker.com/get-started/).
