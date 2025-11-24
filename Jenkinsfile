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
    args:
    - --dockerfile=Dockerfile
    - --context=.
    - --destination=kirana-stop:latest
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

    stage('Build Image with Kaniko') {
      steps {
        container('kaniko') {
          sh '''
          echo "Building image using Kaniko..."
          /kaniko/executor \
            --context=dir://$PWD \
            --dockerfile=Dockerfile \
            --destination=kirana-stop:latest \
            --cleanup
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ IMAGE BUILT SUCCESSFULLY WITH KANIKO"
    }
    failure {
      echo "❌ BUILD FAILED"
    }
  }
}
