# Base image
FROM python:3.9-slim

# Copy the Fastapi app code to the working directory
COPY . /app

# Set the working directory in the container
WORKDIR /app

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Fastapi app port
EXPOSE 8000

# Start the Fastapi App
CMD ["python", "runApp.py"]