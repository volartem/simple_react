FROM ubuntu:18.04
RUN apt update && apt upgrade -y && apt install python3-dev \
                   python3-setuptools \
                   python3-pip  -y
ENV LANG=C.UTF-8
ENV PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip3 install -r requirements.txt

RUN mkdir /code
WORKDIR /code
ADD . /code/
