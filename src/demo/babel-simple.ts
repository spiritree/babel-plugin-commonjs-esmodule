import * as babel from "@babel/core";
import * as t from "@babel/types";

const code = `
  let str = 'test';
  str + 'abc';
`;

const output = babel.transformSync(code, {
  plugins: [
    function myCustomPlugin() {
      return {
        visitor: {
          Identifier(path: babel.NodePath<t.Node>) {
            if (path.isIdentifier({ name: "str" })) {
              path.node.name = "transformStr";
            }
          }
        }
      };
    }
  ]
});

console.log(output?.code);
