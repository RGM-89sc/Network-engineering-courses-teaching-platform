pipeline {
  agent {
    docker {
      image 'node:7.8'
      args '-p 3000:8082'
    }
  }
  stages {
    stage('ENV') {
      steps {
        sh 'sudo apt-get install -y build-essential python'
      }
    }
    stage('NPM INSTALL') {
      steps {
        sh 'cd vue/desktop && npm install --registry=https://registry.npm.taobao.org'

        sh 'cd server && npm install --registry=https://registry.npm.taobao.org'

        sh 'cd vue/mobile && npm install --registry=https://registry.npm.taobao.org'
      }
    }
    stage('BUILD') {
      steps {
        sh 'npm run desktop-build'

        sh 'npm run mobile-build'
      }
    }
  }
}