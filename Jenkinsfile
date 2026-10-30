
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DEPLOY_DIR = '/var/lib/jenkins/apps/tugas-devops'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu

                    mkdir -p "$DEPLOY_DIR"

                    # Salin hasil standalone
                    rsync -a --delete \
                      .next/standalone/ "$DEPLOY_DIR/"

                    # Salin aset statis
                    mkdir -p "$DEPLOY_DIR/.next/static"
                    rsync -a --delete \
                      .next/static/ "$DEPLOY_DIR/.next/static/"

                    # Salin public jika tersedia
                    if [ -d public ]; then
                      mkdir -p "$DEPLOY_DIR/public"
                      rsync -a --delete \
                        public/ "$DEPLOY_DIR/public/"
                    fi

                    # Salin konfigurasi PM2
                    cp ecosystem.config.cjs "$DEPLOY_DIR/"

                    # Jalankan atau restart aplikasi
                    cd "$DEPLOY_DIR"
                    pm2 startOrReload ecosystem.config.cjs --update-env
                    pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment berhasil!'
        }

        failure {
            echo 'Deployment gagal. Periksa log pipeline.'
        }
    }
}

