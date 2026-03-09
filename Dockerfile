FROM docker.io/cloudflare/sandbox:0.7.14

# Install the PM CLI
COPY saas/cli/pm /usr/local/bin/pm
RUN chmod +x /usr/local/bin/pm

# Required during local development to access exposed ports
EXPOSE 8080
