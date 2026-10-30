module.exports = {
  apps: [
    {
      name: "next-app",
      script: ".next/standalone/server.js",
      cwd: "/var/lib/jenkins/apps/tugas-devops",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
