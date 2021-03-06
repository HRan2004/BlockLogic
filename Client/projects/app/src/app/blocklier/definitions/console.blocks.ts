import { BlocklierArgumentReader } from '../models/blocklier-argument-reader.class';
import {
  BlocklierCustomBlock,
  BlocklierCustomBlockCode,
  BlocklierCustomBlockWithJavaScript,
} from '../models/blocklier-custom-block.class';
import { helpUrlBuilder } from './common';

const colour = '#0eaf9e';
const helpUrl = helpUrlBuilder('console');

@BlocklierCustomBlock.register({
  type: 'console_show',
  lines: [
    {
      message: '%1 控制台 ',
      args: [
        {
          type: 'field_dropdown',
          name: 'VALUE',
          options: [
            ['显示', 'show'],
            ['隐藏', 'hide'],
          ],
        },
      ],
    },
  ],
  colour,
  previousStatement: null,
  nextStatement: null,
  tooltip: '显示或隐藏控制台',
  helpUrl: helpUrl('consoleshow'),
})
export class ConsoleShowBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const value = args.value('VALUE');
    return `console.${value}();\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_clear',
  lines: [{ message: '清空控制台' }],
  colour,
  previousStatement: null,
  nextStatement: null,
  tooltip: '清空控制台所有日志',
  helpUrl: helpUrl('consoleclear'),
})
export class ConsoleClearBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(): BlocklierCustomBlockCode {
    return `console.clear();\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_output',
  lines: [
    {
      message: '%1 输出 %2',
      args: [
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['普通', 'log'],
            ['重要', 'info'],
            ['警告', 'warn'],
            ['错误', 'error'],
            ['观察', 'verbose'],
            ['断言', 'assert'],
          ],
        },
        { type: 'input_value', name: 'CONTENT' },
      ],
    },
  ],
  style: 'console_blocks',
  previousStatement: null,
  nextStatement: null,
  tooltip: '在控制台上输出信息',
  helpUrl: helpUrl('consolelogdata-args'),
})
export class ConsoleOutputBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const type = args.value('TYPE');
    const content = args.code('CONTENT');
    return `console.${type}(${content});\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_time',
  lines: [
    {
      message: '%1 定时器 名称 %2',
      args: [
        {
          type: 'field_dropdown',
          name: 'TYPE',
          options: [
            ['启动', 'time'],
            ['停止', 'timeEnd'],
          ],
        },
        { type: 'input_value', name: 'NAME', check: 'String' },
      ],
    },
  ],
  colour,
  previousStatement: null,
  nextStatement: null,
  tooltip: '启动一个定时器，用以计算一个操作的持续时间',
  helpUrl: helpUrl('consoletimelabel'),
})
export class ConsoleTimeBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const type = args.value('TYPE');
    const name = args.code('NAME');
    return `console.${type}(${name});\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_set_size',
  lines: [
    {
      message: '设置控制台大小  宽 %1 高 %2',
      args: [
        { type: 'input_value', name: 'WIDTH', check: 'Number' },
        { type: 'input_value', name: 'HEIGHT', check: 'Number' },
      ],
    },
  ],
  colour,
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  tooltip: '设置控制台的大小，单位像素。',
  helpUrl: helpUrl('consolesetsizew-h'),
})
export class ConsoleSetSizeBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const width = args.code('width');
    const height = args.code('height');
    return `console.setSize(${width}, ${height});\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_set_position',
  lines: [
    {
      message: '设置控制台位置  X %1 Y %2',
      args: [
        { type: 'input_value', name: 'X', check: 'Number' },
        { type: 'input_value', name: 'Y', check: 'Number' },
      ],
    },
  ],
  colour,
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  tooltip: '设置控制台的位置，单位像素。',
  helpUrl: helpUrl('consolesetpositionx-y'),
})
export class ConsoleSetPositionBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const x = args.code('X');
    const y = args.code('Y');
    return `console.setPosition(${x}, ${y});\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_config',
  lines: [
    { message: '设置控制台配置' },
    {
      message: ' %1',
      args: [{ type: 'input_statement', check: 'ConsoleConfig', name: 'DO' }],
    },
  ],
  colour,
  previousStatement: null,
  nextStatement: null,
  tooltip: '设置日志保存的路径和配置',
  helpUrl: helpUrl('consolesetgloballogconfigconfig'),
})
export class ConsoleConfigBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(): BlocklierCustomBlockCode {
    // TODO:
    // let branch = Blockly.JavaScript.statementToCode(this.block, 'DO');
    // branch = Blockly.JavaScript.addLoopTrap(branch, this.block);
    // return `console.setGlobalLogConfig({${branch}});\n`;
    return '';
  }
}

@BlocklierCustomBlock.register({
  type: 'console_config_path',
  lines: [
    {
      message: '配置-保存路径 %1',
      args: [
        {
          type: 'input_value',
          name: 'VALUE',
          check: 'String',
          text: '/sdcard/1.txt',
        },
      ],
    },
  ],
  colour,
  previousStatement: 'ConsoleConfig',
  nextStatement: 'ConsoleConfig',
  tooltip: '日志保存路径',
  helpUrl: helpUrl('consolesetgloballogconfigconfig'),
})
export class ConsoleConfigPathBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const path = args.code('VALUE');
    return `'path': ${path},\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_config_file_size',
  lines: [
    {
      message: '配置-文件大小 %1',
      args: [
        { type: 'input_value', name: 'VALUE', check: 'Number', text: '512' },
      ],
    },
  ],
  colour,
  previousStatement: 'ConsoleConfig',
  nextStatement: 'ConsoleConfig',
  tooltip: '最大文件大小',
  helpUrl: helpUrl('consolesetgloballogconfigconfig'),
})
export class ConsoleConfigFileSizeBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const value = args.code('VALUE');
    return `'maxFileSize': ${value},\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_config_level',
  lines: [
    {
      message: '配置-写入级别 %1',
      args: [
        {
          type: 'field_dropdown',
          name: 'VALUE',
          options: [
            ['所有信息 - ALL', 'ALL'],
            ['调试信息 - DEBUG', 'DEBUG'],
            ['输出信息 - INFO', 'INFO'],
            ['警告信息 - WARN', 'WARN'],
            ['错误信息 - ERROR', 'ERROR'],
            ['严重错误信息 - FATAL', 'FATAL'],
            ['关闭 - OFF', 'OFF'],
          ],
        },
      ],
    },
  ],
  colour,
  previousStatement: 'ConsoleConfig',
  nextStatement: 'ConsoleConfig',
  tooltip: '写入的日志级别',
  helpUrl: helpUrl('consolesetgloballogconfigconfig'),
})
export class ConsoleConfigLevelBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const value = args.value('VALUE');
    return `'rootLevel': '${value}',\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_config_backup_size',
  lines: [
    {
      message: '配置-备份数量 %1',
      args: [{ type: 'input_value', name: 'VALUE', check: 'Number' }],
    },
  ],
  colour,
  previousStatement: 'ConsoleConfig',
  nextStatement: 'ConsoleConfig',
  tooltip: '日志备份文件最大数量',
  helpUrl: helpUrl('consolesetgloballogconfigconfig'),
})
export class ConsoleConfigBackupSizeBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const value = args.code('VALUE');
    return `'maxBackupSize': ${value},\n`;
  }
}

@BlocklierCustomBlock.register({
  type: 'console_config_file_pattern',
  lines: [
    {
      message: '配置-写入格式 %1',
      args: [{ type: 'input_value', name: 'VALUE', check: 'String' }],
    },
  ],
  colour,
  previousStatement: 'ConsoleConfig',
  nextStatement: 'ConsoleConfig',
  tooltip: '日志写入格式',
  helpUrl:
    'http://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/PatternLayout.html',
})
export class ConsoleConfigFilePatternBlock
  extends BlocklierCustomBlock
  implements BlocklierCustomBlockWithJavaScript
{
  toJavaScript(args: BlocklierArgumentReader): BlocklierCustomBlockCode {
    const value = args.code('VALUE');
    return `'filePattern': ${value},\n`;
  }
}
