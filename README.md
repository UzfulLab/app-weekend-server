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
  npm start
```

### APP AUTHENTICATION

#### Header
Header must contains:
`authToken: "safetoken123"` *(temporary)*

### APP DETAILS

#### Routes

All routes begin with `/api/v0`

***

`GET /deals` => Returns a json of all current deals

###### RETURN

```json

{
  "thu": {
    "sun": {
      "one": [
          {
            "_id": "5824abe8a2ec3c11b0a2184e",
            "created_at": "2016-11-10T17:18:32.942Z",
            "sessionKey": "646bdc74a16642d08c8e294bdf857a16_ecilpojl_C91F0D35CE575DFE49D9B2FE1C6ED94C",
            "outboundLegId": "10413-1611171000--32356-0-13771-1611171015",
            "outboundDay": 4,
            "outboundDate": "2016-11-17T00:00:00.000Z",
            "inboundLegId": "13771-1611200900--32356-0-10413-1611201120",
            "inboundDay": 0,
            "inboundDate": "2016-11-20T00:00:00.000Z",
            "passengers": 1,
            "deal_url": "http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=nrpnZ%2f4hktHebjvBq9AkxaYaLU%2bGNdcAX3UOATmaM4iRIz85kld%2fLwmLuVzlZk95&url=http%3a%2f%2fwww.apideeplink.com%2ftransport_deeplink%2f4.0%2fFR%2ffr-fr%2fEUR%2feasy%2f2%2f10413.13771.2016-11-17%2c13771.10413.2016-11-20%2fair%2fairli%2fflights%3fitinerary%3dflight%7c-32356%7c2432%7c10413%7c2016-11-17T10%3a00%7c13771%7c2016-11-17T10%3a15%2cflight%7c-32356%7c2435%7c13771%7c2016-11-20T09%3a00%7c10413%7c2016-11-20T11%3a20%26carriers%3d-32356%26passengers%3d1%26channel%3ddataapi%26cabin_class%3deconomy%26facilitated%3dfalse%26ticket_price%3d75.50%26is_npt%3dfalse%26is_multipart%3dfalse%26client_id%3dskyscanner_b2b%26request_id%3dde5df2ed-33e0-4c84-86e5-31e6de98b98e%26commercial_filters%3dfalse%26q_datetime_utc%3d2016-11-10T15%3a18%3a28",
            "author_link": "https://unsplash.com/@willvanw",
            "author_name": "Will van Wingerden",
            "picture_url": "https://images.unsplash.com/photo-1456490585048-f4a7348766f7?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
            "price": "75,5",
            "destinationCountry": "UK-sky",
            "cityEN": "Londres",
            "cityFR": "Londres",
            "__v": 0
          }
        ]
      }
    }
  }
}

```

*returns the day of inbound(thu => thursday), day of outbound(sun => sunday), number of passenger(one => deal for 1 passenger) and deal corresponding*

***

`POST /deals` => Fetch all deals for the next weekend, and saves them into database.

###### REQUEST

|     ARGUMENTS    |  TYPE  | OPTIONAL |     POSSIBLE VALUES    | DEFAULT VALUE |     DESCRIPTION     |
|:---------------:|:------:|:--------:|:----------------------:|:-------------:|:-------------------:|
|   dropDB  | boolean |    yes    |    true - false   |      false         |   If set to true, will drop database so you will only have fresh deals on database |

A json is returned

```json
{
  "message": "Deals are updating now",
  "database": "Database was (not) dropped"
}
```


***

`POST /deal` => Create and Returns a json of a specific deals

###### REQUEST

|     ARGUMENTS    |  TYPE  | OPTIONAL |     POSSIBLE VALUES    | DEFAULT VALUE |     DESCRIPTION     |
|:---------------:|:------:|:--------:|:----------------------:|:-------------:|:-------------------:|
|   departureDay  | string |    no    |    thu - fri - sat   |               |   Day of departure (not operational) |
| departureMoment | string |    yes    |   morning - evening   |               | Moment of departure (not operational) |
|    returnDay    | string |    no    |    sun - mon - tue   |               |    Day of return  (not operational)  |
|   returnMoment  | string |    yes    |   morning - evening   |               |   Moment of return (not operational) |
| destinationCity | string |    no    | *Skyscanner city values* |               |    City to fly to (not operational)  |
|    originCity   | string |    yes   | *Skyscanner city values* |    PARI-sky   |   City to fly from (not operational) |
|    withPicture  | bool   |    yes   | 0 - 1 |    0   |   If you need a picture to illustrate your deal (operational) |
|    passengers  | int   |    no   | 1 - (..) - 4 |    0   |   How many people are traveling (operational) |
|    cityFR  | string   |    no   | "Londres" - etc.. |    0   |   Name of the destination in french (operational) |
|    cityEN  | string   |    no   | "Londres" - etc.. |    0   |   Name of the destination in english (operational) |
|    destinationCountry  | string   |    no   |  *Skyscanner country values* |    0   | Skyscanner country code (ex: FR-sky) (operational) |

* operational => Your value influences API return
* not operational => Your value will influence API return on futures commits

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

###### DEV -> TEST ERRORS

If you need to simulate a skyscanner API down, you can pass `departureDay = 'createError'`

***

`PUT /deal/:id` => returns the new price of a deal

###### RETURN

A json is returned with the new price

```json
{
  "price": "42.42"
}

```

***

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
