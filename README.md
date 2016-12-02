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

##### First launch :

[install mongodb](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-os-x/) :
```shell
  brew install mongodb
```

Create the default /data/db directory :
```shell
  mkdir -p /data/db
```

Access mongo shell :
```shell
  mongo
```

Then create database :
```shell
 use app-weekend
```

Now to populate datas on the database, you need to make a POST request on this endpoint (using postman for example) :
```
 http://localhost:4242/api/v0/deals
```

Exit mongo shell and run mongod (might needs sudo) :
```shell
  mongod
```

Open an other terminal and run :
```shell
  DEBUG=* npm start
```

##### Working on dev :

run mongod (might needs sudo) :
```shell
  mongod
```
start server :
```shell
  DEBUG=* npm start
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
      "one":{
        "mor":{
          "mor":
          [
             {
                "__v": 0,
                "created_at": "2016-12-02T14:01:08.462Z",
                "sessionKey": "cd73984bbfc64501b653890e4b89d4b1_ecilpojl_6018A518E0CDF21FE7650887AAB29FC7",
                "outboundLegId": "15083-1612041815--32356-0-16668-1612041955",
                "outboundDay": 0,
                "outboundDate": "2016-12-04T00:00:00.000Z",
                "inboundLegId": "16668-1612182025--32356-0-15083-1612182215",
                "inboundDay": 0,
                "inboundDate": "2016-12-18T00:00:00.000Z",
                "passengers": 3,
                "deal_url": "http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=nrpnZ%2f4hktHebjvBq9AkxaYaLU%2bGNdcAX3UOATmaM4iRIz85kld%2fLwmLuVzlZk95&url=http%3a%2f%2fwww.apideeplink.com%2ftransport_deeplink%2f4.0%2fFR%2ffr-fr%2fEUR%2feasy%2f2%2f15083.16668.2016-12-04%2c16668.15083.2016-12-18%2fair%2fairli%2fflights%3fitinerary%3dflight%7c-32356%7c4265%7c15083%7c2016-12-04T18%3a15%7c16668%7c2016-12-04T19%3a55%2cflight%7c-32356%7c4266%7c16668%7c2016-12-18T20%3a25%7c15083%7c2016-12-18T22%3a15%26carriers%3d-32356%26passengers%3d3%26channel%3ddataapi%26cabin_class%3deconomy%26facilitated%3dfalse%26ticket_price%3d631.16%26is_npt%3dfalse%26is_multipart%3dfalse%26client_id%3dskyscanner_b2b%26request_id%3d81eaed6c-21da-41e7-a7ca-68eec71c599d%26commercial_filters%3dfalse%26q_datetime_utc%3d2016-12-02T14%3a01%3a07",
                "author_link": "https://unsplash.com/@romankraft",
                "author_name": "Koman Kraft",
                "picture_url": "https://images.unsplash.com/photo-1468914793027-6ecfb73cb1ed?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
                "price": "210,38",
                "inboundMoment": "E",
                "outboundMoment": "E",
                "countryEN": "Allemagne",
                "countryFR": "Allemagne",
                "destinationCountry": "DE-sky",
                "cityEN": "Berlin",
                "cityFR": "Berlin",
                "_id": "58417ea4e2f2e50651d756fd"
              }
            ]    
          }
        }
      }
    }
  }

```

*returns the day of inbound(thu => thursday), day of outbound(sun => sunday), number of passenger(one => deal for 1 passenger), outbound moment (mor => morning), inbound moment (mor => morning) and deal corresponding*

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
|   departureDay  | string |    no    |    2016-11-18 (YYYY-MM-DD)   |               |   Day of departure (operational) |
| departureMoment | string |    yes    |   M - A - E   |               | Moment of departure (operational) |
|    returnDay    | string |    no    |    2016-11-21 (YYYY-MM-DD)    |               |    Day of return  (operational)  |
|   returnMoment  | string |    yes    |    M - A - E  |               |   Moment of return (operational) |
| destinationCity | string |    no    | *Skyscanner city values* |               |    City to fly to (operational)  |
|    originCity   | string |    yes   | *Skyscanner city values* |    PARI-sky   |   City to fly from (operational) |
|    withPicture  | bool   |    yes   | 0 - 1 |    0   |   If you need a picture to illustrate your deal (operational) |
|    passengers  | int   |    no   | 1 - (..) - 4 |    0   |   How many people are traveling (operational) |
|    cityFR  | string   |    no   | "Londres" - etc.. |    0   |   Name of the destination in french (operational) |
|    cityEN  | string   |    no   | "London" - etc.. |    0   |   Name of the destination in english (operational) |
|    destinationCountry  | string   |    no   |  *Skyscanner country values* |    0   | Skyscanner country code (ex: FR-sky) (operational) |

* operational => Your value influences API return
* not operational => Your value will influence API return on futures commits

###### RETURN

A json is returned

```json
{
  "__v": 0,
  "created_at": "2016-12-02T14:01:08.462Z",
  "sessionKey": "cd73984bbfc64501b653890e4b89d4b1_ecilpojl_6018A518E0CDF21FE7650887AAB29FC7",
  "outboundLegId": "15083-1612041815--32356-0-16668-1612041955",
  "outboundDay": 0,
  "outboundDate": "2016-12-04T00:00:00.000Z",
  "inboundLegId": "16668-1612182025--32356-0-15083-1612182215",
  "inboundDay": 0,
  "inboundDate": "2016-12-18T00:00:00.000Z",
  "passengers": 3,
  "deal_url": "http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=nrpnZ%2f4hktHebjvBq9AkxaYaLU%2bGNdcAX3UOATmaM4iRIz85kld%2fLwmLuVzlZk95&url=http%3a%2f%2fwww.apideeplink.com%2ftransport_deeplink%2f4.0%2fFR%2ffr-fr%2fEUR%2feasy%2f2%2f15083.16668.2016-12-04%2c16668.15083.2016-12-18%2fair%2fairli%2fflights%3fitinerary%3dflight%7c-32356%7c4265%7c15083%7c2016-12-04T18%3a15%7c16668%7c2016-12-04T19%3a55%2cflight%7c-32356%7c4266%7c16668%7c2016-12-18T20%3a25%7c15083%7c2016-12-18T22%3a15%26carriers%3d-32356%26passengers%3d3%26channel%3ddataapi%26cabin_class%3deconomy%26facilitated%3dfalse%26ticket_price%3d631.16%26is_npt%3dfalse%26is_multipart%3dfalse%26client_id%3dskyscanner_b2b%26request_id%3d81eaed6c-21da-41e7-a7ca-68eec71c599d%26commercial_filters%3dfalse%26q_datetime_utc%3d2016-12-02T14%3a01%3a07",
  "author_link": "https://unsplash.com/@romankraft",
  "author_name": "Koman Kraft",
  "picture_url": "https://images.unsplash.com/photo-1468914793027-6ecfb73cb1ed?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
  "price": "210,38",
  "inboundMoment": "E",
  "outboundMoment": "E",
  "countryEN": "Allemagne",
  "countryFR": "Allemagne",
  "destinationCountry": "DE-sky",
  "cityEN": "Berlin",
  "cityFR": "Berlin",
  "_id": "58417ea4e2f2e50651d756fd"
}

```

###### DEV -> TEST ERRORS

If you need to simulate a skyscanner API down, you can pass `departureDay = 'createError'`

***

`PUT /deal/:id` => returns the new price of a deal (not operationnal => use create method instead)

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
