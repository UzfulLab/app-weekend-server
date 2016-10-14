# APP-WEEKEND

### SET UP

#### TECHNOLOGIES

* Express
* Body-Parser
* Mongoose

##### Install dependancies :
```shell
  npm install
```


##### Working on dev :

```shell
  node server.js
```

### APP AUTHENTICATION

#### Header
Header must contains:
`authToken: "safetoken123"` *(temporary)*

### APP DETAILS

##### Routes

All routes begin with `/api/v0`

`GET /deals` => Returns a json of all current deals

###### RETURN

```json

{
  "thu": {
    "sun": {
      "one": {
        "firstDeal": {
          "city": "Amsterdam",
          "picture": "https://hd.unsplash.com/photo-1447877980755-c3c642760061",
          "price": 74.32,
          "deal": "http://google.fr",
          "id": "f4k3id23123"
        }
      }
    }
  }
}

```

*returns the day of inbound, day of outbound, number of passenger and deal corresponding*

***

`POST /deal` => Create and Returns a json of a specific deals

###### REQUEST

|     ARGUMENTS    |  TYPE  | OPTIONAL |     POSSIBLE VALUES    | DEFAULT VALUE |     DESCRIPTION     |
|:---------------:|:------:|:--------:|:----------------------:|:-------------:|:-------------------:|
|   departureDay  | string |    no    |    thu - fri - sat   |               |   Day of departure  |
| departureMoment | string |    no    |   morning - evening   |               | Moment of departure |
|    returnDay    | string |    no    |    sun - mon - tue   |               |    Day of return    |
|   returnMoment  | string |    no    |   morning - evening   |               |   Moment of return  |
| destinationCity | string |    no    | *Skyscanner city values* |               |    City to fly to   |
|    originCity   | string |    yes   | *Skyscanner city values* |    PARI-sky   |   City to fly from  |
|    withPicture  | bool   |    yes   | 0 - 1 |    0   |   If you need a picture to illustrate your deal  |

###### RETURN

A json is returned

```json
{
  "city": "Dublin",
  "price": "42.42",
  "deal": "http://google.fr",
  "picture": "https://images.unsplash.com/photo-1476158085676-e67f57ed9ed7?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=3b921acce5c55d802d64d31d081e80bb"
}

```

***

`PUT /deal/:id` => returns the new price of a deal

A json is returned with the new price

```json
{
  "price": "42.42"
}

```

***

###### DEV -> TEST ERRORS

If you need to simulate a skyscanner API down, you can pass `departureDay = 'createError'`

##### App structure :

- app/ (contains all code logic)
  - controllers/ (logic corresponding to pages)
  - lib/ (Useful functions used across the API)
  - models/ (database objects, contains a lot of algorithms)
  - workers/ (contains tasks that need to be lunched daily)
- server.js (initalizes the API and listens to events)
- routes.js (Routing of our API, calls corresponding controllers)

### Calling the API

API listens at `http://localhost:4242/`
