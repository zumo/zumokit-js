declare global {
  interface Window { ZumoCoreModule: any; loadZumoCoreModule: any; }
}

/** @internal */
const injectScript = () => {
  const script = document.createElement('script');
  script.src = "https://js.zumo.money/VERSION/zumocore.js";

  const headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error(
      'Expected document.body not to be null. ZumoKit.js requires a <body> element.'
    );
  }

  headOrBody.appendChild(script);

  return script;
};

/** @internal */
export const loadZumoCore = () => {
  return new Promise((resolve, reject) => {
    if (window.ZumoCoreModule) {
      resolve(window.ZumoCoreModule);
      return;
    }

    try {
      let script = injectScript();

      script.addEventListener('load', () => {
        if (window.loadZumoCoreModule) {
          window.loadZumoCoreModule().then((module: any) => {
            window.ZumoCoreModule = module;
            resolve(module)
          }).catch(reject);
        } else {
          reject(new Error('ZumoCore WebAssembly module not available'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load ZumoCore WebAssembly module'));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });
};
