import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

const code = `
  let str = 'test';
  str + 'abc';
`;

// code -> ast
const ast = parse(code);

// ast转换
traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "str" })) {
      path.node.name = "transformStr";
    }
  }
});

// ast -> code
const output = generate(ast, {}, code);
console.log(output.code);
