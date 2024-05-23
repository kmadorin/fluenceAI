import { Fluence } from "@fluencelabs/js-client";
import relays from "./relays.json" assert { type: "json" };
import {
  helloWorld,
  helloWorldRemote,
  runDeployedServices,
  showSubnet,
} from "./compiled-aqua/main.js";

const appEl =
  document.querySelector("#app") ??
  (() => {
    throw new Error("#app element is not found");
  })();

const aquaFunctions = [
  {
    name: "helloWorld",
    fn() {
      return helloWorld("Fluence");
    },
  },
  {
    name: "helloWorldRemote",
    fn() {
      return helloWorldRemote("Fluence");
    },
  },
  {
    name: "showSubnet",
    fn() {
      return showSubnet();
    },
  },
  {
    name: "runDeployedServices",
    fn() {
      return runDeployedServices();
    },
  },
];

(async () => {
  const p = document.createElement("p");
  p.innerText = "Loading...";
  appEl.append(p);
  try {
    await Fluence.connect(relays[0].multiaddr);
  } catch (error) {
    p.style.color = "red";
    p.innerText = `❌ ${stringifyError(error)}`;
    throw error;
  }

  p.remove();

  aquaFunctions.forEach((aquaFn) => {
    const buttonEl = document.createElement("button");
    buttonEl.innerText = aquaFn.name;

    buttonEl.addEventListener("click", () => {
      runAquaFunction(aquaFn);
    });

    appEl.append(buttonEl);
  });
})();


async function runAquaFunction({ fn, name }) {
  const p = document.createElement("p");
  p.style.whiteSpace = "pre-wrap";
  try {
    const res = await fn();
    p.style.color = "green";
    p.innerHTML = `${name}: ✅ ${JSON.stringify(res, null, 2)}`;
  } catch (e) {
    p.style.color = "red";
    p.innerHTML = `${name}: ❌ ${stringifyError(e)}`;
  }
  appEl.append(p);
}

function stringifyError(e) {
  if (e instanceof Error) {
    return e.message;
  }

  if (e instanceof Object) {
    const message = JSON.stringify(e, null, 2);
    if (message.includes("[0].dealIdOriginal")) {
      return "Please, make sure you have deployed the service";
    }

    return JSON.stringify(e, null, 2);
  }

  return String(e);
}
