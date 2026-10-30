module.exports = {
  apps: [
    {
      name: "tugas-devops",
      script: "server.js",
      cwd: "/var/lib/jenkins/apps/tugas-devops",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 3000,
      },
    },
  ],
};
