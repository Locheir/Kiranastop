pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    command:
    - dockerd
    args:
    - --host=unix:///var/run/docker.sock
    - --storage-driver=overlay2
"""
        }
    }

    environment {
        IMAGE_NAME = "kirana-stop"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Locheir/Kiranastop.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                container('docker') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                    docker images
                    """
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                container('docker') {
                    sh '''
                    docker stop kirana-stop || true
                    docker rm kirana-stop || true
                    '''
                }
            }
        }

        stage('Run New Container') {
            steps {
                container('docker') {
                    sh '''
                    docker run -d \
                    --name kirana-stop \
                    --restart always \
                    --env-file .env \
                    -p 3001:3001 \
                    kirana-stop:latest
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 10'
                sh 'curl -I http://localhost:3001 || echo "App not responding"'
            }
        }
    }

    post {
        success {
            echo "✅ Kirana Stop Successfully Deployed & Running"
        }
        failure {
            echo "❌ Deployment Failed - Check Jenkins Console Logs"
        }
    }
}