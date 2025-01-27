pipeline {
    agent any

    environment {
        // DockerHub
        DOCKERHUB_REPO = 'somjeetsrimani/calculator-application'
        IMAGE_TAG = 'v1'

        // App Server
        SSH_KEY = 'SSH-Key-ID-Calculator_Application'
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
                script {
                    // Check if Branch is selected as Other, and Other is empty
                    if (params.Branch == 'Other' && !params.Other?.trim()) {
                        error "Branch Name is required when selected 'Other' for Branch!"
                    }

                    // Determine the branch to select
                    def branchToCheckout = params.Branch == 'Other' ? params.Other : params.Branch
                    echo "Branch to Build: ${branchToCheckout}"

                    checkout scmGit(
                        branches: [[name: "*/${branchToCheckout}"]], 
                        extensions: [], 
                        userRemoteConfigs: [[url: 'https://github.com/somjeet2000/calculator-application.git']])
                }
            }
        }

        // Stage 3 - Static Code Analysis
        stage('Static Code Analysis') {
            steps {
                script {
                    def scannerHome = tool name: 'SonarScanner';
                    withSonarQubeEnv('SonarServer') {
                        sh "${scannerHome}/bin/sonar-scanner \
                            -D sonar.projectKey=calculator-application \
                            -D sonar.host.url=http://13.233.190.206:9000"
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
        }

        // Stage 5 - Run test cases
        stage('Run Tests') {
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
                        echo "👍 All Test Cases Passed!"
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
                withCredentials([usernamePassword(credentialsId: 'Dockerhub_Credentials', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    echo 'DockerHub Login Successful 🎉'
                    sh 'docker push $DOCKERHUB_REPO:$IMAGE_TAG'
                    echo 'Image succesfully pushed to DockerHub 🎊'
                }
            }
        }

        // Stage 8 - Deploy to Application Servers
        stage('Deploy to Servers') {
            steps {
                script {
                    echo "Selected Servers: ${params.Servers}"
                    def selectedServers = params.Servers.split(',')

                    selectedServers.each {server -> 
                        sshagent([SSH_KEY]) {
                            sh '''echo "Connecting with the server ${server}"
ssh -o StrictHostKeyChecking=no $REMOTE_USER@${server} <<EOF
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
    }
}
