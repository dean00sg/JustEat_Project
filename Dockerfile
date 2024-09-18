# Use the official PostgreSQL image from Docker Hub
FROM postgres:13

# Set environment variables
ENV POSTGRES_PASSWORD=123456

# Expose the PostgreSQL port
EXPOSE 5432


#6
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
