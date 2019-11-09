pipeline {
  agent {
    docker {
      image 'node:lts'
      args '-p 3000:8082'
    }
  }
  stages {
    stage('NPM INSTALL') {
      steps {
        sh 'sudo apt-get install -y build-essential python'
        
        sh 'cd vue/desktop && npm install --registry=https://registry.npm.taobao.org'

        sh 'cd server && npm install --registry=https://registry.npm.taobao.org'

        sh 'cd vue/mobile && npm install --registry=https://registry.npm.taobao.org'
      }
    }
    stage('Start') {
      steps {
        sh 'npm run desktop-build'
      }
    }
  }
}