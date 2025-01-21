pipeline {
    agent any
    
    stages {
        stage("Clean Workspace") {
            steps{
                cleanWs()
            }
        }

        stage('Code Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/DivyaNaragund18/calculator-application.git']])
            }
        }
    }
}