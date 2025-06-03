# WordPress with Docker

Docker images for local WordPress development using Bedrock and Composer with support for SSL and MailHog.

This is a fork of https://github.com/urre/wordpress-nginx-docker-compose for the purpose of removing
the embedded copy of Bedrock and replacing the Dockerfile with the official WordPress one to ensure
compatibility. Everything else has remained the same.

## Requirements

* Docker
* mkcert for creating SSL certs

Install mkcert:
```
brew install mkcert
brew install nss
```
> nss is only required for Firefox

## Setup Docker Environment 

Copy `.env.example` in the project root to `.env` and edit the values.

## Install Bedrock

Use the `composer` container to download [Bedrock](https://roots.io/bedrock/docs/installation/)
```
docker-compose run --rm composer create-project roots/bedrock .
```
> Be certain to include the final period (.). Leaving it off will cause the Bedrock to be installed
> to `/bedrock/bedrock` rather than the desired `/bedrock`

## Create Certs for Custom Domain (Optional)
1. Create a SSL cert:
```
cd cli
./create-cert.sh
```

2. Add a record for the domain to your `/etc/hosts` file:
```
$ sudo vim /etc/hosts
127.0.0.1   myapp.local
```

## Use localhost:port (Optional)
...

## Setup Wordpress Environment 

Copy the `./bedrock/.env.example` to `.env` and edit as necessary. Values should align with those in the root `.env`

> `DB_HOST` must be changed to "mysql"

Example:

```
DB_NAME='myapp'
DB_USER='root'
DB_PASSWORD='password'

DB_HOST='mysql'

WP_HOME='https://myapp.local'
```

Use the link to generate keys and replace the salt variables.

> Note that it may be necessary to use "root" as the `DB_USER`. WP may fail to connect to the DB otherwise.

## Run

```
docker-compose up -d
```

* Open https://myapp.local in your browser if using HTTPS and a custom domain
* Open http://localhost if otherwise

# Tools & Common Commands

Update WordPress Core and packages
```
docker-compose run composer update
```

Use WP-CLI
```
docker exec -it {myapp}-bedrock bash
```

Update the Dockerfile:
```
docker-compose up -d --force-recreate --build
```

Stop
```
docker-compose stop
```

Down
```
docker-compose down
```

Cleanup
```
docker-compose rm -v
```

# Mailhog

* Open http://0.0.0.0:8025

# PhpMyAdmin

* Open http://127.0.0.1:8082