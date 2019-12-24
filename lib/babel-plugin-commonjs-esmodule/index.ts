export default function(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      CallExpression(path) {
        // const xx = require("xxx")
        // babel推荐使用@babel/types中的api来做判断，不要使用等于号判断
        if (
          t.isIdentifier(path.node.callee, { name: "require" }) &&
          t.isStringLiteral(path.node.arguments[0]) &&
          path.node.arguments.length === 1
        ) {
          // 提取require的依赖名称
          const depName = path.node.arguments[0].value;
          if (
            t.isVariableDeclarator(path.parentPath.node) &&
            t.isIdentifier(path.parentPath.node.id)
          ) {
            // 提取require的声明变量
            const importName = t.identifier(path.parentPath.node.id.name);
            if (t.isVariableDeclaration(path.parentPath.parentPath.node)) {
              path.parentPath.parentPath.replaceWith(
                // 用@babel/types构造import语句
                t.importDeclaration(
                  [t.importDefaultSpecifier(importName)],
                  t.stringLiteral(depName)
                )
              );
            }
          }
        }
      },
      MemberExpression(path) {
        // module.exports = xxx
        // babel推荐使用@babel/types中的api来做判断，不要使用等于号判断
        if (
          t.isIdentifier(path.node.object, { name: "module" }) &&
          t.isIdentifier(path.node.property, { name: "exports" })
        ) {
          // 获取声明该语句的节点
          const assignmentExpression = path.parentPath;
          // 构造export default
          if (t.isExpression(assignmentExpression.node.right)) {
            assignmentExpression.parentPath.replaceWith(
              t.exportDefaultDeclaration(assignmentExpression.node.right)
            );
          }
        }
      }
    }
  };
}
