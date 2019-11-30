pipeline {
  agent {
    docker {
      image 'node:7.8'
      args '-p 3001:9000'
    }
  }
  stages {
    stage('ENV') {
      steps {
        sh 'npm config set registry https://registry.npm.taobao.org'

        sh 'sudo apt-get install -y build-essential python'
      }
    }
    stage('NPM INSTALL') {
      steps {
        sh 'cd vue/desktop && npm install'

        sh 'cd server && npm install'

        sh 'cd vue/mobile && npm install'
      }
    }
    stage('BUILD') {
      steps {
        sh 'npm run desktop-build'

        sh 'npm run mobile-build'
      }
    }
    stage('MAKE') {
      steps {
        sh 'rm -f server/public/d && rm -f server/public/m'

        sh 'cp vue/desktop/dist/ server/public/d && cp vue/mobile/dist/ server/public/m'
      }
    }
    stage('START') {
      steps {
        // sh 'npm run server-start'
      }
    }
  }
}