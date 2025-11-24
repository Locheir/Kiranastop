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
    image: docker:24-dind
    securityContext:
      privileged: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    command:
      - dockerd-entrypoint.sh
    args:
      - --host=tcp://127.0.0.1:2375
      - --host=unix:///var/run/docker.sock
      - --storage-driver=overlay2
      - --registry-mirror=https://mirror.gcr.io
'''
    }
  }

  environment {
    IMAGE_NAME = "kirana-stop"
  }

  stages {

    stage('Install Dependencies') {
      steps {
        container('node') {
          sh 'npm install --prefer-offline --no-audit'
        }
      }
    }

    stage('Wait for Docker') {
      steps {
        container('dind') {
          sh '''
          echo "Waiting for Docker daemon..."
          for i in {1..30}; do
            docker info && break
            sleep 3
          done
          docker info
          '''
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        container('dind') {
          sh '''
          docker build --progress=plain -t kirana-stop:latest .
          docker images
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
      echo "✅ KiranaStop Successfully Deployed!"
    }
    failure {
      echo "❌ Deployment Failed"
    }
  }
}
