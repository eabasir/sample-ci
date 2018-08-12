pipeline {
  agent any
  stages {
    stage('fetch') {
      steps {
        git(url: 'https://github.com/eabasir/his-test.git', branch: env.BRANCH_NAME)
      }
    }
    stage('build composer') {
      steps {
        sh 'npm install'
        sh 'node docker-compose-builder.js'
      }
    }
    stage('setup containers') {
      steps {
        sh 'docker-compose up'
      }
    }
  }
  environment {
    NODE_ENV = 'test'
    DB_USER = credentials('DB_USER')
    DB_PASS = credentials('DB_PASS')
  }
  post {
    always {
      sh 'docker stop redis-$BUILD_NUMBER || echo "failed to stop redis-${BUILD_NUMBER}"'
      sh 'docker stop db-$BUILD_NUMBER || echo "failed to stop db-${BUILD_NUMBER}"'
      sh 'docker stop his-$BUILD_NUMBER || echo "failed to stop his-${BUILD_NUMBER}"'
      sh 'docker ps -aq --no-trunc -f status=exited | xargs docker rm || echo "failed to remove stopped containers"'
      sh 'docker rmi -f redis-$BUILD_NUMBER || echo "failed to remove redis-${BUILD_NUMBER}"'
      sh 'docker rmi -f db-$BUILD_NUMBER || echo "failed to remove db-${BUILD_NUMBER}"'
      sh 'docker rmi -f his-$BUILD_NUMBER || echo "failed to remove his-${BUILD_NUMBER}"'

    }

  }
}