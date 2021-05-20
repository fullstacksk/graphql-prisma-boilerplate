## 1. reate config folder

```javascript
    config
        - dev.env
        - test.env
        - prod.env
```

## 2. Setup endpoint accordingly
`./dev.env`

```javascript
PRISMA_ENDPOINT=<db_URL>
PRISMA_SECRET=<prisma_secret>
JWT_SECRET=<jwt_secret>
```
## 3. Deploy to prisma

`Move into ../prisma/ and run this command :-`

```
prisma deploy -e ./cofig/dev.env
```

## 4. Start server in local

`yarn dev-start`


## 5. See the Effect

    `http://localhost:4000`