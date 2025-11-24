pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: node
    image: node:18
    command: ["cat"]
    tty: true

  - name: dind
    image: docker:dind
    args:
      - "--registry-mirror=https://mirror.gcr.io"
      - "--storage-driver=overlay2"
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""

  volumes: []
'''
    }
  }

  environment {
    IMAGE_NAME = "kirana-stop"
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {

    stage('Install Dependencies') {
      steps {
        container('node') {
          sh 'npm install --prefer-offline --no-audit --progress=true'
        }
      }
    }

    stage('Wait for Docker') {
      steps {
        container('dind') {
          sh '''
          echo "Waiting for Docker..."
          for i in {1..15}; do
            docker info && break
            sleep 2
          done
          '''
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        container('dind') {
          sh '''
          docker build --progress=plain -t kirana-stop:latest .
          docker image ls
          '''
        }
      }
    }

    stage('Run Application') {
      steps {
        container('dind') {
          sh '''
          docker stop kirana-stop || true
          docker rm kirana-stop || true

          docker run -d \
          --name kirana-stop \
          --restart always \
          -p 3001:3001 \
          kirana-stop:latest
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ KiranaStop Successfully Deployed"
    }
    failure {
      echo "❌ Deployment Failed"
    }
  }
}
