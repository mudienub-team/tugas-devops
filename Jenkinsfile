pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
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
                sh '''
                    set -eu

                    echo "=== Deploying with Docker Compose ==="

                    # Deteksi perintah Docker Compose yang tersedia
                    if docker compose version >/dev/null 2>&1; then
                        DOCKER_COMPOSE="docker compose"
                    elif command -v docker-compose >/dev/null 2>&1; then
                        DOCKER_COMPOSE="docker-compose"
                    else
                        echo "Error: Docker Compose tidak ditemukan di runner Jenkins!"
                        exit 1
                    fi

                    # Pastikan file .env ada
                    if [ ! -f .env ]; then
                        if [ -f .env.example ]; then
                            cp .env.example .env
                        else
                            touch .env
                        fi
                    fi

                    # Jalankan deploy ulang container
                    $DOCKER_COMPOSE down --remove-orphans || true
                    $DOCKER_COMPOSE up -d --build

                    # Validasi status kontainer
                    $DOCKER_COMPOSE ps
                '''
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
                if docker compose version >/dev/null 2>&1; then
                    docker compose logs --tail=50 || true
                elif command -v docker-compose >/dev/null 2>&1; then
                    docker-compose logs --tail=50 || true
                fi
            '''
        }
    }
}
