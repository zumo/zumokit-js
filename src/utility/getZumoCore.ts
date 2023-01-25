const loadZumoCoreModule = require('../zumocore/zumocore');

let instance: any;
let semaphore = false;

export const getZumoCore = async () => {
  if (!instance && !semaphore) {
    // make sure initialisation is called at most once
    semaphore = true;
    instance = await loadZumoCoreModule();
  }

  return instance;
};
