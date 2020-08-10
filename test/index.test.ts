import { prepareMocks } from "./utils/mocks";
import * as core from "./utils/actions-core";
import * as github from "./utils/actions-github";
import { mockAnswer } from "./utils/actions-github";

describe("General", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("Should run full process", async () => {
    // given
    const { coreMock } = prepareMocks(core, github);

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(0);
    expect(coreMock.error.mock.calls.length).toBe(0);
    expect(coreMock.info.mock.calls.length).toBeTruthy();
  });

  it("Should fail with invalid config", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: ".github/repo-monitor-action/config.yml",
                content: "asd:asf:asd",
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "Configuration is missing metrics or groups on root level",
    ]);
  });

  it("Should fail with missing config", async () => {
    // given
    const { coreMock } = prepareMocks(core, {
      ...github,
      ...{
        getOctokit: () => ({
          repos: {
            ...github.getOctokit().repos,
            ...mockAnswer([
              {
                key: ".github/repo-monitor-action/config.yml",
                content: null,
              },
            ]),
          },
        }),
      },
    });

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "No config provided at .github/repo-monitor-action/config.yml on master",
    ]);
  });

  it("Should fail with missing key", async () => {
    // given
    const { coreMock } = prepareMocks(
      {
        ...core,
        getInput: (key: string) => {
          if (key === "token") {
            return "SECRET";
          } else if (key === "key") {
            return "key-a";
          } else {
            return undefined;
          }
        },
      },
      github
    );

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "Invalid arguments delivered: (key=key-a, value=undefined)",
    ]);
  });

  it("Should fail with missing value", async () => {
    // given
    const { coreMock } = prepareMocks(
      {
        ...core,
        getInput: (key: string) => {
          if (key === "token") {
            return "SECRET";
          } else if (key === "value") {
            return "1";
          } else {
            return undefined;
          }
        },
      },
      github
    );

    // when
    await require("../src/logic").runAction();

    // then
    expect(coreMock.setFailed.mock.calls.length).toBe(1);
    expect(coreMock.setFailed.mock.calls).toContainEqual([
      "Invalid arguments delivered: (key=undefined, value=1)",
    ]);
  });
});
