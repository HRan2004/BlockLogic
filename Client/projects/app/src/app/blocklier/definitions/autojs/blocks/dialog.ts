import * as Blockly from 'blockly';

const style = 'dialog_blocks';
const baseHelpUrl = 'https://pro.autojs.org/docs/#/zh-cn/dialogs?id=';

Blockly.defineBlocksWithJsonArray([
  {
    type: 'dialogs_alert',
    message0: '对话框 %1  标题 %2 正文 %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['提示框', 'alert'],
          ['确认框', 'confirm'],
        ],
      },
      {
        type: 'input_value',
        name: 'TITLE',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'CONTENT',
        check: 'String',
        align: 'right',
      },
    ],
    style: style,
    inputsInline: false,
    output: null,
    tooltip: '显示一个提示对话框',
    helpUrl: baseHelpUrl + 'dialogsalerttitle-content-callback',
  },
  {
    type: 'dialogs_input',
    message0: '对话框 %1  标题 %2 正文 %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['字符串输入框', 'rawInput'],
          ['通用输入框', 'input'],
        ],
      },
      {
        type: 'input_value',
        name: 'TITLE',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'CONTENT',
        check: 'String',
        align: 'right',
      },
    ],
    style: style,
    inputsInline: false,
    output: null,
    tooltip: '显示一个带输入框的对话框',
    helpUrl: baseHelpUrl + 'dialogsrawinputtitle-prefill-callback',
  },
  {
    type: 'dialogs_select',
    message0: '对话框 %1  标题 %2 数组 %3',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['选项列表框', 'select'],
          ['单选列表框', 'singleChoice'],
          ['多选列表框', 'multiChoice'],
        ],
      },
      {
        type: 'input_value',
        name: 'TITLE',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'CONTENT',
        check: 'Array',
        align: 'right',
      },
    ],
    style: style,
    inputsInline: false,
    output: null,
    tooltip: '显示一个列表对话框',
    helpUrl: baseHelpUrl + 'dialogsselecttitle-items-callback',
  },
  {
    type: 'dialogs_alert_callback',
    message0: '对话框 %1  标题 %2 正文 %3 回调 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['提示框', 'alert'],
          ['确认框', 'confirm'],
        ],
      },
      {
        type: 'input_value',
        name: 'TITLE',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'CONTENT',
        check: 'String',
        align: 'right',
      },
      {
        type: 'input_value',
        name: 'FUNCTION',
        check: 'Function',
        align: 'right',
      },
    ],
    style: style,
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    tooltip: '显示一个提示对话框',
    helpUrl: baseHelpUrl + 'dialogsalerttitle-content-callback',
  },
  {
    type: 'dialogs_input_callback',
    message0: '对话框 %1  标题 %2 正文 %3 回调 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['字符串输入框', 'rawInput'],
          ['通用输入框', 'input'],
        ],
      },
      {
        type: 'input_value',
        name: 'TITLE',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'CONTENT',
        check: 'String',
        align: 'right',
      },
      {
        type: 'input_value',
        name: 'FUNCTION',
        check: 'Function',
        align: 'right',
      },
    ],
    style: style,
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    tooltip: '显示一个带输入框的对话框',
    helpUrl: baseHelpUrl + 'dialogsalerttitle-content-callback',
  },
  {
    type: 'dialogs_select_callback',
    message0: '对话框 %1  标题 %2 数组 %3 回调 %4',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['选项列表框', 'select'],
          ['单选列表框', 'singleChoice'],
          ['多选列表框', 'multiChoice'],
        ],
      },
      {
        type: 'input_value',
        name: 'TITLE',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'CONTENT',
        check: 'Array',
        align: 'right',
      },
      {
        type: 'input_value',
        name: 'FUNCTION',
        check: 'Function',
        align: 'right',
      },
    ],
    style: style,
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    tooltip: '显示一个列表对话框',
    helpUrl: baseHelpUrl + 'dialogsalerttitle-content-callback',
  },
]);
