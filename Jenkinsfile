pipeline {
    agent any
    
    environment {
        // Docker
        DOCKERHUB_REPO = 'drnaragu/calculator-application'
        TAGE_NAME = 'v1'
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
                sh 'docker build -t $DOCKERHUB_REPO:$TAGE_NAME -f .'
            }
        }

        // Stage 4 : Push to Docker Hub
        stage('Push to Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    echo "DockerHub Login Successfull!!"
                    sh 'docker push $OCKERHUB_REPO:$TAGE_NAME'
                    echo "Image successfully pushed to docker hub"
                }
            }
        }
    }
}