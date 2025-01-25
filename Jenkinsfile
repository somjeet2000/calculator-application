pipeline{

agent any

environment{
    DOCKERHUB_REPO='sandyp214/node-js-server-jenkins'
    IMAGE_VERSION='v1'
}

stages{

    //Stage 1 : Clean Workspace
    stage('Clean Workspace'){
        steps{
            cleanWs()
        }
    }

    //Stage 2: Code Checkout from GIT
    stage('Checkout Code'){
        steps{
           checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/SandipyPatil/calculator-application.git']]) 
        }
    }

    //stage 3: Build Docker image
    stage('Build Docker Image'){
        steps{
            sh 'docker build -t $DOCKERHUB_REPO:IMAGE_VERSION -f .'
        }
    }

    //stage 4: Push to DockerHub
    stage('Push to DockerHub'){
        steps{
            withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIALS', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                sh 'docker login -u $DOCKERHUB_USERNAME -p DOCKERHUB_PASSWORD'
                echo 'Dockerhub login Successful'
                sh 'docker push $DOCKERHUB_REPO:IMAGE_VERSION'
                echo 'Image successfully pushed to Dockerhub 🚴‍♀️'
            }
        }
    }
}

}