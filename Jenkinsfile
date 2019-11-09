pipeline {
  agent {
    docker {
      image 'node:10'
      args '-p 3000:8082'
    }
  }
  environment {
      
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