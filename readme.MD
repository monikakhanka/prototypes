# run the backend server on different ports:

```
node backend.js 4001
node backend.js 4002
node backend.js 4003
```

# run the load balancer

```
node loadbalancer.js
```

# make a request

```
curl http://localhost:3000/test
```
