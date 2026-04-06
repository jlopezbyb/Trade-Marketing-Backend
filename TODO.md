TODO:

# Location

## Frontend

- [ ] If slot is "OCUPADO" not allow update
- [ ] If any slot is "OCUPADO" not allow update location status

## Backend

- [x] create location
- [x] create slots
- [x] update location
- [x] update slots
- [x] delete location
- [x] delete slots
- [x] finder all locations with page and limit
- [x] finder by id location with slots

- [ ] verify if getLocationById return empty object
- [ ] improve update slots when it is "OCUPADO" (technical debt)
- [ ] improve update location in status if any slot is "OCUPADO" (technical debt)
- [ ] add schedules in get by id
- [ ] add lazy load for slots in finder all locations
- [ ] add lazy load for slots in get by id finder
- [x] can not create slot occupied

# Tags

- [x] Create tag
- [x] Update tag
- [x] Get tag by id
- [x] Get all tags
- [x] Delete tag

# Assignment and assignment loan

## Frontend

- [ ] If employee exists send uuid to create assignment
- [ ] Update: Vehicles owner, vehicles guest, schedule time, schedule loan
- [ ] Create assignment loan: Only create assignment and action add guest

## Backend

- [x] create assignment
  - [x] welcome email to owner
  - [x] welcome email to guest
  - [x] add tags workflow
  - [x] create assignment loan
  - [x] create api_key for employee
  - [ ] save or update key in database
  - [ ] get location data to email
  - [ ] Do not create schedule if slot is type single
  - [ ] Does not create assignment if tags is empty
  - [x] can not create assignment if slot is "MULTIPLE" and request does not have schedule
  - [x] fix error duplicated employee
  - [x] not create assignment if slot is multiple and not send schedule
  - [x] fix issue with uuid in create assignment loan and create assignment
  - [x] Cant create assignment if slot or location is inactive
  - [x] After create assignment change status from slot
  - [x] handle error if code employee already exists

* [x] Update assignment

  - [x] update assignment load

* [x] Create assignment loan

  - [x] only employee has not assignment

* [x] Delete assignment loan

  - [x] send email to owner, guest
  - [ ] cron process

* [x] create discount note

  - [ ] service to manage send email and attempts
  - [x] send email to owner and RRHH with discount note
  - [ ] define who is rrhh
  - [x] update status discount note

* [x] Finders

  - [x] finder all assignments
    - [ ] add schedule
  - [x] assignment by id
    - [ ] add lazy load to get all assignments
  - [x] finder employee by code

* [x] create de_assignment

  - [x] notification
  - [x] set available to slot
  - [x] inactive guest

* [x] delete assignment loan

* [ ] validate if tags exists in database (technical debt)
* [ ] resolve hole dependency from employee web service (technical debt)
* [ ] save employee from ws in redis (technical debt)
* [ ] Improve save data employee in create assignment (cache data)
* [ ] add types for employee web service data
* [ ] validate time between 00:00 and 23:59 in schema db (technical debt)

# Notifications

# Reports

# Parameters

# Auth

# All application

- [ ] change logger to pino
- [ ] fix structure of error messages in zod middleware
- [ ] uncatched error with wrong format in request
- [ ] solve problem with "as" alias entities
- [ ] implement handle error in hole application
- [ ] fix issue with timezone in docker
- [ ] delete ?? from maps
- [ ] integrate nock and nyc

- [ ] extract functions date to utils
- [ ] error to create assignment into single slot
- [ ] verify if can create assignment if location is inactive

- [ ] add filter (active - inactive) in location finder
- [ ] test automatic de-assignment procedure
