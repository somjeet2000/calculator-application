pipeline{

agent any

environment{
    DOCKERHUB_REPO='sandyp214/node-js-server-jenkins'
    IMAGE_VERSION='v1'

    //EC2 Instance Details
    SSH_KEY='ssh-key-id-simple-node-server'
    REMOTE_HOST='13.201.41.69'
    REMOTE_USER='ubuntu'
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
            sh 'docker build -t $DOCKERHUB_REPO:IMAGE_VERSION .'
        }
    }

    //stage 4: Push to DockerHub
    stage('Push to DockerHub'){
        steps{
            withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIALS', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                echo 'Dockerhub login Successful'
                sh 'docker push $DOCKERHUB_REPO:IMAGE_VERSION'
                echo 'Image successfully pushed to Dockerhub 🚴‍♀️'
            }
        }
    }

    //Deploy to EC2 Instance
    stage('Deploy to Server'){
        steps{
            sshagent([SSH_KEY]){
            sh '''echo "Connecting wih the server $REMOTE_HOST"
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST <<EOF
echo "Server Connected."
echo "Pulling Latest Docker Image.."
echo "Using Docker Image $DOCKERHUB_REPO:$IMAGE_VERSION"
docker pull $DOCKERHUB_REPO:$IMAGE_VERSION
echo "Stopping and removing Existing Container if Exists"
docker stop node-js-server-jenkins || true
docker remove node-js-server-jenkins || true
echo "Running new Container"
docker run -d --name node-js-server-jenkins -p 5000:5000 $DOCKERHUB_REPO:$IMAGE_VERSION
EOF'''    
            }
        }
    }
}

}