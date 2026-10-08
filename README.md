# DriveEasy: Vehicle Rental Front End

React (Vite, JavaScript) client for the Spring Boot vehicle rental API.
Scope: register, log in, view vehicles, rent a vehicle, add a vehicle.

## Open in VS Code

1. Install Node.js LTS (nodejs.org) and check `node -v`.
2. Unzip, then File > Open Folder > `vehicle-rental-app` (or run `code .` inside it).
3. Accept the recommended extensions prompt (Prettier, ES7 snippets, Error Lens).
4. Open the terminal with `` Ctrl+` `` and run:

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests
```

Mock mode is on by default. Log in with `demo@driveeasy.com` / `password123`.

## Connect to the Spring Boot backend

In `.env` set `VITE_USE_MOCK=false`, then restart `npm run dev`. The backend must allow CORS from `http://localhost:5173`.

Endpoints assumed (confirm with the backend developer, change only in `features/*/adapters/http.js`):

| Action | Request |
|---|---|
| Register | `POST /api/auth/register` `{ email, password }` |
| Login | `POST /api/auth/login` `{ email, password }` returns `{ token }` or a bare token |
| List vehicles | `GET /api/vehicles?page=0&size=50` returns an array or `{ content: [...] }` |
| Rent | `POST /api/vehicles/{id}/rent` (409 means already rented) |
| Add vehicle | `POST /api/vehicles` `{ make, model, year, category, pricePerDay }` |

If the API field names differ, change `features/*/mappers.js` only.
If it uses Basic Auth instead of a bearer token, change the header in `shared/http/client.js`.

## Structure

```
src/
  app/                 App.jsx (routes), Navbar.jsx
  shared/
    config.js          env values, timeout, retry and page-size limits
    session.js         token storage and session-expired event
    http/              client.js (timeout, retry GET), errors.js (ApiError kinds)
    ui/                FormInput, Alert
  features/
    auth/              Identity context
      index.js         public surface
      api.js           port, picks the adapter
      adapters/        http.js (Spring), mock.js
      mappers.js       API shape <-> front-end shape
      rules.js         pure validation
      AuthContext.jsx, ProtectedRoute.jsx, pages/
    fleet/             Fleet context (vehicles and renting)
      index.js, api.js, adapters/, mappers.js
      rules.js         pure domain rules (canRent, filter, validate, price)
      hooks.js         use cases: useVehicles, useRentVehicle, useAddVehicle
      components/, pages/
```

## Standards applied

| Standard | Where it shows up |
|---|---|
| Ubiquitous language (DDD) | Vehicle, Renter, Rental used identically in UI, code and API. Agree this with the backend team. |
| Bounded contexts | `features/auth` and `features/fleet`. Import a feature only through its `index.js`. |
| Layers and ports/adapters (Implementing DDD) | Pages and components display; hooks are use cases; `rules.js` is pure; `adapters/` talk to HTTP or mock behind `api.js`. |
| No business logic in the UI | Client validation is quick feedback only. The server decides. |
| Anti-corruption layer | `mappers.js` is the only code that knows backend field names. |
| Predictable, understandable, reasonable failures (Architecting for Scale) | Every error becomes an `ApiError` with a plain message. No raw fetch errors reach the screen. |
| Timeouts, limited retries, fail early | 10 s timeout. GET retried twice with backoff. Writes and 4xx are never retried. Forms validate before calling the API. |
| Graceful degradation | Failed image falls back to an icon. A failed background refresh keeps the list on screen. |
| Service limits | The vehicle list is requested with a page size of 50. |
| Command/query separation | `useVehicles` reads. `useRentVehicle` and `useAddVehicle` change state. |
| UI patterns (Building Microservices) | Single frontend for one team and one backend. No BFF, micro frontends or GraphQL until a real need appears. |

Not applied on purpose: event sourcing, CQRS read models, message brokers, micro frontends. None is justified for this scope.

## Glossary

| Term | Meaning |
|---|---|
| Vehicle | A car in the fleet with make, model, year, category, daily price and availability |
| Renter | A registered user who can rent a vehicle |
| Rent | Mark an available vehicle as taken for the renter |
| Available | Can be rented right now |
