Must exist `.env` file with your value for frontend:
`DEFAULT_PAGINATE_ITEMS_COUNT_ON_PAGE=5`

and `.env.db` file for backend with your values:
    
    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=db_name
    POSTGRES_HOST=db


For correct starting app you need `docker` and `docker-compose` on your host machine.

Use `./run.sh`  or `docker-compose up -d` to run app.
Use `./stop.sh` or `docker-compose down` to stop app.
