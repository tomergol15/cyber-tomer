
FROM python:3.10-slim

WORKDIR /sandbox

COPY malware_example.py .

RUN apt-get update && apt-get install -y iputils-ping

CMD ["python", "malware_example.py"]