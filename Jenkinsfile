pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    args: 
    - "--storage-driver=overlay2"
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  volumes:
  - name: workspace-volume
    emptyDir: {}
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {

        stage('CHECK') {
            steps {
                echo "DEBUG >>> SINGLE-COMPONENT JENKINSFILE IS ACTIVE"
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        // Assumes Dockerfile is located at ./server/Dockerfile
                        sleep 15
                        docker build -t server:latest ./server
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    // **ACTION: Ensure this credential ID exists in Jenkins.**
                    withCredentials([string(credentialsId: '2401061-kirana-stop', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401061-kirana-stop \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker --version
                        sleep 10
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag + Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag server:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/server:latest

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/server:latest
                    '''
                }
            }
        }

        stage('Create Namespace + Secrets') {
            steps {
                container('kubectl') {
                    // **ACTION: You MUST create these 6 credentials in Jenkins for your project.**
                    withCredentials([
                        string(credentialsId: 'mongo-uri-2401061', variable: 'MONGODB_URL'),
                        string(credentialsId: 'jwt-secret-2401061', variable: 'JWT_SECRET_KEY'),
                        string(credentialsId: 'session-secret-2401061', variable: 'SESSION_SECRET_KEY'),
                        string(credentialsId: 'reset-key-2401061', variable: 'SECRET_RESET_KEY'),
                        string(credentialsId: 'gmail-user-2401061', variable: 'EMAIL_USER'),
                        string(credentialsId: 'gmail-pass-2401061', variable: 'EMAIL_PASS')
                    ]) {
                        sh '''
                            # Create namespace
                            kubectl get namespace 2401061 || kubectl create namespace 2401061

                            # Docker registry pull secret
                            kubectl create secret docker-registry nexus-secret \
                              --docker-server=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                              --docker-username=admin \
                              --docker-password=Changeme@2025 \
                              --namespace=2401061 || true

                            # Application secrets
                            kubectl create secret generic server-secret -n 2401061 \
                              --from-literal=MONGODB_URL="$MONGODB_URL" \
                              --from-literal=JWT_SECRET_KEY="$JWT_SECRET_KEY" \
                              --from-literal=SESSION_SECRET_KEY="$SESSION_SECRET_KEY" \
                              --from-literal=SECRET_RESET_KEY="$SECRET_RESET_KEY" \
                              --from-literal=EMAIL_USER="$EMAIL_USER" \
                              --from-literal=EMAIL_PASS="$EMAIL_PASS" || true
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    dir('k8s-deployment') { 
                        sh """
                            # 1. Update Image Tag to match the Build
                            sed -i 's|server:latest|server:${BUILD_NUMBER}|g' deployment.yaml
                            
                            # 2. Deploy
                            kubectl apply -f deployment.yaml
                            
                            # 3. Print status 
                            kubectl get pods -n 2401061
                        """
                    }
                }
            }
        }
    }
}