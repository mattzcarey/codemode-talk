FROM docker.io/cloudflare/sandbox:0.7.14

# Install the PM CLI
COPY saas/cli/pm /usr/local/bin/pm
RUN chmod +x /usr/local/bin/pm

# Install tools
RUN npm install -g wrangler rexy-js

# Install uv (manages Python on demand)
RUN curl -LsSf https://github.com/astral-sh/uv/releases/latest/download/uv-x86_64-unknown-linux-gnu.tar.gz | tar xz -C /usr/local/bin --strip-components=1

# Install deno (force x86_64 for amd64 container)
RUN curl -fsSL https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip -o /tmp/deno.zip && \
    unzip /tmp/deno.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/deno && \
    rm /tmp/deno.zip

# Monty CLI wrapper (uses uv to run pydantic-monty)
COPY saas/cli/monty /usr/local/bin/monty
RUN chmod +x /usr/local/bin/monty

# Wrangler auth tokens
COPY saas/cli/wrangler-config/default.toml /root/.config/.wrangler/config/default.toml

# Workerd wrapper — runs rexy in background, captures output, then kills it
COPY saas/cli/workerd /usr/local/bin/workerd
RUN chmod +x /usr/local/bin/workerd

# Required during local development to access exposed ports
EXPOSE 8080
