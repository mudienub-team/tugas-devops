pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    // Dipicu oleh webhook GitHub (Payload URL: <JENKINS_URL>/github-webhook/)
    triggers {
        githubPush()
    }

    environment {
        APP_NAME = 'tugas-devops'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                sh '''
                    npm ci
                    npm test
                '''
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                // File .env disimpan di Jenkins Credentials (tipe: Secret file), bukan di repo
                withCredentials([file(credentialsId: 'tugas-devops-env', variable: 'ENV_FILE')]) {
                sh '''
                    set -eu

                    echo "=== Deploying with Docker Compose ==="

                    # Salin secret file ke workspace sebagai .env
                    cp "$ENV_FILE" .env
                    chmod 600 .env

                    # Deteksi perintah Docker Compose yang tersedia
                    if docker compose version >/dev/null 2>&1; then
                        DOCKER_COMPOSE="docker compose"
                    elif command -v docker-compose >/dev/null 2>&1; then
                        DOCKER_COMPOSE="docker-compose"
                    else
                        echo "Error: Docker Compose tidak ditemukan di runner Jenkins!"
                        exit 1
                    fi

                    # Versi image diambil dari package.json
                    APP_VERSION=$(node -p "require('./package.json').version")
                    export APP_VERSION
                    echo "Versi aplikasi: $APP_VERSION"

                    # Jalankan deploy ulang container
                    $DOCKER_COMPOSE down --remove-orphans || true
                    $DOCKER_COMPOSE up -d --build

                    # Validasi status kontainer
                    $DOCKER_COMPOSE ps
                '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    set -eu

                    echo "=== Verifikasi Health Check ==="
                    sleep 10

                    # Verifikasi respons dari HTTP port 3000
                    curl -fsS http://localhost:3000/ > /dev/null || curl -fsS http://127.0.0.1:3000/ > /dev/null || {
                        echo "Gagal menghubungi aplikasi di port 3000"
                        exit 1
                    }

                    echo "Aplikasi berhasil berjalan dan merespons dengan baik!"
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment dengan Docker Compose berhasil!'
        }

        failure {
            echo 'Deployment gagal. Menampilkan log kontainer:'
            sh '''
                export APP_VERSION=$(node -p "require('./package.json').version")
                if docker compose version >/dev/null 2>&1; then
                    docker compose logs --tail=50 || true
                elif command -v docker-compose >/dev/null 2>&1; then
                    docker-compose logs --tail=50 || true
                fi
            '''
        }

        // Dijalankan paling akhir: hapus .env dari workspace agar tidak tertinggal di disk
        cleanup {
            sh 'rm -f .env'
        }
    }
}
