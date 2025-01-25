pipeline{

agents any

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

        }
    }
}

}