import {Runtime, Inspector, Library} from 'https://unpkg.com/@observablehq/notebook-runtime?module';

const createLibrary = (el) => {

  const stdlib = new Library();

  const library = Object.assign({}, stdlib, {width});

  function width() {
    return stdlib.Generators.observe(notify => {
      let width = notify(el.clientWidth);
      function resized() {
        let width1 = el.clientWidth;
        if (width1 !== width) notify(width = width1);
      }
      window.addEventListener("resize", resized);
      return () => window.removeEventListener("resize", resized);
    });
  }

  return library;

};

export { Runtime, Inspector, Library, createLibrary };
