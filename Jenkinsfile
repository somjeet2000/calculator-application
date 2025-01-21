pipeline {
    agent any
    
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
                sh 'docker build -t docker push drnaragu/calculator-application:v1 -f .'
            }
        }
    }
}