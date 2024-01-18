FROM jenkins/jenkins:jdk17
USER root


ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NOWARNINGS="yes"

RUN apt-get -y update &&\
    apt-get install -y --no-install-recommends \
    vim \
    apt-utils

RUN apt-get install ca-certificates curl gnupg lsb-release -y

RUN mkdir -p /etc/apt/keyrings &&\
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg &&\
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null &&\
    apt-get -y update

RUN apt-get install docker-ce docker-ce-cli containerd.io docker-compose docker-compose-plugin -y

RUN if [ -e /var/run/docker.sock ]; then chown jenkins:jenkins /var/run/docker.sock; fi &&\
    usermod -aG docker jenkins

RUN apt install sudo

USER jenkins

EXPOSE 8080