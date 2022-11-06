import { Parser } from './Parser';

export interface IWebpackOptions {
  entry: string;
  output: string;
}

export class Compiler {
  private entry;
  
  private output;

  private modules = [];

  private parser: Parser;

  constructor(options: IWebpackOptions) {
    this.entry = options.entry;
    this.output = options.output;
    this.parser = new Parser();
  }

  public run(): void {
    this.collectModules();
    this.buildDepGraph();
    this.generate();
  }

  private collectModules() {
    const entryBuildResult = this.build(this.entry);
  }

  private buildDepGraph() {}

  private generate() {}

  private build(path: string) {
    const ast = this.parser.getAst(path);
    const deps = this.parser.buildDep(ast, path);
  }
}