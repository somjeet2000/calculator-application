pipeline {
    agent any

    environment {
        //SonarQube
        SONAR_HOST = 'http://13.201.40.242:9000/'
        SONAR_PROJECTKEY = 'calculator-application'

        // DockerHub
        DOCKERHUB_REPO = 'somjeetsrimani/calculator-application'
        IMAGE_TAG = 'v1'

        // App Server
        SSH_KEY = 'SSH-KEY-ID-CALCULATOR-APPLICATION'
        REMOTE_HOST = '13.233.78.128'
        REMOTE_USER = 'ubuntu'

    }

    stages {
        // Stage 1 - Clean Workspace
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        // Stage 2 - Code checkout
        stage('Code Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/somjeet2000/calculator-application.git']])
            }
        }

        // Stage 3 - Static Code Analysis
        stage('Static Code Analysis') {
            steps {
                script {
                    def scannerHome = tool 'Sonar-Scanner'
                    withCredentials([string(credentialsId: 'Sonar-Token', variable: 'SONAR_TOKEN')]) {
                        withSonarQubeEnv('Sonar-Server') {
                            sh 'echo ${scannerHome}'
                            sh '''
                                ${scannerHome}/bin/sonar-scanner --version \
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECTKEY} \
                                -Dsonar.projectName=${SONAR_PROJECTKEY} \
                                -Dsonar.host.url=${SONAR_HOST} \
                                -Dsonar.login=${SONAR_TOKEN}
                            '''
                        }
                    }
                }
            }
        }

        // Stage 4 - SonarQube Quality Gate
        stage('SonarQube Quality Gate') {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {
                        def qualityGate = waitForQualityGate()
                        if (qualityGate.status != 'OK') {
                            error "Pipeline aborted due to quality gate failure: ${qualityGate.status}"
                        } else {
                            echo "SonarQube quality gate passed! 🎉"
                        }
                    }
                }
            }
        }

        // Stage 5 - Run Test Cases
        stage('Run Tests') {
            agent {
                docker {
                    image node:20-apline
                    args '--user root -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                script {
                    try {
                        sh 'npm install'
                        sh 'npm test'
                        echo '🎉 All Test Cases Passed!!'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        // Stage 6 - Build Docker Image
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_REPO:$IMAGE_TAG .'
            }
        }

        // Stage 7 - Push to DockerHub
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CRED', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    echo 'DockerHub Login Successful 🎉'
                    sh 'docker push $DOCKERHUB_REPO:$IMAGE_TAG'
                    echo 'Image succesfully pushed to DockerHub 🎊'
                }
            }
        }

        // Stage 8 - Deploy to Application Servers
        stage('Deploy to Server') {
            steps {
                sshagent([SSH_KEY]) {
                    sh '''echo "Connecting with the server $REMOTE_HOST"
ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST <<EOF
echo "🎉 Server Connected..."
echo "🚀 Pulling latest Docker image..."
echo "Using image: $DOCKERHUB_REPO:$IMAGE_TAG"
docker pull $DOCKERHUB_REPO:$IMAGE_TAG
echo "🚧 Stopping and removing existing container (if exists)..."
docker stop calculator-application || true
docker rm calculator-application || true
echo "🏃‍♂️‍➡️ Running new container..."
docker run -d --name calculator-application -p 5000:5000 $DOCKERHUB_REPO:$IMAGE_TAG
EOF'''
                }
            }
        }
    }
}