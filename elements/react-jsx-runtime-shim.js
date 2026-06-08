export function jsx(type, props) {
  return { type, props: props ?? {} };
}

export const jsxs = jsx;
export const Fragment = Symbol.for("react.fragment");
