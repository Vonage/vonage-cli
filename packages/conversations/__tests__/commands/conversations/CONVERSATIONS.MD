LIST RESPONSE

```js
{
  "page_size": 10,
  "_embedded": {
    "conversations": [
      {
        "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
        "name": "customer_chat",
        "display_name": "Customer Chat",
        "image_url": "https://example.com/image.png",
        "timestamp": {
          "created": "2019-09-03T18:40:24.324Z"
        },
        "_links": {
          "self": {
            "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
          }
        }
      }
    ]
  },
  "_links": {
    "first": {
      "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10"
    },
    "self": {
      "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
    },
    "next": {
      "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
    },
    "prev": {
      "href": "https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D"
    }
  }
}
```

400

```js
{
  "title": "Bad request.",
  "type": "https://developer.nexmo.com/api/conversation#http:error:validation-fail",
  "code": "http:error:validation-fail",
  "detail": "Input validation failure.",
  "instance": "00a5916655d650e920ccf0daf40ef4ee",
  "invalid_parameters": [
    {
      "name": "date_start",
      "reason": "\"date_start\" must be a valid ISO 8601 date"
    }
  ]
}
```

401

```js
{
  "title": "Unauthorized.",
  "type": "https://developer.nexmo.com/api/conversation#system:error:invalid-token",
  "code": "system:error:invalid-token",
  "detail": "You did not provide a valid token. Please provide a valid token.",
  "instance": "00a5916655d650e920ccf0daf40ef4ee"
}
```

500

```js
{
  "title": "Internal Error.",
  "type": "https://developer.nexmo.com/api/conversation#system:error:internal-error",
  "code": "system:error:internal-error",
  "detail": "Something went wrong.",
  "instance": "00a5916655d650e920ccf0daf40ef4ee"
}
```

CREATE RESPONSE

```js
{
  "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
  "name": "customer_chat",
  "display_name": "Customer Chat",
  "image_url": "https://example.com/image.png",
  "state": "ACTIVE",
  "sequence_number": 0,
  "timestamp": {
    "created": "2019-09-03T18:40:24.324Z"
  },
  "properties": {
    "ttl": 60
  },
  "numbers": {},
  "_links": {
    "self": {
      "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
    }
  }
}
```

SHOW

```js


{
  "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
  "name": "customer_chat",
  "display_name": "Customer Chat",
  "image_url": "https://example.com/image.png",
  "state": "ACTIVE",
  "sequence_number": 0,
  "timestamp": {
    "created": "2019-09-03T18:40:24.324Z"
  },
  "properties": {
    "ttl": 60
  },
  "numbers": {},
  "_links": {
    "self": {
      "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
    }
  }
}
```

UPDATE RESPONSE

```js
{
  "id": "CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a",
  "name": "customer_chat",
  "display_name": "Customer Chat",
  "image_url": "https://example.com/image.png",
  "state": "ACTIVE",
  "sequence_number": 0,
  "timestamp": {
    "created": "2019-09-03T18:40:24.324Z"
  },
  "properties": {
    "ttl": 60
  },
  "numbers": {},
  "_links": {
    "self": {
      "href": "https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a"
    }
  }
}
```
