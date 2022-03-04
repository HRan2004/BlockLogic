export const html = `
<link rel="stylesheet" type="text/css" href="assets/space/css/space.css">
<link rel="stylesheet" type="text/css" href="assets/space/css/uieditor.css">
<link rel="stylesheet" type="text/css" href="assets/space/css/drawer.css">
<link rel="stylesheet" type="text/css" href="assets/space/css/btn.css">
<link rel="stylesheet" type="text/css" href="assets/space/css/scrollbar.css">
<link rel="stylesheet" type="text/css" href="assets/third-party/iconfont/iconfont.css">
<link rel="stylesheet" type="text/css" href="assets/third-party/metro-style/metro_style.css">

<div class="tool-bar" id="toolbar">
  <button  class="tool-btn btn-3">
          <span>打开
              <input type="file" class="upload-input" name="file" id="upload" onchange="onUploadFile(this)" accept="text/javascript"/>
          </span>
  </button>
  <button class="tool-btn btn-3" id="run-code" @click="runCode()" title="在网页上运行JS程序，仅支持JS基础语法，不可用扩展函数功能。"><span>运行</span></button>
  <button class="tool-btn btn-3" id="save-code" @click="saveCode()" title="保存文件至本地。文件内容以代码编辑器为准。"><span>保存</span></button>
  <a class="tool-space"></a>
  <a class="tool-space"></a>
  <div class="logic-btns-box" id="logic-btns-box">
      <button class="tool-check btn-9" id="use-unfold-xml"  @click="changeXmlFoldMode($event.target)" title="开启后，用于记录图形块状的XML内容会展开。">展开XML</button>
      <button class="tool-check btn-9" id="use-auto-close"  @click="changeAutoClose($event.target)" title="开启后，选择创造新图形块后，不会自动关闭图形块栏目。">保留栏目</button>
      <button class="tool-check btn-9" id="use-auto-code"   @click="changeAutoCode($event.target)" title="开启后每当修改图形后会自动同步生成代码。">同步代码</button>
      <button class="tool-btn btn-3 tool-btn-m0" id="to-code"  @click="toBlock()"><span>生成图形</span></button>
      <button class="tool-btn btn-3 tool-btn-m0" id="to-block" @click="toCode()"><span>生成代码</span></button>
  </div>
  <custom-select class="ui-target-selector" id="ui-target-selector" ref="selectTarget" :list="list"></custom-select>
  <a class="tool-space"></a>
  <a class="tool-space"></a>

  <select class="tool-select" id="show-mode-selector" onchange="onShowModeChange(this.selectedIndex)">
      <option class="tool-option">图形&代码</option>
      <option class="tool-option">仅显示图形</option>
      <option class="tool-option">仅显示代码</option>
  </select>
  <a class="tool-space"></a>
  <a class="tool-space"></a>
  <select class="tool-select" id="editor-mode-selector" onchange="onEditorModeChange(this.selectedIndex)">
      <option class="tool-option">逻辑模式</option>
      <option class="tool-option">设计模式</option>
  </select>
  <a class="tool-middle"></a>
  <input class="tool-input" placeholder="调试设备IP" v-model="path" id="input-ip" type="text">
  <button class="tool-btn btn-2" id="connect" @click="connect()" title="连接调试设备。">连接</button>
  <button class="tool-btn btn-2" id="run" @click="originRun()" title="在远程连接的设备上运行程序。">运行</button>
  <button class="tool-btn btn-2" id="push" @click="push()" title="将文件保存到已连接的设备中。默认路径为:/SD卡/脚本/。">保存</button>
  <a class="tool-space"></a>
  <button class="tool-btn btn-2" id="ask" onclick="window.open('docs#/start/Connect')">连接教程</button>
</div>

<div class="main">
  <div class="dc" id="dc">
      <div class="dc-list dc-list-left" id="dc-list-left">
      </div>
      <div class="dc-flex" id="dc-flex">
          <div class="dc-drawers dc-drawers-left" id="dc-drawers-left">
          </div>
          <div class="dc-main" id="dc-main">
              <div class="editor-container">
                  <div class="draw-space" id="draw-space">
                      <div class="logic-mode" id="logic-mode">
                          <div id="side-bar" class="side-bar">
                              <h1><a href="https://pro.autojs.org/docs/#/zh-cn/?id=%e7%bb%bc%e8%bf%b0">Auto.Js Pro</a></h1>
                              <h2><a>BlockLogic</a></h2>
                              <ul class="first-parent">
                                  <li class="first-item" v-for="item in list">
                                      <a class="first-title" @click="showChildren(item)" :style="{'color':item.color,'border-right':item.right}">{{item.name}}</a>
                                      <ul class="second-parent" v-show="item.isShow">
                                          <li class="second-item" @click="showBlocks(sub)" v-for="sub in item.sub">
                                              <div class="icon" :style="{'border-color':sub.icon,'background-color':sub.bg}"></div>
                                              <a :style="{'color':sub.color}">{{sub.name}}</a>
                                          </li>
                                      </ul>
                                  </li>
                              </ul>
                          </div>
                          <div class="draw-holder" id="draw-holder">
                              <div class="draw" id="draw"></div>
                          </div>
                      </div>
                      <div class="ui-mode" id="ui-mode">
                          <div id="preview-space" class="drawer preview-space">
                              <div class="temp-text">预览区<br/>开发中</div>
                          </div>
                      </div>
                  </div>
                  <div class="vertical-split-line" id="main-split-line"><div></div></div>
                  <div class="editor-space" id="editor-space">
                      <div class="editor" id="editor"></div>
                  </div>
              </div>
          </div>
          <div class="dc-drawers dc-drawers-right" id="dc-drawers-right">
          </div>
      </div>
      <div class="dc-list dc-list-right" id="dc-list-right">
      </div>
  </div>
</div>

<div class="status-bar" id="status-bar">
  <a class="left-tip status-tip" id="left-tip">正在初始化编辑器...</a>
  <a class="right-tip status-tip" id="right-tip">正在打开项目...</a>
</div>

</div>

<div id="follow-box" class="follow-box">
  <div id="follow-title" class="follow-title"></div>
  <div id="follow-split" class="follow-split"></div>
  <div id="follow-msg" class="follow-msg"></div>
</div>
<div id="move-tip" class="move-tip"></div>
<div id="temp" class="temp" hidden></div>

<drawers hidden>
  <div id="directory-space" class="directory-space">
      <ul id="directory-tree" class="ztree"></ul>
  </div>
  <div class="console-space" id="console-space">
      <ul class="console-box" id="console-box">
          <li class="console-item" v-for="item in list">
              <a>{{item}}</a>
              <div class="console-split"></div>
          </li>
      </ul>
  </div>
  <div id="new-space" class="drawer new-space">
      <div id="new-show" class="new-show"></div>
  </div>
  <div id="tree-space" class="drawer tree-space">
      <div id="tree-show" class="tree-show"></div>
  </div>
  <div id="structure-space" class="structure-space">
      <div id="structure-show" class="structure-show"></div>
  </div>
  <div id="attr-space" class="drawer attr-space">
      <div id="attr-show" class="attr-show">
      </div>
  </div>
</drawers>


<script type="text/x-template" id="dropdown">
    <div class="dropdown" v-if="options">
        <!-- Dropdown Input -->
        <input  class="dropdown-input"
                :type="type"
                v-model="input_value"
                @focus="showOptions()"
                @blur="exit()"
                @keyup="keyMonitor"
                @input="input_value = inputRule(type)" />
        <!-- Dropdown Menu -->
        <div class="dropdown-content" v-show="optionsShown">
            <div    class="dropdown-item"
                    @mousedown="selectOption(option)"
                    v-for="(option, index) in filteredOptions"
                    :key="index">
                {{ option || '-' }}
            </div>
        </div>
    </div>
</script>

<script src="assets/space/js/blockly/blockly_compressed.js"></script>
<script src="assets/space/js/blockly/blocks_compressed.js"></script>
<script src="assets/space/js/blockly/javascript_compressed.js"></script>
<script src="assets/space/js/blockly/zh-hans.js"></script>

<script src="assets/third-party/require/require.js"></script>
<script src="assets/third-party/jquery/jquery.main.min.js"></script>

<script src="assets/space/js/utils/string_utils.js"></script>
<script src="assets/space/js/utils/code_utils.js"></script>
<script src="assets/space/js/utils/view_utils.js"></script>
<script src="assets/space/js/utils/ace_utils.js"></script>
<script src="assets/space/js/utils/follow_utils.js"></script>

<script src="assets/space/js/modules/debug_plugin.js"></script>
<script src="assets/space/js/modules/draw_view.js"></script>
<script src="assets/space/js/modules/files_view.js"></script>
<script src="assets/space/js/modules/drawer_controller.js"></script>
<script src="assets/space/js/modules/run_online_functions.js"></script>
<script src="assets/space/js/uieditor.js"></script>
<script src="assets/space/js/space.js"></script>

<message>
    <Widgets>
        <WidgetGroup name="布局">
            <Widget name="drawer" example="&lt;drawer&gt;&lt;/drawer&gt;" summary="抽屉布局 可从侧边拉出页面" type="VG" />
            <Widget name="frame" example="&lt;frame&gt;&lt;/frame&gt;" summary="帧布局 内部控件将任意重叠排列" type="VG" />
            <Widget name="grid" example="&lt;grid&gt;&lt;/grid&gt;" summary="表格布局 表格状排布布局" type="VG" />
            <Widget name="horizontal" example="&lt;horizontal&gt;&lt;/horizontal&gt;" summary="水平布局 内部控件将水平排列" type="VG" />
            <Widget name="linear" example="&lt;linear&gt;&lt;/linear&gt;" summary="线性布局 内部控件将水平或垂直线性排列" type="VG" />
            <Widget name="list" example="&lt;list&gt;&lt;/list&gt;" summary="列表布局 用于呈现列表类数据 等价安卓RecyclerView" type="VG" />
            <Widget name="relative" example="&lt;relative&gt;&lt;/relative&gt;" summary="相对布局 内部控件可相对其他控件设置位置" type="VG" />
            <Widget name="vertical" example="&lt;vertical&gt;&lt;/vertical&gt;" summary="垂直布局 内部控件将垂直排列" type="VG" />
            <Widget name="viewpager" example="&lt;viewpager&gt;&lt;/viewpager&gt;" summary="多页布局 可有多个可左右活动的页面" type="VG" />
        </WidgetGroup>
        <WidgetGroup name="控件">
            <Widget name="appbar" example="&lt;appbar/&gt;" summary="App标题栏控件" type="V" />
            <Widget name="button" example="&lt;button/&gt;" summary="按钮控件" type="V" />
            <Widget name="card" example="&lt;card/&gt;" summary="卡片控件" type="V" />
            <Widget name="checkbox" example="&lt;checkbox/&gt;" summary="[支持绑定] 复选框控件" type="V" />
            <Widget name="datepicker" example="&lt;datepicker/&gt;" summary="日期选择控件" type="V" />
            <Widget name="fab" example="&lt;fab/&gt;" summary="浮动按钮控件" type="V" />
            <Widget name="icon" example="&lt;icon/&gt;" summary="图标控件" type="V" />
            <Widget name="img" example="&lt;img/&gt;" summary="图片控件" type="V" />
            <Widget name="input" example="&lt;input/&gt;" summary="[支持绑定] 输入框控件" type="V" />
            <Widget name="progressbar" example="&lt;progressbar/&gt;" summary="进度条控件" type="V" />
            <Widget name="radio" example="&lt;radio/&gt;" summary="[支持绑定] 单选框控件" type="V" />
            <Widget name="radiogroup" example="&lt;radiogroup/&gt;" summary="单选框组控件" type="V" />
            <Widget name="seekbar" example="&lt;seekbar/&gt;" summary="[支持绑定] 拖动条控件" type="V" />
            <Widget name="spinner" example="&lt;spinner/&gt;" summary="[支持绑定] 下拉菜单控件" type="V" />
            <Widget name="Switch" example="&lt;Switch/&gt;" summary="[支持绑定] 开关控件" type="V" />
            <Widget name="text" example="&lt;text/&gt;" summary="文本控件" type="V" />
            <Widget name="timepicker" example="&lt;timepicker/&gt;" summary="时间选择控件" type="V" />
            <Widget name="webview" example="&lt;webview/&gt;" summary="网页控件" type="V" />
        </WidgetGroup>
        <WidgetGroup name="Android布局">
            <Widget name="AppBarLayout" example="&lt;AppBarLayout&gt;&lt;/AppBarLayout&gt;" summary="App顶栏布局" type="VG" />
            <Widget name="BottomAppBar" example="&lt;BottomAppBar&gt;&lt;/BottomAppBar&gt;" summary="底栏布局" type="VG" />
            <Widget name="CardView" example="&lt;CardView&gt;&lt;/CardView&gt;" summary="卡片布局" type="VG" />
            <Widget name="ConstraintLayout" example="&lt;ConstraintLayout&gt;&lt;/ConstraintLayout&gt;" summary="约束布局" type="VG" />
            <Widget name="FrameLayout" example="&lt;FrameLayout&gt;&lt;/FrameLayout&gt;" summary="帧布局" type="VG" />
            <Widget name="GridLayout" example="&lt;GridLayout&gt;&lt;/GridLayout&gt;" summary="表格布局" type="VG" />
            <Widget name="LinearLayout" example="&lt;LinearLayout&gt;&lt;/LinearLayout&gt;" summary="线性布局" type="VG" />
            <Widget name="NavigationView" example="&lt;NavigationView&gt;&lt;/NavigationView&gt;" summary="导航布局" type="VG" />
            <Widget name="RecyclerView" example="&lt;RecyclerView&gt;&lt;/RecyclerView&gt;" summary="重复布局" type="VG" />
            <Widget name="ScrollView" example="&lt;ScrollView&gt;&lt;/ScrollView&gt;" summary="滚动布局" type="VG" />
            <Widget name="TabItem" example="&lt;TabItem&gt;&lt;/TabItem&gt;" summary="切换指示器" type="VG" />
            <Widget name="TabLayout" example="&lt;TabLayout&gt;&lt;/TabLayout&gt;" summary="切换指示器组" type="VG" />
            <Widget name="TableLayout" example="&lt;TableLayout&gt;&lt;/TableLayout&gt;" summary="表格布局" type="VG" />
            <Widget name="TableRow" example="&lt;TableRow&gt;&lt;/TableRow&gt;" summary="表格行布局" type="VG" />
            <Widget name="ToolBar" example="&lt;ToolBar&gt;&lt;/ToolBar&gt;" summary="工具栏布局" type="VG" />
        </WidgetGroup>
        <WidgetGroup name="Android控件">
            <Widget name="AdView" example="&lt;AdView/&gt;" summary="广告控件" type="V" />
            <Widget name="Barrier" example="&lt;Barrier/&gt;" summary="定位块" type="V" />
            <Widget name="Button" example="&lt;Button/&gt;" summary="按钮控件" type="V" />
            <Widget name="CalendarView" example="&lt;CalendarView/&gt;" summary="日期控件" type="V" />
            <Widget name="CheckBox" example="&lt;CheckBox/&gt;" summary="复选框控件" type="V" />
            <Widget name="Chip" example="&lt;Chip/&gt;" summary="标签" type="V" />
            <Widget name="ChipGroup" example="&lt;ChipGroup/&gt;" summary="标签流组件" type="V" />
            <Widget name="GuideLine" example="&lt;GuideLine/&gt;" summary="定位线" type="V" />
            <Widget name="ImageView" example="&lt;ImageView/&gt;" summary="图片控件" type="V" />
            <Widget name="MapView" example="&lt;MapView/&gt;" summary="地图控件" type="V" />
            <Widget name="MockView" example="&lt;MockView/&gt;" summary="虚拟控件" type="V" />
            <Widget name="ProgressBar" example="&lt;ProgressBar/&gt;" summary="进度条控件" type="V" />
            <Widget name="RadioButton" example="&lt;RadioButton/&gt;" summary="单选框按键" type="V" />
            <Widget name="RadioGroup" example="&lt;RadioGroup/&gt;" summary="单选框组件" type="V" />
            <Widget name="RatingBar" example="&lt;RatingBar/&gt;" summary="打星级控件" type="V" />
            <Widget name="SearchView" example="&lt;SearchView/&gt;" summary="搜索框控件" type="V" />
            <Widget name="SeekBar" example="&lt;SeekBar/&gt;" summary="拖动条控件" type="V" />
            <Widget name="SurfaceView" example="&lt;SurfaceView/&gt;" summary="流媒体控件" type="V" />
            <Widget name="TextView" example="&lt;TextView/&gt;" summary="文本框控件" type="V" />
            <Widget name="ToggleButton" example="&lt;ToggleButton/&gt;" summary="开关控件" type="V" />
            <Widget name="VideoView" example="&lt;VideoView/&gt;" summary="视频控件" type="V" />
            <Widget name="View" example="&lt;View/&gt;" summary="基础控件" type="V" />
            <Widget name="WebView" example="&lt;WebView/&gt;" summary="网页控件" type="V" />
        </WidgetGroup>
    </Widgets>
    <Attrs>
        <Attr name="id" tip="控件id，不能重复使用">
            <opt value="id"/>
        </Attr>
        <Attr name="w" tip="控件宽度">
            <opt value="*" key="尽可能填满父控件"/>
            <opt value="auto" key="自动计算(经量小)"/>
        </Attr>
        <Attr name="h"  tip="控件高度">
            <opt value="*" key="尽可能填满父控件"/>
            <opt value="auto" key="自动计算(经量小)"/>
        </Attr>
        <Attr name="layout_width">
            <opt value="match_parent"/>
            <opt value="wrap_content"/>
        </Attr>
        <Attr name="layout_height">
            <opt value="match_parent"/>
            <opt value="wrap_content"/>
        </Attr>
        <Attr name="gravity"  tip="内部子控件的重力方向">
            <opt value="center" key="中央"/>
            <opt value="center_vertical" key="垂直居中"/>
            <opt value="center_horizontal" key="水平居中"/>
            <opt value="top" key="靠上"/>
            <opt value="left" key="靠左"/>
            <opt value="right" key="靠右"/>
            <opt value="bottom" key="靠下"/>
        </Attr>
        <Attr name="layout_gravity" tip="自身在父布局的重力方向">
            <opt value="center" key="中央"/>
            <opt value="center_vertical" key="垂直居中"/>
            <opt value="center_horizontal" key="水平居中"/>
            <opt value="top" key="靠上"/>
            <opt value="left" key="靠左"/>
            <opt value="right" key="靠右"/>
            <opt value="bottom" key="靠下"/>
        </Attr>
        <Attr name="bg" tip="背景 可以是颜色，图片，或drawable资源等">
            <opt value="./"/>
            <opt value="/sdcard/"/>
        </Attr>
        <Attr name="visibility" tip="控件是否可见">
            <opt value="gone" key="不显示且不占空间"/>
            <opt value="visible" key="显示且占空间"/>
            <opt value="invisible" key="不显示但占空间"/>
        </Attr>
        <Attr name="typeface" tip="字体">
            <opt value="normal"/>
            <opt value="sans"/>
            <opt value="serif"/>
            <opt value="monospace"/>
        </Attr>
        <Attr name="ellipsize">
            <opt value="end"/>
            <opt value="marquee"/>
            <opt value="middle"/>
            <opt value="none"/>
            <opt value="start"/>
        </Attr>
        <Attr name="autoLink">
            <opt value="all"/>
            <opt value="email"/>
            <opt value="map"/>
            <opt value="none"/>
            <opt value="phone"/>
            <opt value="web"/>
        </Attr>
        <Attr name="inputType"  tip="输入类型 详情见文档">
            <opt value="date"/>
            <opt value="datetime"/>
            <opt value="none"/>
            <opt value="number"/>
            <opt value="numberDecimal"/>
            <opt value="numberPassword"/>
            <opt value="numberSigned"/>
            <opt value="phone"/>
            <opt value="text"/>
            <opt value="textAutoCorrect"/>
            <opt value="textPassword"/>
            <opt value="textUri"/>
            <opt value="textVisiblePassword"/>
            <opt value="time"/>
        </Attr>
        <Attr name="password"  tip="设置为true后内部文字会显示成*">
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
        <Attr name="numeric">
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
        <Attr name="phoneNumber" >
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
        <Attr name="singleLine"  tip="仅有一行">
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
        <Attr name="src" tip="资源路径">
            <opt value="http" key="//"/>
            <opt value="file" key="//"/>
            <opt value="data" key="image/png;base64,"/>
        </Attr>
        <Attr name="scaleType"  tip="图片适应方式 详情见文档">
            <opt value="center"/>
            <opt value="centerCrop"/>
            <opt value="centerInside"/>
            <opt value="fitCenter"/>
            <opt value="fitEnd"/>
            <opt value="fitStart"/>
            <opt value="fitXY"/>
            <opt value="matrix"/>
        </Attr>
        <Attr name="checked"  tip="是否选中">
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
        <Attr name="indeterminate">
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
        <Attr name="circle">
            <opt value="true"/>
            <opt value="false"/>
        </Attr>
    </Attrs>
</message>
<xml id="toolbox" style="display: none">
    <category name="Base">
        <block type="controls_if"></block>
        <block type="controls_repeat_ext">
            <value name="TIMES">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="console_output">
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_alert">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="explain"></block>
        <block type="math_number" gap="32">
            <field name="NUM">123</field>
        </block>
        <block type="globals_random">
            <value name="MIN">
                <shadow type="math_number"></shadow>
            </value>
            <value name="MAX">
                <shadow type="math_number"></shadow>
            </value>
        </block>
        <block type="text"></block>
        <block type="math_arithmetic">
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="B">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="logic_compare"></block>
        <block type="globals_sleep">
            <value name="VALUE">
                <shadow type="math_number">
                </shadow>
            </value>
        </block>
        <block type="var_function_wc"></block>
        <block type="var_function_return"></block>
        <block type="var_function"></block>
    </category>
    <category name="Loops" categorystyle="loop_category">
        <block type="controls_repeat_ext">
            <value name="TIMES">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="controls_repeat"></block>
        <block type="controls_whileUntil"></block>
        <block type="controls_for">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
            <value name="BY">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="controls_forEach"></block>
        <block type="controls_flow_statements"></block>
    </category>
    <category name="Variables" categorystyle="variable_category" custom="VARIABLE"></category>
    <category name="Functions" categorystyle="procedure_category" custom="PROCEDURE"></category>
    <category name="Logic" categorystyle="logic_category">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
        <block type="logic_null"></block>
        <block type="logic_ternary"></block>
    </category>
    <category name="Math" categorystyle="math_category">
        <block type="math_number" gap="32">
            <field name="NUM">123</field>
        </block>
        <block type="math_arithmetic">
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="B">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="math_single">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">9</field>
                </shadow>
            </value>
        </block>
        <block type="math_trig">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">45</field>
                </shadow>
            </value>
        </block>
        <block type="math_constant"></block>
        <block type="math_number_property">
            <value name="NUMBER_TO_CHECK">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="math_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">3.1</field>
                </shadow>
            </value>
        </block>
        <block type="math_on_list"></block>
        <block type="math_modulo">
            <value name="DIVIDEND">
                <shadow type="math_number">
                    <field name="NUM">64</field>
                </shadow>
            </value>
            <value name="DIVISOR">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="math_constrain">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="LOW">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="HIGH">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="math_random_int">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="math_random_float"></block>
        <block type="math_atan2">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Text" categorystyle="text_category">
        <block type="text"></block>
        <block type="text_multiline"></block>
        <block type="text_join"></block>
        <block type="text_to_int"></block>
        <block type="text_to_float"></block>
        <block type="number_to_text"></block>
        <block type="text_append">
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="text_length">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_isEmpty">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="text_indexOf">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">text</field>
                </block>
            </value>
            <value name="FIND">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_charAt">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">text</field>
                </block>
            </value>
        </block>
        <block type="text_getSubstring">
            <value name="STRING">
                <block type="variables_get">
                    <field name="VAR">text</field>
                </block>
            </value>
        </block>
        <block type="text_changeCase">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_trim">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_count">
            <value name="SUB">
                <shadow type="text"></shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="text_replace">
            <value name="FROM">
                <shadow type="text"></shadow>
            </value>
            <value name="TO">
                <shadow type="text"></shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="text_reverse">
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <label text="Input/Output:" web-class="ioLabel"></label>
        <block type="text_print">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="text_prompt_ext">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Lists" categorystyle="list_category">
        <block type="lists_create_with">
            <mutation items="0"></mutation>
        </block>
        <block type="lists_create_with"></block>
        <block type="lists_get">
            <value name="ARRAY">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
            <value name="INDEX">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="lists_set">
            <value name="ARRAY">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
            <value name="INDEX">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="lists_repeat">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
        </block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_indexOf">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_getIndex">
            <value name="VALUE">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_setIndex">
            <value name="LIST">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_getSublist">
            <value name="LIST">
                <block type="variables_get">
                    <field name="VAR">list</field>
                </block>
            </value>
        </block>
        <block type="lists_split">
            <value name="DELIM">
                <shadow type="text">
                    <field name="TEXT">,</field>
                </shadow>
            </value>
        </block>
        <block type="lists_sort"></block>
        <block type="lists_reverse"></block>
    </category>
    <category name="Colour" categorystyle="colour_category">
        <block type="colour_picker"></block>
        <block type="colour_random"></block>
        <block type="colour_rgb">
            <value name="RED">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
            <value name="GREEN">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="BLUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="colour_blend">
            <value name="COLOUR1">
                <shadow type="colour_picker">
                    <field name="COLOUR">#ff0000</field>
                </shadow>
            </value>
            <value name="COLOUR2">
                <shadow type="colour_picker">
                    <field name="COLOUR">#3333ff</field>
                </shadow>
            </value>
            <value name="RATIO">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Coordinate">
        <block type="coordinate_set_screen">
            <value name="W">
                <shadow type="math_number">
                    <field name="NUM">1080</field>
                </shadow>
            </value>
            <value name="H">
                <shadow type="math_number">
                    <field name="NUM">1920</field>
                </shadow>
            </value>
        </block>
        <block type="coordinate_click">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="coordinate_long_click">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="coordinate_press">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="coordinate_swipe">
            <value name="X1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="coordinate_root_tap">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="coordinate_root_swipe">
            <value name="X1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Widget">
        <block type="widget_do_text">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="puzzle"></block>
        <block type="widget_algorithm"></block>
        <block type="widget_attr_selector">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="widget_status_selector"></block>
        <block type="widget_selectors_join"></block>
        <block type="widget_find_one"></block>
        <block type="widget_find_once"></block>
        <block type="widget_until_find"></block>
        <block type="widget_find"></block>
        <block type="widget_exists"></block>
        <block type="widget_wait"></block>
        <block type="widget_operate"></block>
        <block type="puzzle">
            <value name="VALUE">
                <block type="widget_operate">
                    <value name="WIDGET">
                        <block type="widget_find_one">
                            <value name="SELECTOR">
                                <block type="widget_attr_selector">
                                    <value name="VALUE">
                                        <shadow type="text"></shadow>
                                    </value>
                                </block>
                            </value>
                        </block>
                    </value>
                </block>
            </value>
        </block>
        <block type="widget_set_text">
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="widget_get_attr"></block>
        <block type="widget_parent"></block>
        <block type="widget_children"></block>
    </category>
    <category name="Auto">
        <block type="auto_wait_for"></block>
        <block type="auto_set_mode"></block>
        <block type="auto_set_flags"></block>
        <block type="auto_service"></block>
        <block type="auto_windows"></block>
        <block type="auto_root"></block>
        <block type="auto_root_in_active_window"></block>
        <block type="auto_set_window_filter"></block>
    </category>
    <category name="Automator">
        <block type="automator_new"></block>
        <block type="automator_tap">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="automator_long_press">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="automator_press">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="automator_swipe">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="automator_touch_down">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="automator_touch_move">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="automator_touch_up">
            <value name="F">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Simple">
        <block type="puzzle"></block>
        <block type="simple_click">
            <value name="I">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="simple_long_click">
            <value name="I">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="simple_scroll_up">
            <value name="I">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="simple_scroll_down">
            <value name="I">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="simple_set_text">
            <value name="I">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="simple_input">
            <value name="I">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
    </category>
    <category name="Puzzle">
        <block type="puzzle"></block>
        <block type="explain"></block>
        <block type="explain_multi"></block>
        <block type="puzzle_block_attr"></block>
        <block type="puzzle_block"></block>
        <block type="puzzle_block_attr"></block>
        <block type="puzzle_block"></block>
        <block type="puzzle_block_attr"></block>
        <block type="puzzle_block"></block>
        <block type="puzzle_block_attr"></block>
        <block type="puzzle_block"></block>
    </category>
    <category name="Device">
        <block type="device_get_brightness"></block>
        <block type="device_get_brightness_mode"></block>
        <block type="device_set_brightness">
            <value name="BRIGHTNESS">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="device_set_brightness_mode">
            <value name="BRIGHTNESS_MODE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="device_get_music_volume"></block>
        <block type="device_get_notification_volume"></block>
        <block type="device_get_alarm_volume"></block>
        <block type="device_get_music_max_volume"></block>
        <block type="get_notification_max_volume"></block>
        <block type="get_alarm_max_volume"></block>
        <block type="device_set_music_volume">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="device_set_notification_volume">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="device_set_alarm_volume">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="get_battery"></block>
        <block type="is_charging"></block>
        <block type="get_total_mem"></block>
        <block type="get_avail_mem"></block>
        <block type="is_screen_on"></block>
        <block type="wake_up"></block>
        <block type="wake_up_if_needed"></block>
        <block type="keep_screen_on">
            <value name="TIMEOUT">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="keep_screen_dim">
            <value name="TIMEOUT">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="cancel_keeping_awake"></block>
        <block type="vibrate">
            <value name="TIME">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="cancel_vibration"></block>
    </category>
    <category name="DeviceMsg">
        <block type="device_width"></block>
        <block type="device_height"></block>
        <block type="device_build_id"></block>
        <block type="device_broad"></block>
        <block type="device_brand"></block>
        <block type="device_device"></block>
        <block type="device_model"></block>
        <block type="device_product"></block>
        <block type="device_bootloader"></block>
        <block type="device_hardware"></block>
        <block type="device_fingerprint"></block>
        <block type="device_serial"></block>
        <block type="device_sdk_int"></block>
        <block type="device_incremental"></block>
        <block type="device_release"></block>
        <block type="device_base_os"></block>
        <block type="device_security_patch"></block>
        <block type="device_codename"></block>
        <block type="device_get_imei"></block>
        <block type="device_get_android_id"></block>
        <block type="device_get_mac_address"></block>
    </category>
    <category name="Console">
        <block type="console_show"></block>
        <block type="console_clear"></block>
        <block type="console_output">
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="console_time">
            <value name="NAME">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="console_set_size">
            <value name="WIDTH">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="HEIGHT">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="console_set_position">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="console_config"></block>
        <block type="console_config_path">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">/sdcard/a.txt</field>
                </shadow>
            </value>
        </block>
        <block type="console_config_file_size">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">512</field>
                </shadow>
            </value>
        </block>
        <block type="console_config_level"></block>
        <block type="console_config_backup_size">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
        </block>
        <block type="console_config_file_pattern">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
    </category>
    <category name="Http">
        <block type="http_get">
            <value name="URL">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="http_post">
            <value name="URL">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="http_post_json">
            <value name="URL">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="http_post_multipart">
            <value name="URL">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="http_request">
            <value name="URL">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="http_response"></block>
        <block type="http_options_container"></block>
        <block type="http_option_headers"></block>
        <block type="http_option_method"></block>
        <block type="http_option_content_type">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="http_option_body"></block>
    </category>
    <category name="Dialogs">
        <block type="dialogs_alert">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_input">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_select">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_alert_callback">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_input_callback">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_select_callback">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
        </block>
    </category>
    <category name="Globals">
        <block type="globals_sleep">
            <value name="VALUE">
                <shadow type="math_number">
                </shadow>
            </value>
        </block>
        <block type="globals_current_package"></block>
        <block type="globals_current_activity"></block>
        <block type="globals_set_clip">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="globals_get_clip"></block>
        <block type="globals_toast">
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="globals_wait_for_activity">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="globals_wait_for_package">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="globals_exit"></block>

        <block type="globals_random">
            <value name="MIN">
                <shadow type="math_number"></shadow>
            </value>
            <value name="MAX">
                <shadow type="math_number"></shadow>
            </value>
        </block>

        <block type="globals_random_float"></block>
        <block type="globals_requires_api">
        </block>
        <block type="globals_requires_version">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="globals_request_permissions"></block>
        <block type="globals_load_jar">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="globals_load_dex">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
    </category>
    <category name="Storages">
        <block type="storages_create">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="storages_get">
            <value name="STORAGE">
                <block type="variables_get">
                    <field name="VAR">storage</field>
                </block>
            </value>
            <value name="KEY">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="storages_put">
            <value name="STORAGE">
                <block type="variables_get">
                    <field name="VAR">storage</field>
                </block>
            </value>
            <value name="KEY">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="storages_remove">
            <value name="STORAGE">
                <block type="variables_get">
                    <field name="VAR">storage</field>
                </block>
            </value>
            <value name="KEY">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="storages_contains">
            <value name="STORAGE">
                <block type="variables_get">
                    <field name="VAR">storage</field>
                </block>
            </value>
            <value name="KEY">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="storages_clear">
            <value name="STORAGE">
                <block type="variables_get">
                    <field name="VAR">storage</field>
                </block>
            </value>
        </block>
    </category>
    <category name="Files">
        <block type="files_is_file">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_is_dir">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_is_empty_dir_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_join">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_create_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_create_with_dirs_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_exists_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_ensure_dir_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_read_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_read_bytes_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_write_path_text">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_write_bytes_path_bytes">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_append_path_text">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_append_bytes_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_copy">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_move">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_rename_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_rename_without_extension_path">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_getname">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_getname_without_extension">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_remove">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_remove_dir">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_getsdcard_path"></block>
        <block type="files_cwd"></block>
        <block type="files_path_relative">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="files_list_dir">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VALUE">
                <block type="var_function"></block>
            </value>
        </block>
    </category>
    <category name="Media">
        <block type="media_scan_file">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="media_play_music">
            <value name="PATH">
                <shadow type="text"></shadow>
            </value>
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="LOOPING">
                <shadow type="logic_boolean"></shadow>
            </value>
        </block>
        <block type="media_music_seek_to">
            <value name="MSEC">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="media_pause_music"></block>
        <block type="media_resume_music"></block>
        <block type="media_stop_music"></block>
        <block type="media_is_music_playing"></block>
        <block type="media_get_music_duration"></block>
        <block type="media_get_music_current_position"></block>
    </category>
    <category name="App">
        <block type="app_version_code"></block>
        <block type="app_version_name"></block>
        <block type="app_autojs"></block>
        <block type="app_launch">
            <value name="PACKAGE_NAME">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="app_launch_app">
            <value name="APP_NAME">
                <shadow type="text">
                    <field name="TEXT">Auto.js</field>
                </shadow>
            </value>
        </block>
        <block type="app_get_package_name">
            <value name="PACKAGE">
                <shadow type="text">
                    <field name="TEXT">QQ</field>
                </shadow>
            </value>
        </block>
        <block type="app_get_app_name">
            <value name="GET">
                <shadow type="text">
                    <field name="TEXT">com.tencent.mobileqq</field>
                </shadow>
            </value>
        </block>
        <block type="app_open_app_setting"></block>
        <block type="app_viewfile">
            <value name="VIEWFILE">
                <shadow type="text">
                    <field name="TEXT">/sdcard/1.txt</field>
                </shadow>
            </value>
        </block>
        <block type="app_editfile">
            <value name="EDITFILE">
                <shadow type="text">
                    <field name="TEXT">/sdcard/1.txt</field>
                </shadow>
            </value>
        </block>
        <block type="app_uninstall">
            <value name="UNINSTALL">
                <shadow type="text">
                    <field name="TEXT">com.tencent.mobileqq</field>
                </shadow>
            </value>
        </block>
        <block type="app_openurl">
            <value name="URL">
                <shadow type="text">
                    <field name="TEXT">http://</field>
                </shadow>
            </value>
        </block>
        <block type="app_send_email"></block>
        <block type="app_start_activity">
            <value name="ACTIVITY">
                <shadow type="text">
                    <field name="TEXT">console</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Debug">
        <block type="$debug_dump_hprof">
            <value name="HPROF">
                <shadow type="text">
                    <field name="TEXT">./dump.hprof</field>
                </shadow>
            </value>
        </block>
        <block type="$debug_dump_and_send_hprof"></block>
        <block type="$debug_get_stack_trace">
            <value name="TRACE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="$debug_set_memory_leak_detection_enabled">
            <value name="ENABLED">
                <shadow type="text">
                    <field name="TEXT">true</field>
                </shadow>
            </value>
        </block>
        <block type="$debug_gc"></block>
    </category>
    <category name="Intent">
        <block type="intent_intent"></block>
        <block type="intent_start_activity"></block>
        <block type="intent_send_broadcast"></block>
        <block type="intent_start_service"></block>
        <block type="intent_send_broadcast_by_name"></block>
        <block type="intent_intent_to_shell">
        </block>
        <block type="intent_parse_uri">
            <value name="URI">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="intent_get_uri_for_file">
            <value name="FORFILE">
                <shadow type="text">
                    <field name="TEXT">/sdcard/1.txt</field>
                </shadow>
            </value>
        </block>
        <block type="intent_get_installed_apps"></block>
    </category>
    <category name="Plugins">
        <block type="$plugins_load">
            <value name="LOAD">
                <shadow type="text">
                    <field name="TEXT">org.autojs.plugin.ocr</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Setting">
        <block type="$settings_set_enabled"></block>
        <block type="$settings_is_enabled"></block>
    </category>
    <category name="Powermanager">
        <block type="$power_manager_request_ignore_battery_optimizations2"></block>
        <block type="$power_manager_request_ignore_battery_optimizations"></block>
        <block type="$power_manager_is_ignoring_battery_optimizations"></block>
        <block type="$power_manager_is_ignoring_battery_optimizations2"></block>
    </category>
    <category name="Ui">
        <block type="ui_layout">
            <value name="UI_XML">
                <shadow type="ui_xml"></shadow>
            </value>
        </block>
        <block type="ui_layout_file">
            <value name="FILE_PATH">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="ui_xml"></block>
        <block type="ui_get_attr">
            <value name="NAME">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="ui_set_attr">
            <value name="NAME">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="ui_inflate"></block>
        <block type="ui_run"></block>
        <block type="ui_post">
            <value name="TIME">
                <shadow type="math_number">
                    <field name="NUM">1000</field>
                </shadow>
            </value>
        </block>
        <block type="ui_is_ui_thread"></block>
        <block type="ui_find_view">
            <value name="ID">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="ui_finish"></block>
        <block type="ui_use_android_resources"></block>
        <block type="ui_set_content_view"></block>
        <block type="ui_register_widget">
            <value name="NAME">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="ui_status_bar_color">
            <value name="COLOR">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>

    </category>
    <category name="Usual">
        <block type="auto_wait_for"></block>
        <block type="$settings_set_enabled"></block>
        <value name="ENABLED">
            <shadow type="text">
                <field name="TEXT">true</field>
            </shadow>
        </value>
        </block>
        <block type="globals_sleep">
            <value name="VALUE">
                <shadow type="math_number">
                </shadow>
            </value>
        </block>
        <block type="console_output">
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_alert">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="dialogs_input">
            <value name="TITLE">
                <shadow type="text"></shadow>
            </value>
            <value name="CONTENT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="$plugins_load">
            <value name="LOAD">
                <shadow type="text">
                    <field name="TEXT">org.autojs.plugin.ocr</field>
                </shadow>
            </value>
        </block>
        <block type="$debug_set_memory_leak_detection_enabled"></block>
        <block type="globals_request_permissions"></block>
        <block type="globals_load_jar">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
        <block type="globals_load_dex">
            <value name="VALUE">
                <shadow type="text">
                </shadow>
            </value>
        </block>
    </category>
    <category name="Crypto">
        <block type="crypto_digest">
            <value name="DATA">
                <shadow type="text">
                    <field name="TEXT">abc</field>
                </shadow>
            </value>
        </block>
        <block type="crypto_encrypt">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="crypto_decrypt">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="crypto_generate_key_pair">
            <value name="LENGTH">
                <shadow type="math_number">
                    <field name="NUM">256</field>
                </shadow>
            </value>
        </block>
        <block type="new_crypto_key">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="crypto_key_data"></block>
        <block type="new_key_pair">
            <value name="PUBLIC">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
            <value name="PRIVATE">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
        <block type="crypto_keypair_public"></block>
        <block type="crypto_keypair_private"></block>
    </category>
    <category name="UiText">
        <block type="ui_text_set_text">
            <value name="TEXT">
                <shadow type="text">
                    <field name="TEXT"></field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="UiBtn">
        <block type="ui_btn_on_click"></block>
    </category>
</xml>
`;