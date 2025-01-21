pipeline {
    agent any
    
    environment {
        // Docker
        DOCKERHUB_REPO = 'drnaragu/calculator-application'
        TAGE_NAME = 'v1'

        //EC2 instance details
        SSH_KEY = 'ssh-key-id-calculator-application'
        REMOTE_HOST = '3.108.220.4'
        REMOTE_USER = 'ubuntu'
    }
    
    stages {
         // Stage 1 : clean workspace
        stage("Clean Workspace") {
            steps{
                cleanWs()
            }
        }
        // Stage 2 : Code Checkout
        stage('Code Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/DivyaNaragund18/calculator-application.git']])
            }
        }

        // Stage 3 : Build Docker image
        stage('Build Docker image') {
            steps {
                sh 'docker build -t $DOCKERHUB_REPO:$TAGE_NAME -f Dockerfile .'
            }
        }

        // Stage 4 : Push to Docker Hub
        stage('Push to Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    echo "DockerHub Login Successfull!!"
                    sh 'docker push $DOCKERHUB_REPO:$TAGE_NAME'
                    echo "Image successfully pushed to docker hub"
                }
            }
        }

        // Stage 5 : Deploy image to EC2 Instance Application Server
        stage('Deploy to Application Server') {
            steps {
                sshagent([SSH_KEY]){
                    sh '''echo "Connecting with the server $REMOTE_HOST"
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST <<EOF
echo "Server connected....."
echo "Pulling latest docker image....."
echo "Using image : $DOCKERHUB_REPO:$TAGE_NAME"
docker pull $DOCKERHUB_REPO:$TAGE_NAME
echo "stopping and removing existing container(If exists)....."
docker stop calculator-application || true
docker rm calculator-application || true
echo "Running new docker container..."
docker run -d --name calculator-application -p 5000:5000 $DOCKERHUB_REPO:$TAGE_NAME
EOF'''
                }
            }
        }
    }
}