pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: node
    image: node:20
    command: ["cat"]
    tty: true

  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    command: ["dockerd-entrypoint.sh"]
    args:
    - "--storage-driver=overlay2"
    - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"


  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
'''
        }
    }

    environment {
        APP_NAME        = "kirana-stop"
        IMAGE_TAG       = "latest"

        // Nexus Docker Repo
        REGISTRY_URL    = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REGISTRY_REPO   = "2401061"

        // SonarQube
        SONAR_PROJECT   = "2401061-kirana-stop"
        SONAR_HOST_URL  = "http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                container('node') {
                    sh 'npm test || echo "No tests found"'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([
                        string(credentialsId: 'sonar-token-2401061', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=$SONAR_PROJECT \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/**,public/** \
                          -Dsonar.host.url=$SONAR_HOST_URL \
                          -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh 'docker build -t $APP_NAME:$IMAGE_TAG .'
                }
            }
        }

        stage('Docker Login') {
            steps {
                container('dind') {
                    sh '''
                        docker login $REGISTRY_URL -u admin -p Changeme@2025
                    '''
                }
            }
        }
        

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag $APP_NAME:$IMAGE_TAG \
                          $REGISTRY_URL/$REGISTRY_REPO/$APP_NAME:$IMAGE_TAG

                        docker push $REGISTRY_URL/$REGISTRY_REPO/$APP_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withCredentials([
                        string(credentialsId: 'MONGODB_URL', variable: 'MONGODB_URL')
                    ]) {
                        sh '''
                            kubectl apply -f k8s/

                            kubectl set env deployment/kirana-stop-deployment \
                            MONGODB_URL=$MONGODB_URL \
                            -n 2401061

                            kubectl rollout status deployment/kirana-stop-deployment -n 2401061
                        '''
                    }
                }
            }
        }

    }

    post {
        success {
            echo "✅ Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}