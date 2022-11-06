import { transformFromAstAsync } from '@babel/core'
import * as parser from '@babel/parser'
import * as fs from 'fs'
import traverse from '@babel/traverse'
import type { Node } from '@babel/traverse'
import path from 'path'

type IParserType = typeof parser.parse;

type IAst = ReturnType<IParserType>;

export class Parser {
  public getAst(path: string): IAst {
    const sourceContent = fs.readFileSync(path, 'utf8');
    return parser.parse(sourceContent, {
      sourceType: 'module',
    });
  }

  public buildDep(ast: IAst, filepath: string) {
    const dependencies: Record<string, string> = {};
    const sourceDir = path.dirname(filepath);
    traverse(ast as Node, { 
      ImportDeclaration({ node }) {
        const importPath = node.source.value;
        const absolutePath = './' + path.join(sourceDir, importPath);
        dependencies[importPath] = absolutePath;
      }
    });

    return dependencies;
  }

  public transformCode() {}
}