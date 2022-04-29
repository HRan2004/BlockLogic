import { JavaScript, Python } from '../../_common';

Python['lists_new_coll'] = function (block: any) {
  const mode = block.getFieldValue('MODE');
  if (mode === 'List') {
    const code = '[]';
    return [code, 0];
  } else if (mode === 'Map') {
    const code = `dict()`;
    return [code, 0];
  } else if (mode === 'Tuple') {
    const code = `()`;
    return [code, 0];
  } else if (mode === 'Set') {
    const code = `{}`;
    return [code, 0];
  } else {
    return [`[]`, 0];
  }
};

Python['lists_create_with'] = function (block: any) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
      Python.valueToCode(block, 'ADD' + i, Python.ORDER_NONE) || 'None';
  }
  const code = '[' + elements.join(', ') + ']';
  return [code, 0];
};

Python['lists_dict_new_coll'] = function (block: any) {
  let elements = [];
  for (let i = 0; i < block.itemCount_; i++) {
    let key = block.getFieldValue('KEY' + i);
    let value = Python.valueToCode(block, 'ADD' + i, Python.ORDER_ATOMIC, true) || "''";
    elements.push(`  '${key}': ${value}`);
  }
  const code = '{\n' + elements.join(',\n') + '\n}';
  return [code, Python.ORDER_ATOMIC];
};
