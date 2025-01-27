pipeline {
    agent any
    
    environment {
        // Docker
        DOCKERHUB_REPO = 'drnaragu/calculator-application'
        TAGE_NAME = 'v1'

        //EC2 instance details
        SSH_KEY = 'ssh-key-id-calculator-application'
        REMOTE_HOST = '13.126.130.81'
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

        // Stage 3 : Static Code Analysis
        stage('Static code analysis') {
            steps{
                script {
                    def scannerHome = tool name: 'SonarScanner'
                    withSonarQubeEnv('Sonar-Server') {
                        sh "${scannerHome}/bin/sonar-scanner \
                            -D sonar.projectKey=Calculator-Application \
                            -D sonar.host.url=http://65.0.129.91:9000"
                    }
                }
            }
        }


        // Stage 4 : Sonarqube code quality check
        stage('SonarQube Code quality check') {
            steps{
                script {
                def qualityGate = waitForQualityGate()
                    
                    if (qualityGate.status != 'OK') {
                        echo "${qualityGate.status}"
                        error "Quality Gate failed: ${qualityGate.status}"
                    }
                    else {
                        echo "${qualityGate.status}"
                        echo "SonarQube Quality Gates Passed"
                    }
                }

            }
        }

        //Satge 5 : Run Test cases
        stage('Run Test cases') {
            agent {
               docker {
                    image 'node:20-alpine'
                    args '--user root -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                script {
                    try {
                        sh 'npm install'
                        sh 'npm test'
                        echo 'All Test cases passed👍'
                    } catch (Exception e) {
                        throw e
                    }  
                }
            }
        }

        // Stage 6 : Build Docker image
        stage('Build Docker image') {
            steps {
                sh 'docker build -t $DOCKERHUB_REPO:$TAGE_NAME -f Dockerfile .'
            }
        }

        // Stage 7 : Push to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    echo "DockerHub Login Successfull!!"
                    sh 'docker push $DOCKERHUB_REPO:$TAGE_NAME'
                    echo "Image successfully pushed to docker hub"
                }
            }
        }

        // Stage 8 : Deploy image to EC2 Instance Application Server
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