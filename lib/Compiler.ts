import { Parser } from './Parser';
import path from 'path';
import fs from 'fs';

export interface IWebpackOptions {
  entry: string;
  output: IOutput;
}

export interface IOutput {
  path: string;
  filename: string;
}

export interface IBuildInfo {
  deps: Record<string, string>;
  filepath: string;
  code: string;
}

export interface IFlatDepMap {
  deps: Record<string, string>;
  code: string;
}

export class Compiler {
  private entry;
  
  private output;

  private modules: IBuildInfo[] = [];

  private parser: Parser;

  private builtFilepathMap: Record<string, string>= {};

  constructor(options: IWebpackOptions) {
    this.entry = options.entry;
    this.output = options.output;
    this.parser = new Parser();
  }

  public run(): void {
    this.collectModules();
    const flatDepMap = this.flatDeps();
    this.generate(flatDepMap);
  }

  private collectModules(): void {
    const entryBuildResult = this.build(this.entry);
    this.modules.push(entryBuildResult);

    // recursive build dep
    this.modules.forEach(item => {
      if (item.deps) {
        const depsKeyArr = Object.keys(item.deps)

        depsKeyArr.forEach(depKey => {
          const depFilePath = item.deps[depKey];
          if (!this.builtFilepathMap[depFilePath]) {
            this.modules.push(this.build(depFilePath));
          }
        });
      }
    })
  }

  private flatDeps(): IFlatDepMap {
    const flatDepMap = this.modules.reduce((pre, cur) => {
      return {
        ...pre,
        [cur.filepath]: {
          deps: cur.deps,
          code: cur.code,
        }
      }
    }, {} as IFlatDepMap);

    return flatDepMap;
  }

  private generate(flatDepMap: IFlatDepMap): void {
    const outputFilepath = path.resolve(this.output.path, this.output.filename);

    const bundle = `(function(moduleFilepathMap){
      function webpackRequire(moduleId) {
        var curCode = moduleFilepathMap[moduleId].code;
        var curDeps = moduleFilepathMap[moduleId].deps;

        function _requireModule(filepath) {
          return webpackRequire(curDeps[filepath]);
        }

        var exports = {};
        
        (function(require, exports, code){
          eval(code);
        })(_requireModule, exports, curCode)

        return exports;
      }

      webpackRequire('${this.entry}')
    })(${JSON.stringify(flatDepMap)})`;

    if (!fs.existsSync(this.output.path)) {
      fs.mkdirSync(this.output.path);
    }
    return fs.writeFileSync(outputFilepath, bundle, 'utf8');
  }

  private build(filepath: string): IBuildInfo {
    const ast = this.parser.parseSource2Ast(filepath);
    const deps = this.parser.buildDep(ast, filepath);
    const code = this.parser.transformCode(ast);

    this.builtFilepathMap[filepath] = filepath;

    return {
      filepath,
      deps: deps,
      code,
    }
  }
}