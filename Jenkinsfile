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

  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command:
      - sleep
    args:
      - 9999999
    volumeMounts:
    - name: kaniko-cache
      mountPath: /kaniko/.cache

  volumes:
  - name: kaniko-cache
    emptyDir: {}
'''
    }
  }

  stages {

    stage('Install Dependencies') {
      steps {
        container('node') {
          sh 'npm install --prefer-offline --no-audit'
        }
      }
    }

    stage('Build Docker Image using Kaniko') {
      steps {
        container('kaniko') {
          sh '''
          echo "Building image with Kaniko..."
          /kaniko/executor \
            --context=dir://$PWD \
            --dockerfile=Dockerfile \
            --destination=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/kirana/kirana-stop:latest \
            --skip-tls-verify \
            --cache=true
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ IMAGE BUILT & PUSHED SUCCESSFULLY"
    }
    failure {
      echo "❌ BUILD FAILED"
    }
  }
}
