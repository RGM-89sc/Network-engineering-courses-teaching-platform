pipeline {
  agent {
    docker {
      image 'node:10.17'
      args '-p 3000:9000'
    }
  }
  stages {
    stage('ENV') {
      steps {
        sh 'npm config set registry https://r.cnpmjs.org/'
        
        sh 'apt-get update'
        sh 'apt-get install -y build-essential'
      }
    }

    stage('NPM INSTALL') {
      steps {
        // sh 'cd vue/desktop && npm install'

        sh 'cd server && npm install'

        // sh 'cd vue/mobile && npm install'
      }
    }

    // 服务器内存不足，跑不起npm run build，需要手动build
    // stage('BUILD') {
    //   steps {
    //     sh 'npm run desktop-build'

    //     sh 'npm run mobile-build'
    //   }
    // }

    stage('MAKE') {
      steps {
        sh 'rm -rf server/public/d && rm -rf server/public/m'

        sh 'cp -r vue/desktop/dist/ server/public/ && mv server/public/dist server/public/d'
        sh 'cp -r vue/mobile/dist/ server/public/m && mv server/public/dist server/public/m'
      }
    }

    stage('START') {
      steps {
        sh 'npm run server-start'
      }
    }
  }
}