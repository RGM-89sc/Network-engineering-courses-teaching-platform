pipeline {
  agent {
    docker {
      image 'node:lts'
      args '-p 3000:8082'
    }
  }
  stages {
    stage('Build') {
      steps {
        sh 'cd vue/desktop && npm install'
      }
    }
    stage('Start') {
      steps {
        sh 'npm run desktop-start'
      }
    }
  }
}