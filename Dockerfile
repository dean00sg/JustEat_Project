# ใช้ base image ที่เป็น Python 3.12
FROM python:3.12-slim

# ติดตั้ง dependencies ที่จำเป็น
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# กำหนด working directory เป็น backend
WORKDIR /backend

# คัดลอกไฟล์ requirements.txt เข้าไปใน container
COPY requirements.txt .

# ติดตั้ง dependencies จาก requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโฟลเดอร์ backend ทั้งหมดไปใน container
COPY ./backend /backend

# เปิดพอร์ต 8000 เพื่อให้เข้าถึง FastAPI
EXPOSE 8000

# รัน FastAPI ด้วย Uvicorn โดยชี้ไปที่ routers.main:app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
