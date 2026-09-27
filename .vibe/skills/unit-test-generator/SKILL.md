---
name: unit-test-generator
description: Write unit tests with Vitest for NestJS controller and service.
user-invocable: true
---

# Skill: Unit test generator

Use this skill when the user asks to create or extend unit tests for a NestJS controller or service in this repository.

## Repository conventions

- The backend lives in the `server/` workspace.
- Tests are written with `Vitest` and use `vi` from the test runner.
- Service tests should build fresh repository-shaped mock objects in the test setup, using `vi.fn()` methods such as `find`, `findOne`, `findOneBy`, `findBy`, `save`, and `delete`.
- Repository mocks should be typed by entity and stay method-specific, matching the repository methods actually used by the service under test.
- Avoid importing shared repository mock singletons across tests; create a new mock object in `beforeEach` so each test remains isolated.
- Controller tests should stub the service methods using `vi.spyOn(service, "<method>").mockResolvedValue(...)` or `mockRejectedValue(...)` without constructing a real repository-backed service instance.
- TypeORM repositories are typed as `Repository<T>` from `typeorm`, and the repository object shape should stay minimal and method-specific.
- Error assertions should check `NotFoundException` with `rejects.toBeInstanceOf(NotFoundException)`.
- Tests should stay close to the style already used in the existing `spaces` examples.

## Writing controller tests

Create or update the controller test file beside the controller module, for example:

- `server/src/<module>/<module>.controller.test.ts`

The pattern is:

1. Instantiate a fresh controller with a service test double typed as `KeysService` or the domain service.
2. Use `vi.spyOn(service, "<method>").mockResolvedValue(...)` or `mockRejectedValue(...)` for happy-path and error-path tests.
3. Assert that the controller returns the service result unchanged.
4. Assert that a `NotFoundException` and other domain errors are propagated by the controller test.

Example structure:

```ts
describe("<Module>Controller", () => {
  let controller: <Module>Controller;
  let service: Partial<<Module>Service>;

  beforeEach(() => {
    service = new <Module>Service({} as Repository<...>, ...)

    controller = new <Module>Controller(service as <Module>Service);
  });
});
```

## Writing service tests

Create or update the service test file beside the service module, for example:

- `server/src/<module>/<module>.service.test.ts`

The pattern is:

1. Build a service with repository-shaped mock objects, not a real `TypeORM` connection.
2. Use `vi.mocked(repository.method).mockResolvedValue(...)` or `vi.fn()` repository stubs to control repository answers.
3. Assert the repository call shape, especially `find`, `findOne`, `findOneBy`, `findBy`, `save`, and `delete` calls.
4. Verify that data relation options such as `relations: { translations: true }` are passed explicitly.
5. For missing entities, assert that `service.<method>()` rejects with `NotFoundException`.

Example structure:

```ts
describe("<Module>Service", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
  }) as unknown as Repository<T>;

  let service: <Module>Service;
  let repository: Repository<...>;

  beforeEach(() => {
    repository = repository_mock<...>();

    service = new <Module>Service(repository);
  });
});
```

Repository mocks should be built as a fresh factory object in `beforeEach` and never reused across tests, because stale `mockResolvedValue` or `mockImplementation` data can leak between scenarios.

## Expected output

When asked to generate a unit test, return complete test code that:

- imports the controller or service under test,
- imports the domain entities and DTOs needed for the scenario,
- uses `describe`, `beforeEach`, and `it` blocks,
- uses repository/service mocks instead of connecting to a real database,
- avoids unrelated randomness and keeps assertions minimal and direct.

## Good test habits

- Add a blank line before and after multi-line declarations, multi-line function chains, and multi-line `expect(...)` assertions.
- Prefer explicit repository call assertions (`toHaveBeenCalledWith`) where useful.
- Keep test names readable and consistent with the `should ...` form.
- Respect NestJS naming conventions (`add_one`, `get_all`, `get_one`, `patch_one`, `delete_one`).
- Write only the assertions that validate the real behavior being exercised.

Example good habits:

```ts
  const var_1 = ...;
  const var_2 = ...;
  const var_3 = ...;

  const var_4 = {
    ...
  };

  vi.mocked(...).mockResolvedValue(...);
  vi.mocked(...).mockResolvedValue(...);

  expect(...).toBe(...);
  expect(...).toHaveBeenCalledWith(...);
```
